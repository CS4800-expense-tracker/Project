from index import db, User, Category, Expense, app, SubExpense, TotalBudget
import datetime
from flask_bcrypt import generate_password_hash

with app.app_context():
    # Create a new user
    # Need to commit new_user before being able to access user_id elsewhere in the code (in category and expense)
    password = generate_password_hash(f"password1").decode('utf-8')
    new_user1 = User(email='goldbridge@example.com', name='Mark Goldbridge', password=password)
    db.session.add(new_user1)
    db.session.commit()

    total_budget1 = TotalBudget(user_id=new_user1.user_id,timestamp=datetime.datetime.now(),total_budget=2000.0)
    db.session.add(total_budget1)
    db.session.commit()

    # Create a new category
    # Need to commit new_category before being able to access category_id elsewhere in the code (in expense)
    new_category = Category(user_id=new_user1.user_id, name='General', percent=50.0,timestamp=datetime.datetime.now())
    new_category2 = Category(user_id=new_user1.user_id, name='Fast-Food', percent=25.0,timestamp=datetime.datetime.now())
    new_category3 = Category(user_id=new_user1.user_id, name='Grocery', percent=25.0,timestamp=datetime.datetime.now())
    db.session.add(new_category)
    db.session.add(new_category2)
    db.session.add(new_category3)
    db.session.commit()

    # Create a new expense
    new_expense = Expense(
        timestamp=datetime.datetime.now(),  # Example date
        total_spent=200.0,
        store_name='Walmart',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense)
    db.session.commit()
    new_subexpense = SubExpense(
        expense_id=new_expense.expense_id,
        category_id=new_category.category_id,
        spent=125.0,
        sub_expense_name='Monitor'
    )
    db.session.add(new_subexpense)
    db.session.commit()
    new_subexpense2 = SubExpense(
        expense_id=new_expense.expense_id,
        category_id=new_category3.category_id,
        spent=75.0,
        sub_expense_name='Groceries'
    )
    db.session.add(new_subexpense2)
    db.session.commit()

    new_expense12 = Expense(
        timestamp=datetime.datetime.now(),  # Example date
        total_spent=17.0,
        store_name='Pizza Hut',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense12)
    db.session.commit()
    new_subexpense12 = SubExpense(
        expense_id=new_expense12.expense_id,
        category_id=new_category2.category_id,
        spent=17.0,
        sub_expense_name='Pizza'
    )
    db.session.add(new_subexpense12)
    db.session.commit()
    
    new_expense13 = Expense(
        timestamp=datetime.datetime.now(),  # Example date
        total_spent=25.0,
        store_name='Ralphs',
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense13)
    db.session.commit()
    new_subexpense13 = SubExpense(
        expense_id=new_expense13.expense_id,
        category_id=new_category3.category_id,
        spent=25.0,
        sub_expense_name='Milk and Bread'
    )
    db.session.add(new_subexpense13)
    db.session.commit()

    # Expense 14 at Target
    new_expense14 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=40.0,
        store_name='Target',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense14)
    db.session.commit()
    new_subexpense14_1 = SubExpense(
        expense_id=new_expense14.expense_id,
        category_id=new_category.category_id,
        spent=30.0,  # Adjusted to match the total spent in new_expense14
        sub_expense_name='Clothing'
    )
    new_subexpense14_2 = SubExpense(
        expense_id=new_expense14.expense_id,
        category_id=new_category2.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense14
        sub_expense_name='Miscellaneous'
    )
    db.session.add(new_subexpense14_1)
    db.session.add(new_subexpense14_2)
    db.session.commit()

    # Expense 15 at Starbucks
    new_expense15 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=30.0,
        store_name='Starbucks',
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense15)
    db.session.commit()
    new_subexpense15 = SubExpense(
        expense_id=new_expense15.expense_id,
        category_id=new_category2.category_id,
        spent=20.0,  # Adjusted to match the total spent in new_expense15
        sub_expense_name='Coffee'
    )
    new_subexpense15_2 = SubExpense(
        expense_id=new_expense15.expense_id,
        category_id=new_category3.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense15
        sub_expense_name='Snacks'
    )
    db.session.add(new_subexpense15)
    db.session.add(new_subexpense15_2)
    db.session.commit()

    # Expense 16 at Best Buy
    new_expense16 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=200.0,
        store_name='Best Buy',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense16)
    db.session.commit()
    new_subexpense16 = SubExpense(
        expense_id=new_expense16.expense_id,
        category_id=new_category.category_id,
        spent=90.0,  # Adjusted to match the total spent in new_expense16
        sub_expense_name='HeadPhones'
    )
    new_subexpense16_2 = SubExpense(
        expense_id=new_expense16.expense_id,
        category_id=new_category2.category_id,
        spent=110.0,  # Adjusted to match the total spent in new_expense16
        sub_expense_name='Firdge Installment'
    )
    db.session.add(new_subexpense16)
    db.session.add(new_subexpense16_2)
    db.session.commit()

    # Expense 17 at Amazon
    new_expense17 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=120.0,
        store_name='Amazon',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense17)
    db.session.commit()
    new_subexpense17_1 = SubExpense(
        expense_id=new_expense17.expense_id,
        category_id=new_category.category_id,
        spent=80.0,  # Adjusted to match the total spent in new_expense17
        sub_expense_name='Electronics'
    )
    new_subexpense17_2 = SubExpense(
        expense_id=new_expense17.expense_id,
        category_id=new_category3.category_id,
        spent=40.0,  # Adjusted to match the total spent in new_expense17
        sub_expense_name='Books'
    )
    db.session.add(new_subexpense17_1)
    db.session.add(new_subexpense17_2)
    db.session.commit()

    # Expense 18 at McDonald's
    new_expense18 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=25.0,
        store_name="McDonald's",
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense18)
    db.session.commit()
    new_subexpense18 = SubExpense(
        expense_id=new_expense18.expense_id,
        category_id=new_category2.category_id,
        spent=15.0,  # Adjusted to match the total spent in new_expense18
        sub_expense_name='Burgers'
    )
    new_subexpense18_2 = SubExpense(
        expense_id=new_expense18.expense_id,
        category_id=new_category3.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense18
        sub_expense_name='Fries and Drinks'
    )
    db.session.add(new_subexpense18)
    db.session.add(new_subexpense18_2)
    db.session.commit()

    # Expense 20 at Subway
    new_expense20 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=20.0,
        store_name='Subway',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense20)
    db.session.commit()
    new_subexpense20 = SubExpense(
        expense_id=new_expense20.expense_id,
        category_id=new_category2.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense20
        sub_expense_name='Sandwich'
    )
    new_subexpense20_2 = SubExpense(
        expense_id=new_expense20.expense_id,
        category_id=new_category3.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense20
        sub_expense_name='Drinks and Chips'
    )
    db.session.add(new_subexpense20)
    db.session.add(new_subexpense20_2)
    db.session.commit()

    # Expense 21 at CVS Pharmacy
    new_expense21 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=30.0,
        store_name='CVS Pharmacy',
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense21)
    db.session.commit()
    new_subexpense21 = SubExpense(
        expense_id=new_expense21.expense_id,
        category_id=new_category.category_id,
        spent=20.0,  # Adjusted to match the total spent in new_expense21
        sub_expense_name='Healthcare'
    )
    new_subexpense21_2 = SubExpense(
        expense_id=new_expense21.expense_id,
        category_id=new_category3.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense21
        sub_expense_name='Toiletries'
    )
    db.session.add(new_subexpense21)
    db.session.add(new_subexpense21_2)
    db.session.commit()

    # Expense 22 at Gas Station
    new_expense22 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=50.0,
        store_name='Gas Station',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense22)
    db.session.commit()
    new_subexpense22 = SubExpense(
        expense_id=new_expense22.expense_id,
        category_id=new_category.category_id,
        spent=30.0,  # Adjusted to match the total spent in new_expense22
        sub_expense_name='Fuel'
    )
    new_subexpense22_2 = SubExpense(
        expense_id=new_expense22.expense_id,
        category_id=new_category2.category_id,
        spent=20.0,  # Adjusted to match the total spent in new_expense22
        sub_expense_name='Snacks'
    )
    db.session.add(new_subexpense22)
    db.session.add(new_subexpense22_2)
    db.session.commit()

    # Expense 23 at Movie Theater
    new_expense23 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=40.0,
        store_name='Movie Theater',
        user_id=new_user1.user_id
    )
    db.session.add(new_expense23)
    db.session.commit()
    new_subexpense23 = SubExpense(
        expense_id=new_expense23.expense_id,
        category_id=new_category.category_id,
        spent=25.0,  # Adjusted to match the total spent in new_expense23
        sub_expense_name='Tickets'
    )
    new_subexpense23_2 = SubExpense(
        expense_id=new_expense23.expense_id,
        category_id=new_category3.category_id,
        spent=15.0,  # Adjusted to match the total spent in new_expense23
        sub_expense_name='Snacks'
    )
    db.session.add(new_subexpense23)
    db.session.add(new_subexpense23_2)
    db.session.commit()

    # Expense 24 at Coffee Shop
    new_expense24 = Expense(
        timestamp=datetime.datetime.now(),
        total_spent=30.0,
        store_name='Coffee Shop',
        user_id=new_user1.user_id,
    )
    db.session.add(new_expense24)
    db.session.commit()
    new_subexpense24 = SubExpense(
        expense_id=new_expense24.expense_id,
        category_id=new_category2.category_id,
        spent=20.0,  # Adjusted to match the total spent in new_expense24
        sub_expense_name='Coffee'
    )
    new_subexpense24_2 = SubExpense(
        expense_id=new_expense24.expense_id,
        category_id=new_category3.category_id,
        spent=10.0,  # Adjusted to match the total spent in new_expense24
        sub_expense_name='Pastry'
    )
    db.session.add(new_subexpense24)
    db.session.add(new_subexpense24_2)
    db.session.commit()

    # password = generate_password_hash(f"password1").decode('utf-8')
    # new_user2 = User(email='brussell@example.com', name='Russell Rick', password=password)
    # db.session.add(new_user2)
    # db.session.commit()

    # total_budget2 = TotalBudget(user_id=new_user2.user_id, timestamp=datetime.datetime.now(), total_budget=2000.0)
    # db.session.add(total_budget2)
    # db.session.commit()

    # # Create new categories for the new user
    # new_category_user2 = Category(user_id=new_user2.user_id, name='Electronics', percent=30.0, timestamp=datetime.datetime.now())
    # new_category2_user2 = Category(user_id=new_user2.user_id, name='Dining Out', percent=40.0, timestamp=datetime.datetime.now())
    # new_category3_user2 = Category(user_id=new_user2.user_id, name='Entertainment', percent=30.0, timestamp=datetime.datetime.now())
    # db.session.add(new_category_user2)
    # db.session.add(new_category2_user2)
    # db.session.add(new_category3_user2)
    # db.session.commit()

    # # Create expenses and sub-expenses for the new user
    # # Expense 25 at Best Buy for new_user2
    # new_expense25 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=500.0,
    #     store_name='Best Buy',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense25)
    # db.session.commit()
    # new_subexpense25 = SubExpense(
    #     expense_id=new_expense25.expense_id,
    #     category_id=new_category_user2.category_id,
    #     spent=300.0,  # Adjusted to match the total spent in new_expense25
    #     sub_expense_name='Laptop'
    # )
    # new_subexpense25_2 = SubExpense(
    #     expense_id=new_expense25.expense_id,
    #     category_id=new_category2_user2.category_id,
    #     spent=200.0,  # Adjusted to match the total spent in new_expense25
    #     sub_expense_name='Dinner'
    # )
    # db.session.add(new_subexpense25)
    # db.session.add(new_subexpense25_2)
    # db.session.commit()

    # # Expense 26 at Movie Theater for new_user2
    # new_expense26 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=50.0,
    #     store_name='Movie Theater',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense26)
    # db.session.commit()
    # new_subexpense26 = SubExpense(
    #     expense_id=new_expense26.expense_id,
    #     category_id=new_category3_user2.category_id,
    #     spent=30.0,  # Adjusted to match the total spent in new_expense26
    #     sub_expense_name='Tickets'
    # )
    # new_subexpense26_2 = SubExpense(
    #     expense_id=new_expense26.expense_id,
    #     category_id=new_category2_user2.category_id,
    #     spent=20.0,  # Adjusted to match the total spent in new_expense26
    #     sub_expense_name='Snacks'
    # )
    # db.session.add(new_subexpense26)
    # db.session.add(new_subexpense26_2)
    # db.session.commit()

    # # ... (Previous code remains unchanged)

    # # Expense 27 at Tech Store for new_user2
    # new_expense27 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=300.0,
    #     store_name='Tech Store',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense27)
    # db.session.commit()
    # new_subexpense27 = SubExpense(
    #     expense_id=new_expense27.expense_id,
    #     category_id=new_category_user2.category_id,
    #     spent=200.0,  # Adjusted to match the total spent in new_expense27
    #     sub_expense_name='Gadgets'
    # )
    # new_subexpense27_2 = SubExpense(
    #     expense_id=new_expense27.expense_id,
    #     category_id=new_category3_user2.category_id,
    #     spent=100.0,  # Adjusted to match the total spent in new_expense27
    #     sub_expense_name='Movies'
    # )
    # db.session.add(new_subexpense27)
    # db.session.add(new_subexpense27_2)
    # db.session.commit()

    # # Expense 28 at Restaurant for new_user2
    # new_expense28 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=80.0,
    #     store_name='Restaurant',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense28)
    # db.session.commit()
    # new_subexpense28 = SubExpense(
    #     expense_id=new_expense28.expense_id,
    #     category_id=new_category2_user2.category_id,
    #     spent=50.0,  # Adjusted to match the total spent in new_expense28
    #     sub_expense_name='Dinner'
    # )
    # new_subexpense28_2 = SubExpense(
    #     expense_id=new_expense28.expense_id,
    #     category_id=new_category3_user2.category_id,
    #     spent=30.0,  # Adjusted to match the total spent in new_expense28
    #     sub_expense_name='Drinks'
    # )
    # db.session.add(new_subexpense28)
    # db.session.add(new_subexpense28_2)
    # db.session.commit()

    # # Add more expenses (29 and onwards) following a similar pattern...

    # # Remember to adjust the timestamp, store names, and spent values as needed for realistic testing scenarios.

    # # Expense 29 at Bookstore for new_user2
    # new_expense29 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=40.0,
    #     store_name='Bookstore',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense29)
    # db.session.commit()
    # new_subexpense29 = SubExpense(
    #     expense_id=new_expense29.expense_id,
    #     category_id=new_category_user2.category_id,
    #     spent=25.0,  # Adjusted to match the total spent in new_expense29
    #     sub_expense_name='Books'
    # )
    # new_subexpense29_2 = SubExpense(
    #     expense_id=new_expense29.expense_id,
    #     category_id=new_category3_user2.category_id,
    #     spent=15.0,  # Adjusted to match the total spent in new_expense29
    #     sub_expense_name='Coffee'
    # )
    # db.session.add(new_subexpense29)
    # db.session.add(new_subexpense29_2)
    # db.session.commit()

    # # Expense 30 at Gym for new_user2
    # new_expense30 = Expense(
    #     timestamp=datetime.datetime.now(),
    #     total_spent=60.0,
    #     store_name='Gym',
    #     user_id=new_user2.user_id
    # )
    # db.session.add(new_expense30)
    # db.session.commit()
    # new_subexpense30 = SubExpense(
    #     expense_id=new_expense30.expense_id,
    #     category_id=new_category3_user2.category_id,
    #     spent=60.0,  # Adjusted to match the total spent in new_expense30
    #     sub_expense_name='Membership'
    # )
    # db.session.add(new_subexpense30)
    # db.session.commit()
