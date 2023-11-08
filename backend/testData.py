from index import db, User, Category, Expense, app, SubExpense, TotalBudget
import datetime

with app.app_context():
    # Create a new user
    # Need to commit new_user before being able to access user_id elsewhere in the code (in category and expense)
    new_user1 = User(email='test1@example.com', name='Test 1')
    db.session.add(new_user1)
    db.session.commit()

    total_budget1 = TotalBudget(user_id=new_user1.user_id,timestamp=datetime.datetime(2023, 11, 3), month='November',year='2023',total_budget=1000.0)
    db.session.add(total_budget1)
    db.session.commit()

    # Create a new category
    # Need to commit new_category before being able to access category_id elsewhere in the code (in expense)
    new_category = Category(user_id=new_user1.user_id, name='General', percent=50.0,timestamp=datetime.datetime(2023, 11, 3), month='November',year='2023')
    new_category2 = Category(user_id=new_user1.user_id, name='Fast-Food', percent=25.0,timestamp=datetime.datetime(2023, 11, 3), month='November',year='2023')
    new_category3 = Category(user_id=new_user1.user_id, name='Grocery', percent=25.0,timestamp=datetime.datetime(2023, 11, 3), month='November',year='2023')
    db.session.add(new_category)
    db.session.add(new_category2)
    db.session.add(new_category3)
    db.session.commit()

    # Create a new expense
    new_expense = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=200.0,
        store_name='Walmart',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense)
    db.session.commit()
    new_subexpense = SubExpense(
        expense_id=new_expense.expense_id,
        category_id=new_category.category_id,
        spent=125.0
    )
    db.session.add(new_subexpense)
    db.session.commit()
    new_subexpense2 = SubExpense(
        expense_id=new_expense.expense_id,
        category_id=new_category3.category_id,
        spent=75.0
    )
    db.session.add(new_subexpense2)
    db.session.commit()

    new_expense12 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=17.0,
        store_name='Pizza Hut',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense12)
    db.session.commit()
    new_subexpense12 = SubExpense(
        expense_id=new_expense12.expense_id,
        category_id=new_category2.category_id,
        spent=17.0
    )
    db.session.add(new_subexpense12)
    db.session.commit()
    
    new_expense13 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=25.0,
        store_name='Ralphs',
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense13)
    db.session.commit()
    new_subexpense13 = SubExpense(
        expense_id=new_expense12.expense_id,
        category_id=new_category2.category_id,
        spent=17.0
    )
    db.session.add(new_subexpense13)
    db.session.commit()
    
    # Create new user
    new_user2 = User(email='test2@example.com', name='Test 2')
    db.session.add(new_user2)
    db.session.commit()

    total_budget2 = TotalBudget(user_id=new_user2.user_id,timestamp=datetime.datetime(2023, 11, 5), month='November',year='2023',total_budget=1500.0)
    db.session.add(total_budget2)
    db.session.commit()

    new_category21 = Category(user_id=new_user2.user_id, name='Entertainment', percent=10.0,timestamp=datetime.datetime(2023, 11, 5), month='November',year='2023')
    new_category22 = Category(user_id=new_user2.user_id, name='Fast-Food', percent=25.0,timestamp=datetime.datetime(2023, 11, 5), month='November',year='2023')
    new_category23 = Category(user_id=new_user2.user_id, name='Grocery', percent=25.0,timestamp=datetime.datetime(2023, 11, 5), month='November',year='2023')
    new_category24 = Category(user_id=new_user2.user_id, name='General', percent=40.0,timestamp=datetime.datetime(2023, 11, 5), month='November',year='2023')
    db.session.add(new_category21)
    db.session.add(new_category22)
    db.session.add(new_category23)
    db.session.add(new_category24)
    db.session.commit()
    
    # Create a new expense
    new_expense21 = Expense(
        timestamp=datetime.datetime(2023, 11, 5),  # Example date
        month='November',
        year='2023',
        total_spent=100.0,
        store_name='Target',
        user_id=new_user2.user_id
    )
    db.session.add(new_expense21)
    db.session.commit()
    new_subexpense211 = SubExpense(
        expense_id=new_expense21.expense_id,
        category_id=new_category24.category_id,
        spent=50.0
    )
    db.session.add(new_subexpense211)
    db.session.commit()
    new_subexpense212 = SubExpense(
        expense_id=new_expense21.expense_id,
        category_id=new_category21.category_id,
        spent=50.0
    )
    db.session.add(new_subexpense212)
    db.session.commit()

    new_expense22 = Expense(
        timestamp=datetime.datetime(2023, 11, 5),  # Example date
        month='November',
        year='2023',
        total_spent=10.0,
        store_name='Subway',
        user_id=new_user2.user_id
    )
    db.session.add(new_expense22)
    db.session.commit()
    new_subexpense221 = SubExpense(
        expense_id=new_expense22.expense_id,
        category_id=new_category22.category_id,
        spent=10.0
    )
    db.session.add(new_subexpense221)
    db.session.commit()
    
    new_expense23 = Expense(
        timestamp=datetime.datetime(2023, 11, 3),  # Example date
        month='November',
        year='2023',
        total_spent=20.0,
        store_name='Kroger',
        user_id=new_user2.user_id,
    )
    db.session.add(new_expense23)
    db.session.commit()
    new_subexpense231 = SubExpense(
        expense_id=new_expense23.expense_id,
        category_id=new_category23.category_id,
        spent=20.0
    )
    db.session.add(new_subexpense231)
    db.session.commit()
    
    new_user3 = User(email='test3@example.com', name='Test 3')
    db.session.add(new_user3)
    db.session.commit()

    total_budget3 = TotalBudget(user_id=new_user3.user_id,timestamp=datetime.datetime(2023, 11, 1), month='November',year='2023',total_budget=2000.0)
    db.session.add(total_budget3)
    db.session.commit()

    new_category31 = Category(user_id=new_user3.user_id, name='General', percent=15.0,timestamp=datetime.datetime(2023, 11, 1), month='November',year='2023')
    new_category32 = Category(user_id=new_user3.user_id, name='Food', percent=25.0,timestamp=datetime.datetime(2023, 11, 1), month='November',year='2023')
    new_category33 = Category(user_id=new_user3.user_id, name='Car', percent=10.0,timestamp=datetime.datetime(2023, 11, 1), month='November',year='2023')
    new_category34 = Category(user_id=new_user3.user_id, name='rent', percent=50.0,timestamp=datetime.datetime(2023, 11, 1), month='November',year='2023')
    db.session.add(new_category31)
    db.session.add(new_category32)
    db.session.add(new_category33)
    db.session.add(new_category34)
    db.session.commit()

    # Create a new expense
    new_expense31 = Expense(
        timestamp=datetime.datetime(2023, 11, 6),  # Example date
        month='November',
        year='2023',
        total_spent=190.0,
        store_name='AutoZone',
        user_id=new_user3.user_id
    )
    db.session.add(new_expense31)
    db.session.commit()
    new_subexpense311 = SubExpense(
        expense_id=new_expense31.expense_id,
        category_id=new_category33.category_id,
        spent=190.0
    )
    db.session.add(new_subexpense311)
    db.session.commit()

    new_expense32 = Expense(
        timestamp=datetime.datetime(2023, 11, 5),  # Example date
        month='November',
        year='2023',
        total_spent=45.25,
        store_name='Panera',
        user_id=new_user3.user_id
    )
    db.session.add(new_expense32)
    db.session.commit()
    new_subexpense321 = SubExpense(
        expense_id=new_expense32.expense_id,
        category_id=new_category32.category_id,
        spent=45.25
    )
    db.session.add(new_subexpense321)
    db.session.commit()
    
    new_expense33 = Expense(
        timestamp=datetime.datetime(2023, 11, 1),  # Example date
        month='November',
        year='2023',
        total_spent=890.70,
        store_name='CPP Village',
        user_id=new_user3.user_id,
    )
    db.session.add(new_expense33)
    db.session.commit()
    new_subexpense331 = SubExpense(
        expense_id=new_expense33.expense_id,
        category_id=new_category34.category_id,
        spent=890.70
    )
    db.session.add(new_subexpense331)
    db.session.commit()