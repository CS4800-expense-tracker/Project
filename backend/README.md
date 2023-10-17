## HOW TO USE VENV

1. First thing you want to do is create some directory or folder which will house this virtual enviornment. I like to call mine "venv" cause that's easy to remember.
```
mkdir venv
```
2. The next thing you want to do is actually initialize this virtual enviornment within the venv folder. Do so using this command.
```
python3 -m venv venv
```
3. Perfect! Now that we have our enviornment created, we want to activate it.
```
. venv/bin/activate
```
4. After it's activated, you just want to install all necessary dependencies/libraries
```
pip install -r requirments.txt
```

## HOW TO RUN THE FLASK APP
```
flask --app index run
```


## IF YOU EVER ADD A NEW PACKAGE, RUN THIS COMMAND
```
pip freeze >> requirements.txt
```
- It will make sure the required packages are up to date
