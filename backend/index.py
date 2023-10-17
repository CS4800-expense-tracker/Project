import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

load_dotenv()
app = Flask(__name__)

# Mysql connection string in format mysql://user:password@Port/Database
## TODO: Move uri to config file/env, that should also be in .gitignore
## TODO: ADD venv, pycache, env file to gitignore
print(os.getenv('SQLALCHEMY_DATABASE_URI'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

### CREATING TABLES ####
class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    created_at = db.Column(db.DateTime)    
    custom = db.Column(db.String(255))    

    ## This defines how the object is returned
    def __repr__(self):
        return f'<Test id={self.id}, created_at={self.created_at}, custom={self.custom}'



@app.route("/")
def test():
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


    testing = Test.query.all()
    print(f'TESTING IS OF TYPE: {type(testing)}')
    output = []
    for test in testing:
        temp = {
            "id" : test.id,
            "created_at" : test.created_at,
            "custom" : test.custom
        }
        output.append(temp)

    return jsonify({"Results" : testing})



"""
Create a db connection object
Should return a cursor
    from cursor
        do statements, update, delete, create, read
SQLAlchemy
"""