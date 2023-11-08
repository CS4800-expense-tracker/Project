import json
from os import getenv, environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, request
from flask_sqlalchemy import SQLAlchemy
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
    #current_budget = db.Column(db.Float, nullable=False) Note: Amar thinks we should have this here

    ## This defines how the object is returned in string representation
    def __repr__(self):
        return f'<test id={self.user_id}, email={self.email}, name={self.name}/>'

class TotalBudget(db.Model):
    budget_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    month = db.Column(db.String(10), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    total_budget = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<test budget_id={self.budget_id}, user_id={self.user_id}, timestamp={self.timestamp}, month={self.month}, year={self.year}, total_budget={self.total_budget}/>'

class Category(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    percent = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    month = db.Column(db.String(10), nullable=False)
    year = db.Column(db.String(4), nullable=False)

    def __repr__(self):
        return f'<test categoryID={self.category_id}, name={self.name}, percent={self.percent}, timestamp={self.timestamp}, month={self.month}, year={self.year}, user_id={self.user_id}/>'

class Expense(db.Model):
    expense_id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    month = db.Column(db.String(10), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    total_spent = db.Column(db.Float, nullable=False)
    store_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id), nullable=False)

    def __repr__(self):
        return f'<test expense_id={self.expense_id}, timestamp={self.timestamp}, month={self.month}, year={self.year}, total_spent={self.total_spent}, store_name={self.store_name}, user_id={self.user_id}/>'

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

    testing = Expense.query.all()
    output = []
    for test in testing:
        temp = {
            "id" : test.id,
            "created_at" : test.created_at,
            "custom" : test.custom,
            "testStrign": "This is a stirng",
            "testInt" : 1
        }
        output.append(temp)

    return jsonify({"Results" : output})

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


# CRUD Methods for User
# Add new user
@app.route('/users', methods=['POST'])
def add_user():
    email = request.form['email']
    name = request.form['name']

    new_user = User(email=email, name=name)
    db.session.add(new_user)
    db.session.commit()

    return "User added successfully"

# Read user info
@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    return f'Name: {user.name}, Email: {user.email}'

# Update user's name
@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)

    new_name = request.form['new_name']
    user.name = new_name
    
    db.session.commit()
    return "User updated successfully"

# Delete user account
@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return "User deleted successfully"


# CRUD Methods for TotalBudget
# Add new budget
@app.route('/total_budget/<user_id>', methods=['POST'])
def add_total_budget(user_id):
    user_id = User.query.get(user_id)
    timestamp = datetime.datetime.now()
    month = timestamp.strftime('%B')  # Get the full month name (e.g., January)
    year = timestamp.strftime('%Y')   # Get the four-digit year (e.g., 2023)    
    total_budget = request.form['total_budget']

    new_total_budget = TotalBudget(
        user_id=user_id,
        timestamp=timestamp,
        month=month,
        year=year,
        total_budget=total_budget
    )
    db.session.add(new_total_budget)
    db.session.commit()

    return "Total Budget added successfully"

# Read total budget based on current month
@app.route('/total_buget/<user_id>', methods=['GET'])
def get_total_budget(user_id):
    current_month = datetime.datetime.now().strftime('%B')  # Get the full month name (e.g., January)
    
    total_budget = TotalBudget.query.filter(
        and_(
            TotalBudget.user_id == user_id,
            TotalBudget.month == current_month
            )).first()
    
    if total_budget:
        return f'Total Budget for {current_month}: {total_budget.total_budget}'

# Update Budget based on current month
@app.route('/total_budget/<user_id>', methods=['PUT'])
def update_total_budget(user_id):
    current_month = datetime.datetime.now().strftime('%B')  # Get the full month name (e.g., January)
    current_year = datetime.datetime.now().strftime('%Y')   # Get the four-digit year (e.g., 2023)

    total_budget = TotalBudget.query.filter(
        and_(
            TotalBudget.user_id == user_id,
            TotalBudget.month == current_month,
            TotalBudget.year == current_year
        )
    ).first()

    if total_budget:
        new_total_budget = request.form['total_budget']
        total_budget.total_budget = new_total_budget

        db.session.commit()

        return f"Total Budget for {current_month} {current_year} updated successfully"
    else:
        return f"Total Budget for {current_month} {current_year} not found"
    
