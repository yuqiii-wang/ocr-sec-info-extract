from flask import Flask, request, jsonify, render_template, make_response
from flask_cors import CORS
import os, flask, json
from backend.process.process import (process_upload_file,
                                     process_ocr,
                                     process_convert)

# Create a Flask application instance
app = Flask(__name__, 
            template_folder='frontend/build',
            static_folder='frontend/build/static')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit
CORS(app, resources={r'/process/submit': {"origins": "http://localhost:3000"},
                    r'/process/fileupload': {"origins": "http://localhost:3000"},
                    r'/process/convert': {"origins": "http://localhost:3000"}},
                    headers='Content-Type')
app_dir = os.path.dirname(os.path.abspath(__file__))

@app.after_request
def allow_cors(response):
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process/fileupload', methods=['POST'])
def fileupload():
    
    if 'file' not in request.files:
        resp = make_response(jsonify({'error': 'No file part in the request'}))
        return resp

    file = request.files['file']
    if file.filename == '':
        resp = make_response(jsonify({'error': 'No filename found.'}))
        return resp

    if not '.png' in file.filename and not '.jpe' in file.filename:
        resp = make_response(jsonify({'error': 'No must input image of .png or .jpg.'}))
        return resp

    fileUuid = request.args.get("fileUuid")
    resp = make_response(process_upload_file(file, fileUuid))
    return resp

@app.route('/process/submit', methods=['POST'])
def submit():
    data = request.get_json()
    file_path = data.get("filepath")
    resp = make_response(process_ocr(file_path))
    return resp
    
@app.route('/process/convert', methods=['POST'])
def convert():
    data = request.get_json()
    ocr_json = json.loads(data.get("ocr_json"))
    resp = make_response(process_convert(ocr_json))
    return resp

if __name__ == "__main__":
    app.run(debug=True)