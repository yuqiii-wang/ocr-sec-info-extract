from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import os
from process.process import process_upload_file

# Create a Flask application instance
app = Flask(__name__)
CORS(app)
app_dir = os.path.dirname(os.path.abspath(__file__))



@app.route('/process/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    return process_upload_file(file)
    