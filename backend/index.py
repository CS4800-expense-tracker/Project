import json
import time
from os import getenv, environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import and_, extract
import datetime
from openai import OpenAI
from flask_bcrypt import Bcrypt
import schedule
import threading


import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.webhook_type import WebhookType
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.sandbox_item_fire_webhook_request import SandboxItemFireWebhookRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.api import plaid_api

from sqlalchemy.sql import func


ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
    
app = Flask(__name__)
oauth = OAuth(app)
app.secret_key = env.get("APP_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = env.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
open_api_client = OpenAI()
bcrypt = Bcrypt(app) 


# easier way to switch development and sandbox keys
PLAID_CLIENT_ID = env.get("PLAID_CLIENT_ID")
PLAID_ENV = env.get("PLAID_ENV")
# this won't work for now, cause we need to have a publicly facing webhook for this
# they recommended making a different server running on a diff port for security, but like fuck that too much work
webhook_url = 'https://api.pennywise.money/recieve_plaid_webhook'

PLAID_SECRET = None
host = None
if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox
    PLAID_SECRET = env.get("PLAID_SANDBOX_SECRET")

if PLAID_ENV == 'development':
    host = plaid.Environment.Development
    PLAID_SECRET = env.get("PLAID_DEVELOPMENT_SECRET")

configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
)

api_client = plaid.ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)

""" CREATING TABLES """

# All table names are lower case according to the program. So this "Test" table would be seen as test
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)    
    email = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    plaid_access_token = db.Column(db.Text, nullable=True)
    plaid_item_id = db.Column(db.Text, nullable=True)
    cursor = db.Column(db.String(255), nullable=True)
    password = db.Column(db.String(255), nullable=False)

    ## This defines how the object is returned in string representation
    def __repr__(self):
        return f'<test id={self.user_id}, email={self.email}, name={self.name}, plaid_access_token={self.plaid_access_token}, plaid_item_id={self.plaid_item_id}, password={self.password} />'

class TotalBudget(db.Model):
    budget_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    total_budget = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<test budget_id={self.budget_id}, user_id={self.user_id}, timestamp={self.timestamp}, total_budget={self.total_budget}/>'

class Category(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    percent = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<test categoryID={self.category_id}, name={self.name}, percent={self.percent}, timestamp={self.timestamp}, user_id={self.user_id}/>'

class Expense(db.Model):
    expense_id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    total_spent = db.Column(db.Float, nullable=False)
    store_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)

    def __repr__(self):
        return f'<test expense_id={self.expense_id}, timestamp={self.timestamp}, total_spent={self.total_spent}, store_name={self.store_name}, user_id={self.user_id}/>'

class SubExpense(db.Model):
    sub_expense_id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey(Expense.expense_id), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(Category.category_id), nullable=False)
    spent = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<test sub_expense_id={self.sub_expense_id}, expense_id={self.expense_id}, category_id={self.category_id}, spent={self.spent}/>'

# creates all tables defined above. only run this if you're creating a new table.
# with app.app_context():
#     db.create_all()



"""             STARTING ROUTES SECTION          """
@app.route("/")
def home():
    """
    The way sql alchemy works is:
    You create a table, and that table will define the schema that you're ulimatly looking for in a db. 
    You can also use this schema to CREATE a table in a db, but we prob won't do that (?) 
    
    Anways, you can query a specific table using .all(), or .filter()
    That will return I a list of all the rows
    You need to iterate through all these rows, and map out the items that come through it as you see fit

    Kinda memory intensive, but whatever. Also might wanna find a way to do this outside of flask,
    Cause for a big table this will take up a LOT of memory  
    """    
    return "World"

