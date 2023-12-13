from datetime import datetime
from flask_bcrypt import generate_password_hash
from index import db, User, Category, Expense, app, SubExpense, TotalBudget
from faker import Faker
import random

fake = Faker()

store_names = [
    "Target", "Amazon", "Ralphs", "Best Buy", "Albertsons", "Walmart", "Costco", "Home Depot", 
    "Coffee Beans", "Apple Store", "Whole Foods", "IKEA", "Lowe's", "Trader Joe's", "Safeway", 
    "CVS Pharmacy", "Petco", "Ulta Beauty", "GameStop", "Barnes & Noble", "The Home Depot", 
    "Walgreens", "Dollar Tree", "Michaels", "Office Depot", "H&M", "Marshalls", "Kohl's", 
    "Bed Bath & Beyond", "T.J. Maxx"
]

# Function to create test data for ten users
with app.app_context():
    categories_list = ["Groceries", "Entertainment", "Clothing", "Transportation", "Dining Out", "Utilities"]
    for i in range(11, 21):
        email = f"user{i}@example.com"
        name = fake.name()  # Generate a fake name
        password = generate_password_hash(f"password{i}").decode('utf-8')

        # Create User
        user = User(email=email, name=name, password=password)
        db.session.add(user)
        db.session.commit()

        # Create Total Budget for the user (rounded to nearest 100th)
        total_budget = TotalBudget(user_id=user.user_id, timestamp=datetime.utcnow(), total_budget=round(float(f"{i}88") / 100) * 100)
        db.session.add(total_budget)
        db.session.commit()

        # Create Categories for the user
        user_categories = random.sample(categories_list, random.randint(1, min(6, len(categories_list))))
        user_categories_percent = [5, 10, 15, 20, 25, 30]
        total_percent = 0
        categories_to_add = []
        for j, cat_name in enumerate(user_categories):
            percent = user_categories_percent[j]
            total_percent += percent
            categories_to_add.append(Category(user_id=user.user_id, name=cat_name, percent=percent, timestamp=datetime.utcnow()))
        # Adjust total percentage to 100 if it exceeds or less than 100
        if total_percent > 100:
            categories_to_add[-1].percent -= total_percent - 100
        elif total_percent < 100:
            categories_to_add[-1].percent += 100 - total_percent
        db.session.add_all(categories_to_add)
        db.session.commit()

        # Create Expenses for the user
        for _ in range(random.randint(1, 5)):
            store_name = random.choice(store_names)
            # Generating a random amount between 50 and 500 for more realistic spending
            total_spent = random.randint(5, 100)
            expense = Expense(user_id=user.user_id, timestamp=datetime.utcnow(), total_spent=total_spent, store_name=store_name)
            db.session.add(expense)
            db.session.commit()

            # Create SubExpenses for the expenses
            categories = Category.query.filter_by(user_id=user.user_id).all()
            sub_expenses_count = min(3, len(categories))
            sub_expenses = []
            for sub_exp_count in range(sub_expenses_count):
                if sub_exp_count == sub_expenses_count - 1:
                    sub_expense_amount = total_spent - sum(se.spent for se in sub_expenses)
                else:
                    sub_expense_amount = random.randint(1, total_spent - sum(se.spent for se in sub_expenses) - (sub_expenses_count - sub_exp_count - 1))
                sub_expense = SubExpense(expense_id=expense.expense_id, category_id=categories[sub_exp_count].category_id, spent=sub_expense_amount)
                sub_expenses.append(sub_expense)
            db.session.add_all(sub_expenses)
            db.session.commit()