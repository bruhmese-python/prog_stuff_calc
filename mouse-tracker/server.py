from flask import Flask, jsonify, send_from_directory, request
import os
import json

app = Flask(__name__)

# Global variable to store the last mouse position
mouse_position = {'x': None, 'y': None}

@app.route("/")
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

# Route to handle AJAX (POST) requests for mouse position (same as before)
@app.route('/track-mouse', methods=['POST'])
def track_mouse():
    global mouse_position
    data = request.get_json()
    mouse_position['x'] = data.get('x')
    mouse_position['y'] = data.get('y')
    print(f"Received mouse position: X = {mouse_position['x']}, Y = {mouse_position['y']}")
    
    # Respond with a JSON object
    return jsonify({'status': 'success', 'message': 'Mouse position received'})

# Route to retrieve the last mouse position (GET request)
@app.route('/get-mouse-position', methods=['GET'])
def get_mouse_position():
    return jsonify(mouse_position)

# Start the Flask web server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