@app.route("/login", methods=["POST"])
def login():
    ## check if user exists in database with their password. If yes, return userID, if no, return error
    try:
        data = request.get_json()
        if(data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Email or password not specified")

        email = data.get('email')
        password = data.get('password')

        ## verify user exists in db
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) < 1 or curr_user == []):
            raise Exception("User not found in DB")
        
        ## now that we know the user exists, check to see that the password is correct
        is_valid = bcrypt.check_password_hash(curr_user[0].password, password) 

        if(is_valid):
            sending_dict = {}
            print(curr_user[0].plaid_access_token)
            print((len(curr_user[0].plaid_access_token) > 0))
            if(len(curr_user[0].plaid_access_token) > 0): 
                sending_dict["has_plaid_token"] = True
            sending_dict["user_id"] = curr_user[0].user_id
            return jsonify(sending_dict)
        else:
            raise Exception("Invalid password")

    except Exception as e:
        error_message = {"error": f"Server Error: {str(e)}"}
        return jsonify(error_message) 

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if(data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Email or password not specified")

        email = data.get('email')
        name = data.get("name")
        category_arr = data.get("categories")
        budget = data.get("budget")
        unhashed_password = data.get("password")
        hashed_password = bcrypt.generate_password_hash(unhashed_password).decode('utf-8') 

        # Check to see if user already exists in server
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) > 0):
            raise Exception("User already signed up")

        ## adding to user category
        new_user = User(email=email, name=name, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        user_id = new_user.user_id
        
        # adding all user defined categories
        for category in category_arr:
            category_name = category["name"]
            category_percent = int(category["amount"])

            new_category = Category(user_id=user_id, name=category_name, percent=category_percent, timestamp=datetime.datetime.now())
            db.session.add(new_category)
        db.session.commit()

        # creating the budget for the user
        new_budget = TotalBudget(user_id=user_id, total_budget=budget, timestamp=datetime.datetime.now())
        db.session.add(new_budget)
        db.session.commit()

        return jsonify({"user_id" : user_id})
        

    except Exception as e:
        error_message = {"error": f"Server Error: {str(e)}"}
        return jsonify(error_message) 
    
    
### All the routes work fine, just need to add some exception handlers ###
### Need to edit the DELETE methods so it can delete all the information held in other tables with the same user_id/category/expense ###

## Removed all login routes from backend cause it just does not work lol

### These are all the routes that are currently in use, more of the routes that can be used in the future are stored in "routes.py"

# CRUD Methods for User
# Add new user route is not needed anymore because login/signup is taking care of it. Still here for testing purposes.
@app.route('/user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        if(data.get('name') == '' or data.get('name') is None or data.get('email') == '' or data.get('email') is None or data.get('password') == '' or data.get('password') is None):
            raise Exception("Name or Email or password not specified")

        email = data.get('email')
        name = data.get("name")
        unhashed_password = data.get("password")
        #hashed_password = Bcrypt.generate_password_hash(unhashed_password).decode('utf-8') 

        # Check to see if user already exists in server
        curr_user = db.session.query(User).filter(User.email == email).all() 
        if(len(curr_user) > 0):
            raise Exception("User already signed up")

        ## adding to user category
        new_user = User(email=email, name=name, password=unhashed_password)
        db.session.add(new_user)
        db.session.commit()

        return "User added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding user: {str(e)}"}
        return jsonify(error_message)

# Read user info, user_id is required
@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        return jsonify({"name" : user.name, "email" : user.email})
    except Exception as e:
        error_message = {"error": f"Error finding user: {str(e)}"}
        return jsonify(error_message)

# Update user's name, user_id is required
@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get(user_id)

        data = request.get_json()
        if(data.get('name') == '' or data.get('name') is None):
            raise Exception("Name not specified")
        
        new_name = data.get('name')
        user.name = new_name
        
        db.session.commit()
        return "User updated successfully"
    except Exception as e:
        error_message = {"error": f"Error updating user: {str(e)}"}
        return jsonify(error_message)

# Delete user and the data associated with them, user_id is required
@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Find and delete all sub-expenses associated with the user
        sub_expenses = SubExpense.query.join(Expense).filter(Expense.user_id == user_id).all()
        for sub_expense in sub_expenses:
            db.session.delete(sub_expense)

        # Find and delete expenses associated with the user
        expenses = Expense.query.filter_by(user_id=user_id).all()
        for expense in expenses:
            db.session.delete(expense)

        # Find and delete categories associated with the user
        categories = Category.query.filter_by(user_id=user_id).all()
        for category in categories:
            db.session.delete(category)

        # Find and delete total budgets associated with the user
        total_budgets = TotalBudget.query.filter_by(user_id=user_id).all()
        for total_budget in total_budgets:
            db.session.delete(total_budget)

        # Finally, delete the user
        user = User.query.get(user_id)
        db.session.delete(user)

        # Commit all changes
        db.session.commit()

        return "User and associated data deleted successfully"
    except Exception as e:
        db.session.rollback()
        error_message = {"error": f"Error deleting user and associated data: {str(e)}"}
        return jsonify(error_message)

# CRUD Methods for TotalBudget
# Add new budget route is not in use anymore, login/sign up is taking care of it, however, users can update their budget.

# Read the latest total budget, user_id is required
@app.route('/total_budget/<user_id>', methods=['GET'])
def get_total_budget(user_id):
    try:
        total_budget = TotalBudget.query.filter(
            TotalBudget.user_id == user_id
        ).order_by(TotalBudget.timestamp.desc()).first()
        
        if total_budget:
            return ({"totalBudget": total_budget.total_budget})
        else:
            error_message = {"error": f"Total Budget not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error finding total budget: {str(e)}"}
        return jsonify(error_message)

# Update Budget (based on the latest timestamp in the database), user_id is required
@app.route('/total_budget/<user_id>', methods=['PUT'])
def update_total_budget(user_id):
    try:
        total_budget = TotalBudget.query.filter(
            TotalBudget.user_id == user_id
        ).order_by(TotalBudget.timestamp.desc()).first()

        if total_budget:
            data = request.get_json()

            if(data.get('total_budget') == '' or data.get('total_budget') is None):
                raise Exception("Total Budget not specified")

            new_total_budget = data.get('total_budget')
            total_budget.total_budget = new_total_budget

            total_budget.timestamp = datetime.datetime.now() # Updating the timestamp as well

            db.session.commit()

            return "Total Budget updated successfully"
        else:
            error_message = {"error": f"Total Budget not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error updating total budget: {str(e)}"}
        return jsonify(error_message)
    
# Delete Budget is not in use anymore because user needs to have a budget, though they can update their budget

# CRUD Methods for Category
# Add new category, user_id is required
@app.route('/category/<user_id>', methods=['POST'])
def add_category(user_id):
    try:
        #user = User.query.get(user_id)
        data = request.get_json()

        if(data.get('percent') == '' or data.get('percent') is None or data.get('name') == '' or data.get('name') is None):
            raise Exception("Name or Percent not specified")

        name = data.get('name')
        percent = data.get('percent')
        timestamp = datetime.datetime.now()

        new_category = Category(
            user_id=user_id,
            name=name,
            percent=percent,
            timestamp=timestamp
        )

        db.session.add(new_category)
        db.session.commit()

        return "Category added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding category: {str(e)}"}
        return jsonify(error_message)

