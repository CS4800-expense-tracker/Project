from index import app, db, User, Category, TotalBudget, Expense, SubExpense, Flask
from flask import Flask, request, jsonify
from sqlalchemy import and_, extract
import datetime

# CRUD Methods for User
# Add new user
@app.route('/user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        if(data.get('email') == '' or data.get('email') is None or data.get('name') == '' or data.get('name') is None):
            raise Exception("Email or Name not specified")

        email = data.get('email')
        name = data.get('name')

        new_user = User(email=email, name=name)
        db.session.add(new_user)
        db.session.commit()

        return "User added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding user: {str(e)}"}
        return jsonify(error_message)

# Read user info
@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        return jsonify({"name" : user.name, "email" : user.email})
        # return f'Name: {user.name}, Email: {user.email}'
    except Exception as e:
        error_message = {"error": f"Error finding user: {str(e)}"}
        return jsonify(error_message)

# Update user's name
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
# Add new budget
@app.route('/total_budget/<user_id>', methods=['POST'])
def add_total_budget(user_id):
    try:
        #user = User.query.get(user_id)
        timestamp = datetime.datetime.now()

        data = request.get_json()
        if(data.get('total_budget') == '' or data.get('total_budget') is None):
            raise Exception("Total Budget not specified")
        
        total_budget = data.get('total_budget')

        new_total_budget = TotalBudget(
            user_id=user_id,
            timestamp=timestamp,
            total_budget=total_budget
        )
        db.session.add(new_total_budget)
        db.session.commit()

        return "Total Budget added successfully"
    except Exception as e:
        error_message = {"error": f"Error adding total budget: {str(e)}"}
        return jsonify(error_message)

# Read the latest total budget
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

# Update Budget based on the latest timestamp in the database
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
    
# Delete Budget based on latest timestamp in the database
@app.route('/total_budget/<user_id>', methods=['DELETE'])
def delete_total_budget(user_id):
    try:
        #current_month = datetime.datetime.now().strftime('%B')  # Get the full month name (e.g., January) for returning error message
        #current_year = datetime.datetime.now().strftime('%Y')   # Get the four-digit year (e.g., 2023) for returning error message

        total_budget = TotalBudget.query.filter(
            TotalBudget.user_id == user_id
        ).order_by(TotalBudget.timestamp.desc()).first()

        if total_budget:
            db.session.delete(total_budget)
            db.session.commit()

            return "Total Budget deleted successfully"
        else:
            error_message = {"error": f"Total Budget not found"}
            return jsonify(error_message)
    except Exception as e:
        error_message = {"error": f"Error deleting total budget: {str(e)}"}
        return jsonify(error_message)
    

# CRUD Methods for Category
# Add new category
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

# Read all categories based on the latest month
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

# GET route to return a category name based on the category_id
@app.route('/category/<category_id>', methods=['GET'])
def get_category(category_id):
    try:
        category = Category.query.get(category_id)
        return jsonify({"name" : category.name})
    except Exception as e:
        error_message = {"error": f"Error finding category: {str(e)}"}
        return jsonify(error_message)

# Update category based on user_id and name. Updating the name and percent 
# (note: frontend will need to return the previous name of the renamed category if the name was changed)
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

# Delete category based on user_id and name 
# (note: frontend will need to return the name of the category being deleted)
@app.route('/category/<user_id>/<category_name>', methods=['DELETE'])
def delete_category(user_id, category_name):
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
                    SubExpense.expense_id.has(user_id=user_id)  # Filtering by user_id
                )
            ).all()

            # Delete sub-expenses
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
# Add new expense (this route can be used by frontend for users to add expenses manually)
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

# Read all expenses based on the latest month
@app.route('/expense/<user_id>', methods=['GET'])
def get_expenses(user_id):
    try:
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
    except Exception as e:
        error_message = {"error": f"Error finding expense: {str(e)}"}
        return jsonify(error_message)

# Update category based on user_id and expense_id. Updating the store_name and total_spent
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

# Delete expense based on user_id and expense_id
@app.route('/expense/<user_id>/<expense_id>', methods=['DELETE'])
def delete_expense(user_id, expense_id):
    try:
        # Find and delete sub-expenses associated with the expense for the user
        sub_expenses_to_delete = SubExpense.query.filter(
            and_(
                SubExpense.expense_id == expense_id,
                SubExpense.expense_id.has(user_id=user_id)  # Filtering by user_id
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
# Add new sub_expense
# (Note: the frontend does not have the category id, they wil give us the category name, 
# and we will search for the latest category id corresponding to the provided category name and user_id)
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

# Read all sub-expenses associated with Expense
@app.route('/sub_expense/<expense_id>', methods=['GET'])
def get_sub_expense(expense_id):
    try:
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
    except Exception as e:
        error_message = {"error": f"Error finding sub expenses: {str(e)}"}
        return jsonify(error_message)

# Update sub-expense based on user_id and sub-expense_id
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

# Delete a sub-expense using expense_id and sub_expense_id
@app.route('/sub_expense/<expense_id>/<sub_expense_id>', methods=['DELETE'])
def delete_sub_expense(expense_id, sub_expense_id):
    try:
        sub_expense = SubExpense.query.filter(
                and_(
                    SubExpense.expense_id == expense_id,
                    SubExpense.sub_expense_id == sub_expense_id
                )
            ).first()
        
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