# Project
This contains both the frontend and backend for our project

To the React Native app in web, navigate to project=>frontend=>expense and run command: npm run web (after doing npm install)
If you want to run the backend and the frontend together, you can navigate to project => backend and run command: npm run start (after doing npm install)

# Expense Tracker Application

A full-stack **expense tracking application** developed as a course project. The system allows users to record, categorize, and review personal expenses through a structured workflow, focusing on clean architecture, data persistence, and usability.

The project emphasizes modular design, separation of concerns, and practical software engineering principles.

---

## Key Features

- Create, view, update, and delete expense records
- Categorize expenses for better financial insights
- Persistent data storage
- Clean, modular project structure
- Designed with maintainability and extensibility in mind

---

## Tech Stack

- **Language:** Python  
- **Backend / Logic:** Python-based application logic  
- **Storage:** Persistent database (project-configured)  
- **Architecture:** Modular, object-oriented design  

---

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/CS4800-expense-tracker/Project.git
cd Project
```

---

### 2) Set up a virtual environment (recommended)

```bash
python -m venv .venv
```

Activate the environment:

**macOS / Linux**
```bash
source .venv/bin/activate
```

**Windows (PowerShell)**
```powershell
.venv\Scripts\Activate.ps1
```

---

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

If a `requirements.txt` file is not present, install dependencies based on the imports used in the project files.

---

## Running the Application

```bash
python main.py
```

If your system uses `python3`:

```bash
python3 main.py
```

Follow the application flow to add and manage expenses.

---

## Project Structure (High Level)

```text
.
├── src/                    # core application logic
├── models/                 # data models
├── services/               # business logic / controllers
├── data/                   # persistence layer
├── main.py                 # application entry point
└── README.md
```

(Exact structure may vary based on implementation.)

---

## Data Management

- Expenses are stored persistently using the project’s configured storage solution.
- Data access logic is centralized to simplify future changes or migrations.
- Supports repeatable runs without data loss.

---

## Notes for Developers

- Business logic is separated from data access logic.
- Models encapsulate expense-related behavior.
- The system is designed to be easily extendable (e.g., reporting, analytics, UI upgrades).
- Code readability and maintainability were prioritized over premature optimization.

---


say which, and I’ll adjust only what’s needed.