# Read all categories based on the latest month, user_id is required
@app.route('/categories/<user_id>', methods=['GET']) #check the route name with the team
def get_categories(user_id):
    try:
        current_month = int(datetime.datetime.now().strftime('%m'))  # Get the month number as int
        categories = Category.query.filter(
            and_(
                Category.user_id == user_id,
                extract('month', Category.timestamp) == current_month
            )
        ).order_by(Category.timestamp.desc()).all()
        
        category_info = []
        for category in categories:
            category_info.append({
                "name": category.name,
                "percent": category.percent
            })
        
        return jsonify(category_info)
    except Exception as e:
        error_message = {"error": f"Error finding categories: {str(e)}"}
        return jsonify(error_message)

# Update category name and percent, user_id and previous category_name are required
# frontend will need to return the previous name of the renamed category
@app.route('/category/<user_id>/<category_name>', methods=['PUT'])
def update_category(user_id, category_name):
    try:
        # Get the latest category with the given category name for the specific user
        latest_category = Category.query.filter(
            and_(
                Category.user_id == user_id,
                Category.name == category_name
            )
        ).order_by(Category.timestamp.desc()).first()

        if latest_category:
            data = request.get_json()

            if(data.get('percent') == '' or data.get('percent') is None or data.get('name') == '' or data.get('name') is None):
                raise Exception("Name or Percent not specified")

            new_name = data.get('name')
            new_percent = data.get('percent')

            if new_name is not None:
                latest_category.name = new_name
            if new_percent is not None:
                latest_category.percent = new_percent
            
            latest_category.timestamp = datetime.datetime.now() # Updating the timestamp as well

            db.session.commit()

            return "Category updated successfully"
        else:
            error_message = {"error": f"Category not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error updating category: {str(e)}"}
        return jsonify(error_message)

