'''
from flask import Flask, render_template,jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/next', methods=['POST'])
def next_step():
    # Logic for the "Next" action
    print("Next button pressed!")
    return jsonify({"message": "Next step triggered"})

@app.route('/repeat', methods=['POST'])
def repeat_action():
    # Logic for the "Repeat" action
    print("Repeat button pressed!")
    return jsonify({"message": "Repeat action triggered"})

if __name__ == '__main__':
    app.run(debug=True)
'''
from flask import Flask, render_template, request, redirect, url_for
import csv

app = Flask(__name__)

CSV_FILE = 'recipes.csv'
import csv

def parse_csv():
    recipes = {}
    current_recipe = None
    current_steps = []

    # Open the CSV file and process it
    with open(CSV_FILE, mode='r', newline='') as file:
        csv_reader = csv.reader(file)

        # First loop: Collect all recipe names from the first column
        all_recipes = []
        for row in csv_reader:
            recipe_title = row[0]
            if recipe_title:
                all_recipes.append(recipe_title)

        # Reset the file pointer to the start of the file for the second loop
        file.seek(0)
        csv_reader = csv.reader(file)

        # Second loop: Process steps for each recipe
        current_recipe = None
        current_steps = []

        for row in csv_reader:
            recipe_title = row[1]  # Recipe name from column 1
            action = row[1]  # Action or next recipe from column 2
            bowl = row[2] if row[2] else None  # Bowl number from column 3
            time = row[3] if row[3] else None  # Time from column 4

            # Step 1: If the action matches a recipe name, we begin processing the steps
            if recipe_title and recipe_title in all_recipes and not current_recipe:
                current_recipe = recipe_title  # Set current recipe to the name in column 1
                current_steps = []  # Reset the list for steps

            # Step 2: Add steps for the current recipe
            if current_recipe:
                if action and "Serve" in action:  # "Serve" marks the end of the recipe
                    current_steps.append({
                        'action': action,
                        'bowl': bowl,
                        'time': time
                    })
                    recipes[current_recipe] = current_steps  # Save the recipe and its steps
                    current_recipe = None  # Reset for the next recipe
                    current_steps = []  # Clear steps for the next recipe
                elif action:  # Add action to current recipe's steps
                    current_steps.append({
                        'action': action,
                        'bowl': bowl,
                        'time': time
                    })

        # **Ensure the last recipe is saved** after the loop finishes
        if current_recipe and current_steps:
            recipes[current_recipe] = current_steps

    return recipes


# Route to list all recipes
@app.route('/')
def index():
    recipes = parse_csv()
    return render_template('index2.html', recipes=recipes)

# Route to display the selected recipe steps
@app.route('/recipe/<recipe_name>')
def recipe_detail(recipe_name):
    recipes = parse_csv()
    if recipe_name in recipes:
        steps = recipes[recipe_name]
        return render_template('recipe_detail.html', recipe_name=recipe_name, steps=steps)
    else:
        return f"Recipe {recipe_name} not found!", 404

# New route for serving the p5.js sketch page
@app.route('/sketch')
def sketch():
    return render_template('index.html')  # This renders the p5.js sketch HTML page

@app.route('/whoosh.mp3')
def serve_whoosh():
    # Serving the 'whoosh.mp3' file from the 'static' folder
    return send_from_directory('static', 'whoosh.mp3')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



