from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

def read_limit():
    # Read the limit value from 'limit.conf'
    try:
        with open('limit.conf', 'r') as file:
            limit = file.read().strip()
            return float(limit)  # Convert it to a float for use in the gauge
    except FileNotFoundError:
        print("limit.conf file not found. Using default limit of 3000.")
        return 13000  # Return a default value if the file doesn't exist

@app.route('/')
def index():
    # Read CSV file
    data = pd.read_csv('data.csv')
    # Convert data to list of dictionaries
    expenses = data.to_dict(orient='records')

    # Get the value limit from 'limit.conf'
    value_limit = read_limit()

    return render_template('index.html', expenses=expenses, value_limit=value_limit)

if __name__ == '__main__':
    app.run(debug=True)
