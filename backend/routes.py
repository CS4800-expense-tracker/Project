from index import app, db, User, Category, TotalBudget, Expense, SubExpense, Flask
from flask import Flask, request, jsonify
from sqlalchemy import and_
import datetime

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
@app.route('/total_budget/<user_id>', method=['PUT'])
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