# Delete category, user_id and category_name required
# Frontend will need to return the name of the category being deleted, 
@app.route('/category/<user_id>/<category_name>', methods=['DELETE'])
def delete_category(user_id,category_name):
    try:
        latest_category = Category.query.filter(
            and_(
                Category.user_id == user_id,
                Category.name == category_name
            )
        ).order_by(Category.timestamp.desc()).first()

        if latest_category:
            # Find and delete sub-expenses associated with the latest category
            sub_expenses_to_delete = SubExpense.query.filter(
                and_(
                    SubExpense.category_id == latest_category.category_id,
                    Expense.user_id == user_id
                )
            ).all()

            # Delete sub-expenses
            if sub_expenses_to_delete:
                for sub_expense in sub_expenses_to_delete:
                    db.session.delete(sub_expense)

            # Delete the category itself
            db.session.delete(latest_category)

            # Commit changes
            db.session.commit()

            return "Category and related sub-expenses deleted successfully"
        else:
            error_message = {"error": f"Category not found"}
            return jsonify(error_message)
    except Exception as e:
        db.session.rollback()
        error_message = {"error": f"Error deleting category: {str(e)}"}
        return jsonify(error_message)


# CRUD Methods for Expense
# Add new expense, user_id is required
@app.route('/expense/<user_id>', methods=['POST'])
def add_expense(user_id):
    try:
        #user = User.query.get(user_id)
        data = request.get_json()

        if(data.get('store_name') == '' or data.get('store_name') is None or data.get('total_spent') == '' or data.get('total_spent') is None):
            raise Exception("Store Name or Total Spent not specified")

        store_name = data.get('store_name')
        total_spent = data.get('total_spent')
        timestamp = datetime.datetime.now()

        new_expense = Expense(
            user_id=user_id,
            store_name=store_name,
            total_spent=total_spent,
            timestamp=timestamp
        )

        db.session.add(new_expense)
        db.session.commit()

        return "Expense added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding expense: {str(e)}"}
        return jsonify(error_message)

# Creating a route that returns the newest 10 expenses and sub-expenses based on the page number (used in expense page), user_id and page number required
# so if the user is on page 1, return the news 10 expenses and their sub-expenses
@app.route('/expenses/<user_id>/<page_num>', methods=['GET'])
def get_expenses(user_id, page_num):
    try:
        start = (int(page_num)-1)*10
        expenses = Expense.query.filter(
                Expense.user_id == user_id
        ).order_by(Expense.timestamp.desc()).offset(start).limit(10).all()

        if not expenses:
            return jsonify({"error": "No Expenses found for user"})

        expense_info = []
        for expense in expenses:
            expense_data = {
                "expense_id": expense.expense_id,
                "store_name": expense.store_name,
                "total_spent": expense.total_spent,
                "timestamp": expense.timestamp,
                "sub_expenses": []
            }

            sub_expenses = SubExpense.query.filter(
                    SubExpense.expense_id == expense.expense_id
            ).all()
            if sub_expenses:
                for sub_expense in sub_expenses:
                    # Find the category name based on category_id and current sub_expense
                    category_id = sub_expense.category_id
                    category = Category.query.filter(
                        Category.category_id == category_id
                    ).order_by(Category.timestamp.desc()).first()

                    sub_expense_data = {
                        "sub_expense_id": sub_expense.sub_expense_id,
                        "spent": sub_expense.spent,
                        "category_name": category.name if category else None
                    }
                    expense_data["sub_expenses"].append(sub_expense_data)
            expense_info.append(expense_data)
        
        if expense_info:
            return jsonify(expense_info)
        else:
            error_message = {"error": f"Expenses not found"}
            return jsonify(error_message)

    except Exception as e:
        error_message = {"error": f"Error accessing expenses: {str(e)}"}
        return jsonify(error_message)

