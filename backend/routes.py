from index import app, db, User, Category, Expense, TotalBudget, Flask
from flask import Flask, request

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

# 
@add.route('/user-')