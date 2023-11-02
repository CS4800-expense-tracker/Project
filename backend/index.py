import json
from os import getenv, environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import quote_plus, urlencode
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify, session
from flask_sqlalchemy import SQLAlchemy

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
    total_budget = db.Column(db.Integer, nullable=False)
    

    ## This defines how the object is returned in string representation
    def __repr__(self):
        return f'<test id={self.user_id}, email={self.email}, name={self.name}, total_budget={self.total_budget} />'

class Category(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(50), nullable=False)
    percent = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<test categoryID={self.category_id}, name={self.name}, percent={self.percent} />'

class Expense(db.Model):
    expense_id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    month = db.Column(db.String(10), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    total_spent = db.Column(db.Float, nullable=False)
    store_name = db.Column(db.String(255), nullable=False)
    category_name = db.Column(db.String(50), db.ForeignKey(Category.category_name), nullable=False)
    current_budget = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<test expense_id={self.expense_id} />'


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

    testing = Test1.query.all()
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


if __name__ == "__main__":
    app.run(host="localhost", port=3000)