# Updating the store_name and total_spent, user_id and expense_id are required
# Even if a user is only updating store_name, frontend needs to return the total_spent
@app.route('/expense/<user_id>/<expense_id>', methods=['PUT'])
def update_expense(user_id, expense_id):
    try:
        expense = Expense.query.filter(
            and_(
                Expense.user_id == user_id,
                Expense.expense_id == expense_id
            )
        ).first()

        if expense:
            data = request.get_json()

            if(data.get('store_name') == '' or data.get('store_name') is None or data.get('total_spent') == '' or data.get('total_spent') is None):
                raise Exception("Store Name or Total Spent not specified")

            new_store_name = data.get('store_name')
            new_total_spent = data.get('total_spent')

            if new_store_name is not None:
                expense.store_name = new_store_name
            if new_total_spent is not None:
                expense.total_spent = new_total_spent
            
            db.session.commit()

            return "Expense updated successfully"
        else:
            error_message = {"error": f"Expense not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error updating expense: {str(e)}"}
        return jsonify(error_message)

# Delete expense, user_id and expense_id are required
@app.route('/expense/<user_id>/<expense_id>', methods=['DELETE'])
def delete_expense(user_id, expense_id):
    try:
        # Find and delete sub-expenses associated with the expense for the user
        sub_expenses_to_delete = SubExpense.query.filter(
            and_(
                SubExpense.expense_id == expense_id,
            )
        ).all()
        for sub_expense in sub_expenses_to_delete:
            db.session.delete(sub_expense)

        # Find and delete the expense
        expense = Expense.query.filter(
                and_(
                    Expense.user_id == user_id,
                    Expense.expense_id == expense_id
                )
            ).first()
        
        if expense:
            db.session.delete(expense)
            db.session.commit()

            return "Expense and related sub-expenses deleted successfully"
        else:
            error_message = {"error": f"Expense not found"}
            return jsonify(error_message)
    except Exception as e:
        db.session.rollback()
        error_message = {"error": f"Error deleting expense: {str(e)}"}
        return jsonify(error_message)

# CRUD Methods for Sub_Expense
# Add new sub_expense, user_id and expense_id are required
# The frontend doesn't need to store category_id, they need to send the category name though
# So frontend data will be "category_name" and "spent"
@app.route('/sub_expense/<user_id>/<expense_id>', methods=['POST'])
def add_sub_expense(user_id, expense_id):
    try:
        user = User.query.get(user_id)
        expense = Expense.query.get(expense_id)

        data = request.get_json()

        if(data.get('spent') == '' or data.get('spent') is None or data.get('category_name') == '' or data.get('category_name') is None):
            raise Exception("Amount spent or Category Name not specified")

        spent = data.get('spent')
        category_name = data.get('category_name')

        # Find the latest category id based on user_id and category name
        latest_category = Category.query.filter(
            and_(
                Category.user_id == user_id,
                Category.name == category_name
            )
        ).order_by(Category.timestamp.desc()).first()

        if user and expense and latest_category:
            new_sub_expense = SubExpense(
                expense_id=expense_id,
                category_id=latest_category.category_id,
                spent=spent
            )

            db.session.add(new_sub_expense)
            db.session.commit()

            return "SubExpense added successfully"
        else:
            error_message = {"error": f"User or Expense or Category not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error adding sub-expense: {str(e)}"}
        return jsonify(error_message)

# Read all sub-expenses associated with Expense, expense_id is required
@app.route('/sub_expense/<expense_id>', methods=['GET'])
def get_sub_expense(expense_id):
    try:
        sub_expenses = SubExpense.query.filter(
                SubExpense.expense_id == expense_id
        ).all()

        sub_expense_info = []
        for sub_expense in sub_expenses:
            # Find the category name based on category_id and current sub_expense
            category_id = sub_expense.category_id
            category = Category.query.filter(
                Category.category_id == category_id
            ).order_by(Category.timestamp.desc()).first()

            sub_expense_info.append({
                "sub_expense_id": sub_expense.sub_expense_id,
                "spent": sub_expense.spent,
                "category_name": category.name if category else None
            })
        
        return jsonify(sub_expense_info)
    except Exception as e:
        error_message = {"error": f"Error finding sub expenses: {str(e)}"}
        return jsonify(error_message)

