# const express = require('express');
# const cors = require('cors');
# const axios = require('axios');
# const fs = require('fs');

# const app = express();
# const port = 5173;

# app.use(cors());
# app.use(express.json());

# app.post('/classify_batches', async (req, res) => {
#   const frontendEndpoint = 'http://ba98-34-135-65-1.ngrok-free.app/classify_batches';
#   const frontendData = req.body;

#   try {
#     const response = await axios.post(frontendEndpoint, frontendData, {
#       headers: {
#         'Content-Type': 'application/json',
#       },
#     });

#     // Assuming the response from the external endpoint needs to be processed or sent back
#     const result = response.data;

#     // Appending the result to output.json on the server
#     const existingOutput = JSON.parse(fs.readFileSync('output.json', 'utf8')) || [];
#     const newOutput = existingOutput.concat(result);
#     fs.writeFileSync('output.json', JSON.stringify(newOutput, null, 2));

#     res.json(result);
#   } catch (error) {
#     console.error('Error sending data to frontend endpoint:', error);
#     res.status(500).json({ error: 'Internal Server Error' });
#   }
# });

# app.post('/append_to_output', (req, res) => {
#   const result = req.body;

#   // Appending the result to output.json on the server
#   const existingOutput = JSON.parse(fs.readFileSync('output.json', 'utf8')) || [];
#   const newOutput = existingOutput.concat(result);
#   fs.writeFileSync('output.json', JSON.stringify(newOutput, null, 2));

#   res.json({ success: true, message: 'Result appended to output.json' });
# });

# app.listen(port, () => {
#   console.log(`Server is running on http://localhost:${port}`);
# });




from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import requests
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
port = 5173

@app.route('/classify_batches', methods=['POST'])
def classify_batches():
    frontend_endpoint = 'http://ba98-34-135-65-1.ngrok-free.app/classify_batches'
    frontend_data = request.get_json()

    try:
        response = requests.post(frontend_endpoint, json=frontend_data, headers={'Content-Type': 'application/json'})

        # Assuming the response from the external endpoint needs to be processed or sent back
        result = response.json()

        # Appending the result to output.json on the server
        try:
            with open('output.json', 'r') as file:
                existing_output = json.load(file)
        except FileNotFoundError:
            existing_output = []

        new_output = existing_output + result

        with open('output.json', 'w') as file:
            json.dump(new_output, file, indent=2)

        return jsonify(result)
    except Exception as e:
        print(f'Error sending data to frontend endpoint: {e}')
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/append_to_output', methods=['POST'])
def append_to_output():
    result = request.get_json()

    # Appending the result to output.json on the server
    try:
        with open('output.json', 'r') as file:
            existing_output = json.load(file)
    except FileNotFoundError:
        existing_output = []

    new_output = existing_output + result

    with open('output.json', 'w') as file:
        json.dump(new_output, file, indent=2)

    return jsonify({'success': True, 'message': 'Result appended to output.json'})

if __name__ == '__main__':
    app.run(port=port)