# Delete Budget based on current month
@app.route('/total_budget/<user_id>', methods=['DELETE'])
def delete_total_budget(user_id):
    current_month = datetime.datetime.now().strftime('%B')  # Get the full month name (e.g., January)
    current_year = datetime.datetime.now().strftime('%Y')   # Get the four-digit year (e.g., 2023)

    total_budget = TotalBudget.query.filter(
        and_(
            TotalBudget.user_id == user_id,
            TotalBudget.month == current_month,
            TotalBudget.year == current_year
        )
    ).first()

    if total_budget:
        db.session.delete(total_budget)
        db.session.commit()

        return f"Total Budget for {current_month} {current_year} deleted successfully"
    else:
        return f"Total Budget for {current_month} {current_year} not found"
    

# CRUD Methods for Category
# Add new category
@app.route('/category/<user_id>', methods=['POST'])
def add_category(user_id):
    user_id = User.query.get(user_id)
    name = request.form['name']
    percent = request.form['percent']
    timestamp = datetime.datetime.now()
    month = timestamp.strftime('%B')  # Get the full month name (e.g., January)
    year = timestamp.strftime('%Y')   # Get the four-digit year (e.g., 2023)

    new_category = Category(
        user_id=user_id,
        name=name,
        percent=percent,
        timestamp=timestamp,
        month=month,
        year=year
    )

    db.session.add(new_category)
    db.session.commit()

    return "Category added successfully"

# Read all categories based on current month and year
@app.route('/categories/<user_id>', methods=['GET'])
def get_categories_current_month(user_id):
    current_month = datetime.datetime.now().strftime('%B')  # Get the full month name (e.g., January)
    current_year = datetime.datetime.now().strftime('%Y')   # Get the four-digit year (e.g., 2023)
    
    categories = Category.query.filter(
        and_(
            Category.user_id == user_id, 
            Category.month == current_month, 
            Category.year == current_year
        )
    ).all()
    
    category_info = []
    for category in categories:
        category_info.append({
            "Category ID": category.category_id,
            "Name": category.name,
            "Percent": category.percent
        })
    
    return jsonify(category_info)

# Update category based on user_id and name. Updating the name and percent 
# (note: frontend will need to return the previous name of the renamed category if the name was changed)
@app.route('/category/<user_id>/<category_name>', methods=['PUT'])
def update_category(user_id, category_name):
    # Get the latest category with the given name for the specific user
    latest_category = Category.query.filter(
        and_(
            Category.user_id == user_id,
            Category.name == category_name
        )
    ).order_by(Category.year.desc(), Category.month.desc(), Category.timestamp.desc()).first()

    if latest_category:
        new_name = request.form['new_name']
        new_percent = request.form['new_percent']

        latest_category.name = new_name
        latest_category.percent = new_percent

        db.session.commit()

        return "Category updated successfully"
    else:
        return "Category not found"

# Delete category based on user_id and name 
# (note: frontend will need to return the name of the category being deleted)
@app.route('/category/<user_id>/<category_name>', method=['DELETE'])
def delete_category(user_id, category_name):
    latest_category = Category.query.filter(
        and_(
            Category.user_id == user_id,
            Category.name == category_name
        )
    ).order_by(Category.year.desc(), Category.month.desc(), Category.timestamp.desc()).first()

    if latest_category:
        db.session.delete(latest_category)
        db.session.commit()

        return "Category deleted successfully"
    else:
        return "Category not found"


# CRUD Methods for Expense


# CRUD Methods for Sub Expense

if __name__ == "__main__":
    app.run(host="localhost", port=3000)