# Update sub-expense, user_id and sub-expense_id are required
# Again, frontend data will need to sent in "category_name" and "spent"
@app.route('/sub_expense/<user_id>/<sub_expense_id>', methods=['PUT'])
def update_sub_expense(user_id, sub_expense_id):
    try:
        data = request.get_json()

        if(data.get('spent') == '' or data.get('spent') is None or data.get('category_name') == '' or data.get('category_name') is None):
            raise Exception("Amount spent or Category Name not specified")

        category_name = data.get('category_name')
        new_spent = data.get('spent')

        # Find the latest category_id based on user_id and category_name
        latest_category = Category.query.filter(
            and_(
                Category.user_id == user_id,
                Category.name == category_name
            )
        ).order_by(Category.timestamp.desc()).first()
        
        if latest_category:
            sub_expense = SubExpense.query.get(sub_expense_id)

            if(sub_expense):
                sub_expense.spent = new_spent
                sub_expense.category_id = latest_category.category_id

                db.session.commit()

                return "Sub-Expense updated successfully"
            else:
                error_message = {"error": f"Sub-Expense not found for the specified sub_expense_id"}
                return jsonify(error_message)
        else:
            error_message = {"error": f"Category not found for the specified user_id and category name"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error updating sub-expense: {str(e)}"}
        return jsonify(error_message)

# Delete a sub-expense, sub_expense_id is required
@app.route('/sub_expense/<sub_expense_id>', methods=['DELETE'])
def delete_sub_expense(sub_expense_id):
    try:
        sub_expense = SubExpense.query.filter(SubExpense.sub_expense_id == sub_expense_id).first()
        
        if sub_expense:
            db.session.delete(sub_expense)
            db.session.commit()

            return "Sub-Expense deleted successfully"
        else:
            error_message = {"error": f"Sub-Expense not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error deleting sub expense: {str(e)}"}
        return jsonify(error_message)
    
# Overview, returns all the things needed in the overview page.
@app.route('/overview/<user_id>/<month>/<year>', methods=['GET'])
def get_overview(user_id,month,year):
    try:
        user = User.query.filter(User.user_id == user_id).first()
        if not user:
            raise Exception("User not found")
        
        total_budget = TotalBudget.query.filter(
            and_(
                TotalBudget.user_id == user_id,
                extract('month', Expense.timestamp) == month,
                extract('year', Expense.timestamp) == year
            )
        ).first()
        
        # Get categories for the user
        categories = Category.query.filter(
            and_(
                Category.user_id == user_id,
            )
        ).order_by(Category.timestamp.desc()).all()

        if not categories:
            return jsonify({"error": "Categories not found"})

        # Assigning each category to budget amount based on percentage
        category_analysis = dict()
        category_budget = []
        for category in categories:
            category_analysis[category.name] = 0
            # Calculate the custom budget for each category
            budget = (category.percent * total_budget.total_budget) / 100
            category_budget.append(budget)

        expenses = Expense.query.filter(
            and_(
                Expense.user_id == user_id,
                extract('month', Expense.timestamp) == month,
                extract('year', Expense.timestamp) == year
            )
        ).order_by(Expense.timestamp.desc()).all()

        total_spent = sum(expense.total_spent for expense in expenses)

        # Getting sub expenses and updating category spendings
        for expense in expenses:
            sub_expenses = SubExpense.query.filter(SubExpense.expense_id == expense.expense_id).all()
            
            for sub_expense in sub_expenses:
                # Find the category name based on subexpense's category_id
                category_id = sub_expense.category_id
                category = Category.query.filter(
                    Category.category_id == category_id
                ).order_by(Category.timestamp.desc()).first()

                if category and category.name in category_analysis:
                    category_analysis[category.name] += sub_expense.spent
                else:
                    return jsonify({"error": "Category not found or doesn't exist"})

        category_analysis_list = [
            {
                "category_name": key,
                "total_spent_for_category": round(value, 2),
                "category_budget": round(category_budget[i], 2)
            } 
            for i, (key, value) in enumerate(category_analysis.items())
        ]

        five_expenses = Expense.query.filter(
                Expense.user_id == user_id
        ).order_by(Expense.timestamp.desc()).limit(5).all()

        expense_info = []
        for expense in five_expenses:
            expense_info.append({
                "store_name": expense.store_name,
                "total_spent_for_expense": expense.total_spent,
                "timestamp": expense.timestamp
            })

        overview_data = {
            "user_name": user.name,
            "total_budget": total_budget.total_budget,
            "total_spent": total_spent,
            "category_analysis": category_analysis_list,
            "last_five_expenses": expense_info
        }
        
        return overview_data
    except Exception as e:
        error_message = {"error": f"Error returning user overview info: {str(e)}"}
        return jsonify(error_message)


def categorize(expense_name, user_id):
    """
    This method should categorize expenses that are inputted by plaid

    Parameters: 
    - category_arr
        - Should an array of tuples
        - Each tuple should be (category_name: String, category_id: int)
    - expense_name
        - A string which is the store name we are categorizing
    
    Returns a number which is the final category
    """
    # we need to build out category array because it's all a part of the db shit
    # so we can just build it in this method (?)

    # timestamp must be within this month
    category_arr = db.session.query(Category.name, Category.category_id).filter(Category.user_id == user_id).all()

    completion = open_api_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a wonderful AI machine that determines what category of purchase some given purchase name falls into. You can choose from the list of categories that the user provides as an array. This array will contain a list of tuples, with the structure (name, id). The user will then send a purchase name, and you must deduce what category it best falls under based on the list given in the first line of the message. Choose the category that best fits this purchase, and only return the id that corresponds to this name. You should ONLY return the id, do not return any other information."},
            {"role": "user", "content": f"{category_arr}. {expense_name}."}
        ]
    )

    return (int(completion.choices[0].message.content))

