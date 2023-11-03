from index import db, User, Category, Expense, app
import datetime

with app.app_context():
    # Create a new user
    # Need to commit new_user before being able to access user_id elsewhere in the code (in category and expense)
    # new_user = User(email='test2@example.com', name='Test 2', total_budget=2000)
    # db.session.add(new_user)
    # db.session.commit()

    # # Create a new category
    # # Need to commit new_category before being able to access category_id elsewhere in the code (in expense)
    # new_category = Category(user_id=new_user.user_id, name='Entertainment', percent=5.0)
    # new_category2 = Category(user_id=new_user.user_id, name='General', percent=15.0)
    # new_category3 = Category(user_id=new_user.user_id, name='Food', percent=80.0)
    # db.session.add(new_category)
    # db.session.add(new_category2)
    # db.session.add(new_category3)
    # db.session.commit()

    current_budget = 1970.0
    # Create a new expense
    new_expense = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=50.0,
        store_name='Paneera',
        user_id=2,
        category_id=4,
        current_budget=current_budget-50.0
    )
    new_expense2 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=180.0,
        store_name='Costco',
        user_id=2,
        category_id=3,
        current_budget=current_budget-180.0
    )
    db.session.add(new_expense)
    db.session.add(new_expense2)

    # Commit the changes to the database
    db.session.commit()