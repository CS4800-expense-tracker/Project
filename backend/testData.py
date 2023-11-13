from index import db, User, Category, Expense, app
import datetime

with app.app_context():
    # Create a new user
    # Need to commit new_user before being able to access user_id elsewhere in the code (in category and expense)
    new_user = User(email='test3@example.com', name='Test 3', total_budget=1500)
    db.session.add(new_user)
    db.session.commit()

    # Create a new category
    # Need to commit new_category before being able to access category_id elsewhere in the code (in expense)
    new_category = Category(user_id=new_user.user_id, name='General', percent=50.0)
    new_category2 = Category(user_id=new_user.user_id, name='Fast-Food', percent=25.0)
    new_category3 = Category(user_id=new_user.user_id, name='Grocery', percent=25.0)
    db.session.add(new_category)
    db.session.add(new_category2)
    db.session.add(new_category3)
    db.session.commit()

    g_Current_budget = new_user.total_budget
    # Create a new expense
    new_expense = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=200.0,
        store_name='Walmart',
        user_id=new_user.user_id,
        category_id=new_category.category_id,
        current_budget=g_Current_budget-200.0
    )
    db.session.add(new_expense)
    db.session.commit()
    g_Current_budget -= new_expense.total_spent

    new_expense2 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=17.0,
        store_name='Pizza Hut',
        user_id=new_user.user_id,
        category_id=new_category2.category_id,
        current_budget=g_Current_budget-17.0
    )
    db.session.add(new_expense2)
    db.session.commit()
    g_Current_budget -= new_expense2.total_spent

    new_expense3 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=25.0,
        store_name='Ralphs',
        user_id=new_user.user_id,
        category_id=new_category3.category_id,
        current_budget=g_Current_budget-25.0
    )
    db.session.add(new_expense3)

    # Commit the changes to the database
    db.session.commit()