def plaid_upload_new_expense(item_id: str):
    try:
        result = db.session.query(User).filter(User.item_id == item_id).all() 
        if(result == [] or result is None):
            raise Exception("User not found in db")
        user = result[0]

        cursor = user.cursor
        user_access_token = user.access_token
        user_id = user.user_id
        # New transaction updates since "cursor"
        added = []
        modified = []
        removed = [] # Removed transaction ids
        has_more = True
        # Iterate through each page of new transaction updates for item
        while has_more:
            req = TransactionsSyncRequest(
                access_token=user_access_token,
                cursor=cursor,
            )
            res = plaid_client.transactions_sync(req)
            # Add this page of results
            added.extend(res['added'])
            has_more = res['has_more']
            # Update cursor to the next cursor
            cursor = res['next_cursor']


        # updating the user's cursor position
        user.cursor = cursor


        ## adding all expense and subexpenses
        for item in added:
            total_spent = item["amount"]
            timestamp = item["datetime"]
            store_name = item["merchant_name"]
            category_id = categorize(store_name, user_id)

            new_expense = Expense(
                user_id=user_id,
                store_name=store_name,
                total_spent=total_spent,
                timestamp=timestamp
            )

            db.session.add(new_expense)
            db.session.commit()

            new_sub_expense = SubExpense(
                expense_id = new_expense.expense_id,
                category_id = category_id,
                spent = total_spent
            )

            db.session.add(new_sub_expense)
            db.session.commit()
    except Exception as e:
        return f"Error: {e}"


@app.route("/test_plaid_webhook", methods=["POST"])
def test_plaid_webhook():
    try:
        data = request.get_json()
        if(not data or len(data) < 1):
            raise Exception("No request body found")

        print("WE HAVE RECIEVED A WEBHOOK, YIPEEEE")

        user_id = data.get("user_id")
        user = db.session.query(User).get(user_id)
        access_token = user.plaid_access_token
        
        req = SandboxItemFireWebhookRequest(
            access_token=access_token,
            # This is the stupidest line of code to exist. Plaid should be ashamed of themselves.
            webhook_type=WebhookType("TRANSACTIONS"),
            webhook_code='SYNC_UPDATES_AVAILABLE'
        )

        res = plaid_client.sandbox_item_fire_webhook(req)
        return str(res)
    except Exception as e:
        return f"Error: {e}"



@app.route("/recieve_plaid_webhook", methods=['POST'])
def recieve_plaid_webhook():
    try:
        data = request.get_json()
        if(not data or len(data) < 1):
            raise Exception("No request body found")
        
        product = data['webhook_type']
        code = data['webhook_code']
        item_id = data["item_id"]

        if (product == "TRANSACTIONS"):
            if (code == "SYNC_UPDATES_AVAILABLE"):
                plaid_upload_new_expense(item_id)
            else:
                # not raising an exception because I think then the webhook would keep on refiring
                # which is very annoying (you NEED to send a status code of 200 within 10 seconds or it'll resend)
                print("Unknown webhook code sent")
        else:
            print("Unknown webhook product sent")

        return {"status": "recieved :D"}
    except Exception as e:
        return f"Error: {e}"


