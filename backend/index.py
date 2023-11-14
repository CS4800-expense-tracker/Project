import json
from os import getenv, environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_, extract
import datetime

from sqlalchemy.sql import func


ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
    
app = Flask(__name__)
oauth = OAuth(app)
app.secret_key = env.get("APP_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = env.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

""" CREATING TABLES """

# All table names are lower case according to the program. So this "Test" table would be seen as test
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)    
    email = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    ## This defines how the object is returned in string representation
    def __repr__(self):
        return f'<test id={self.user_id}, email={self.email}, name={self.name}/>'

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
with app.app_context():
    db.create_all()



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
    return "Hello World"
## TODO: Make a signup route
## after a user logs in, we get back a token that contains user information. We can use that
## to pull up their shit in the db

@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/signup")
def signup():
    return oauth.auth0.authorize_redirect(
        screen_hint="signup",
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

# Read user info
@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    return jsonify({"name" : user.name, "email" : user.email})
# return f'Name: {user.name}, Email: {user.email}'

# Read the latest total budget
@app.route('/total_budget/<user_id>', methods=['GET'])
def get_total_budget(user_id):    
    total_budget = TotalBudget.query.filter(
        TotalBudget.user_id == user_id
    ).order_by(TotalBudget.timestamp.desc()).first()
    
    if total_budget:
        return ({"totalBudget": total_budget.total_budget})

# Read all categories based on the latest month
@app.route('/categories/<user_id>', methods=['GET'])
def get_categories(user_id):
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

# Read all expenses based on the latest month
@app.route('/expense/<user_id>', methods=['GET'])
def get_expenses(user_id):
    current_month = int(datetime.datetime.now().strftime('%m')) # Get the month number as int
    expenses = Expense.query.filter(
        and_(
            Expense.user_id == user_id,
            extract('month', Expense.timestamp) == current_month
        )
    ).order_by(Expense.timestamp.desc()).all()

    expense_info = []
    for expense in expenses:
        expense_info.append({
            "expense_id": expense.expense_id,
            "store_name": expense.store_name,
            "total_spent": expense.total_spent,
            "timestamp": expense.timestamp
        })

    return jsonify(expense_info)

# Read all sub-expenses associated with Expense
@app.route('/sub_expense/<expense_id>', methods=['GET'])
def get_sub_expense(expense_id):
    sub_expenses = SubExpense.query.filter(
        and_(
            SubExpense.expense_id == expense_id
        )
    ).all()

    sub_expense_info = []
    for sub_expense in sub_expenses:
        # Find the category name based on user_id and current sub_expense category_id
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

if __name__ == "__main__":
    app.run(host="localhost", port=3000)
