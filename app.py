from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from backend.process.process import (process_upload_file,
                                     process_ocr)

# Create a Flask application instance
app = Flask(__name__)
CORS(app)
app_dir = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process/fileupload', methods=['POST'])
def upload():
    print(request.form)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    return process_upload_file(file)

@app.route('/process/submit', methods=['GET'])
def submit():
    file_path = request.args.get("file_path")
    return process_ocr(file_path)
    
@app.route('/process/extract', methods=['POST'])
def extract():
    pass

if __name__ == "__main__":
    app.run(debug=True)