@app.route("/create_link_token", methods=['POST'])
def create_link_token():
    # The assumption here is that the user ID we are creating a link token for will be passed in 
    # through the body of the request
    try:
        data = request.get_json()

        if(data is None or len(data) < 1):
            raise Exception("the request body was empty or none.")
        
        # either the user id will be passed in, or the email of the user. Don't quite know yet
        user_id = data["user_id"]

        # Create a link_token for the given user
        req = LinkTokenCreateRequest(
                products=[Products("transactions")],
                client_name="CS 4800 Expense Tracker",
                country_codes=[CountryCode('US')],
                redirect_uri="https://pennywise.money.com/",
                language='en',
                webhook=webhook_url,
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(user_id),
                ),
                client_id=PLAID_CLIENT_ID,
                secret=PLAID_SECRET
            )
        res = plaid_client.link_token_create(req)

        # Send the data to the client
        return jsonify(res.to_dict())
    except Exception as e:
        return jsonify({ "error" : f"Error: {e}" })

def save_access_token_and_item_id_in_user_row(access_token: str, item_id: str, user_id: int):
    # Thie method will just take in a user id and set the access token 
    # and item token for them when they link a bank account
    try:
        db.session.query(User).filter(User.user_id == user_id).update({
            User.plaid_access_token: access_token,
            User.plaid_item_id: item_id
        })
        db.session.commit()
    except Exception as e:
        return f"Error: {e}"

@app.route('/set_access_token', methods=['POST'])
def exchange_public_token():
    try:
        data = request.get_json()

        if (data is None or len(data) < 1):
            raise Exception("No data was sent.")
        
        public_token = data["public_token"]
        user_id = data["user_id"]
        req = ItemPublicTokenExchangeRequest(
            public_token=public_token,
            client_id=PLAID_CLIENT_ID,
            secret=PLAID_SECRET
        )
        response = plaid_client.item_public_token_exchange(req)
        access_token = response['access_token']
        item_id = response['item_id']
        save_access_token_and_item_id_in_user_row(access_token, item_id, user_id)
        # whenever we perform anything with plaid API, we need to ask for the user id
        # so that we can also get that user's access key
        return jsonify({'public_token_exchange': 'complete'})
    except Exception as e:
        return f"Error: {e}"

@app.route('/health', methods=['GET'])
def health():
    return f"I'm healthy!{time.time()}"

# Creating a cron job to create a new total_buget and categories enteries for each user at the beginning of the month
def add_monthly_budget_categories():
    # Get the current month and year
    now = datetime.datetime.now()
    year = now.year
    month = now.month

    # For all users
    users = User.query.all()
    for user in users:
        # Get the current total budget for the user
        current_total_budget = TotalBudget.query.filter_by(user_id=user.user_id).order_by(TotalBudget.timestamp.desc()).first()

        if current_total_budget:
            # Create a new TotalBudget instance for the first day of the current month
            current_month = datetime.datetime(year, month, 1)
            new_total_budget = TotalBudget(
                user_id=user.user_id,
                timestamp=current_month,
                total_budget=current_total_budget.total_budget  # Use the current total_budget
            )
            db.session.add(new_total_budget)

            # Add new categories for the month for each user based on existing categories
            categories = Category.query.filter_by(user_id=user.user_id).all()
            for category in categories:
                new_category = Category(
                    user_id=user.user_id,
                    name=category.name,
                    percent=category.percent,  # Use the current percentage
                    timestamp=current_month
                )
                db.session.add(new_category)
    
    db.session.commit()
    print("Monthly budgets and categories added successfully.")

# Schedule the job to run at the start of every month
# schedule.every().month.at('00:00').do(add_monthly_budget_categories).tag('monthly_task')

# # Run the scheduler in an infinite loop
# while True:
#     schedule.run_pending()

# if __name__ == "__main__":
#     app.run(host="localhost", port=3000)

# Function to run the scheduler in a separate thread
# def run_scheduler():
#     while True:
#         schedule.run_pending()

# Create and start the scheduler thread
# scheduler_thread = threading.Thread(target=run_scheduler)
# scheduler_thread.start()

# Run the Flask app in the main thread
if __name__ == "__main__":
    app.run(host="localhost", port=3000)