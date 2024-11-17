import threading
from flask import Flask, session, request, jsonify, render_template, make_response
from flask_cors import CORS
import os, flask, json
from flask_socketio import SocketIO
from backend.config import setup_logger, NER_CONFIG, TASK_SCRIPTS
from backend.process.process import (process_execute, 
                                     process_upload_file,
                                     process_ocr,
                                     process_generate_shell_scripts,
                                     load_audit,
                                     load_audit_all,
                                     load_config_classifier_all,
                                     process_text_query,
                                     train_classifier,
                                     process_remove_file,
                                     load_config_approval_template_by_id,
                                     load_config_ner_details,
                                     save_config_ner_details,
                                     load_ner_task_scripts,
                                     save_ner_task_scripts
                                     )

# Create a Flask application instance
app = Flask(__name__, 
            template_folder='frontend/build',
            static_folder='frontend/build/static')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit
CORS(app, resources={r'/process/submit': {"origins": "http://localhost:3000"},
                        r'/process/file/upload': {"origins": "http://localhost:3000"},
                        r'/process/file/remove': {"origins": "http://localhost:3000"},
                        r'/process/execute': {"origins": "http://localhost:3000"},
                        r'/process/ask': {"origins": "http://localhost:3000"},
                        r'/process/convert': {"origins": "http://localhost:3000"},
                        r'/config/load/classifier': {"origins": "http://localhost:3000"},
                        r'/config/train/classifier': {"origins": "http://localhost:3000"},
                        r'/config/load/ner': {"origins": "http://localhost:3000"},
                        r'/config/save/ner': {"origins": "http://localhost:3000"},
                        r'/config/load/ner/task/scripts': {"origins": "http://localhost:3000"},
                    },
                    headers='Content-Type')
app.secret_key = 'your_secret_key_here'
socketio = SocketIO(app, cors_allowed_origins="*")
app_dir = os.path.dirname(os.path.abspath(__file__))

app.config['NER_CONFIG'] = json.load(open(NER_CONFIG, "r"))
app.config['TASK_SCRIPTS'] = json.load(open(TASK_SCRIPTS, "r"))

setup_logger(app)

@app.after_request
def allow_cors(response):
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/')
@app.route('/#home')
def index():
    return render_template('index.html')

@app.route('/new/session', methods=['GET'])
def new_session():
    session_uuid = request.args.get('session_uuid')
    session.pop('session_uuid', None)
    session.pop('session_image_filenames', None)
    session['session_uuid'] = session_uuid
    session['session_image_filenames'] = []
    resp = make_response(jsonify({"message": "ok"}))
    return resp

@app.route('/process/ask', methods=['POST'])
def ask():
    data = request.get_json()
    msg = data.get("msg")
    resp = make_response(process_text_query(msg))
    return resp

@app.route('/process/file/remove', methods=['POST'])
def remove_file():
    data = request.get_json()
    filename = data.get("filename")
    if 'session_image_filenames' in session:
        session['session_image_filenames'].remove(filename)
    resp = make_response(process_remove_file(filename))
    return resp

@app.route('/process/file/upload', methods=['POST'])
def file_upload():
    if 'file' not in request.files:
        resp = make_response(jsonify({'error': 'No file part in the request'}))
        return resp
    file = request.files['file']
    if file.filename == '':
        resp = make_response(jsonify({'error': 'No filename found.'}))
        return resp
    if not '.png' in file.filename and not '.jpg' in file.filename:
        resp = make_response(jsonify({'error': 'No must input image of .png or .jpg.'}))
        return resp
    fileUuid = request.args.get("fileUuid")
    session['session_image_filenames'].append(file.filename)
    resp = make_response(process_upload_file(file, fileUuid))
    return resp

@app.route('/process/submit', methods=['POST'])
def submit():
    data = request.get_json()
    filenames = data["filenames"]
    resp = make_response(process_ocr(app, filenames))
    return resp

@app.route('/process/execute', methods=['POST'])
def execute():
    data = request.get_json()
    shell_scripts = data.get("shell_scripts")
    websocket_thread = threading.Thread(target=process_execute, args=(shell_scripts, socketio,))
    websocket_thread.start()
    websocket_thread.join()
    resp = make_response(jsonify({"message": "ok"}))
    return resp

@app.route('/process/convert', methods=['POST'])
def convert():
    data = request.get_json()
    task_label = data.get("task_label", None)
    ocr_jsons:list[dict] = data.get("ocr_jsons", [{}])
    ner_jsons:list[dict] = data.get("ner_jsons", [{}])
    ner_jsons = ocr_jsons + ner_jsons
    resp = make_response(process_generate_shell_scripts(app, ner_jsons, task_label))
    return resp

@app.route('/audit/load/time', methods=['GET'])
def audit_load_by_time():
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    resp = make_response(load_audit(start_time, end_time))
    return resp

@app.route('/audit/load/all', methods=['GET'])
def audit_load_all():
    resp = make_response(load_audit_all())
    return resp

@app.route('/config/load/classifier', methods=['GET'])
def config_load_all():
    resp = make_response(load_config_classifier_all())
    return resp

@app.route('/config/load/approval', methods=['GET'])
def config_load_approval():
    approval_template_id = request.args.get('approval_template_id')
    resp = make_response(load_config_approval_template_by_id(approval_template_id))
    return resp

@app.route('/config/load/ner', methods=['GET'])
def config_load_ner():
    ner_task = request.args.get('nertask', None)
    ner_item = request.args.get('neritem', None)
    resp = make_response(load_config_ner_details(app, ner_task, ner_item))
    return resp

@app.route('/config/load/ner/task/scripts', methods=['GET'])
def config_load_ner_task_scripts():
    ner_task = request.args.get('nertask', None)
    resp = make_response(load_ner_task_scripts(app, ner_task))
    return resp

@app.route('/config/save/ner/task/scripts', methods=['POST'])
def config_save_ner_task_scripts():
    data = request.get_json()
    ner_task = data.get('nertask', None)
    ner_task_script_configs = data.get('nertaskScriptConfigs', None)
    resp = make_response(save_ner_task_scripts(app, ner_task, ner_task_script_configs))
    return resp

@app.route('/config/save/ner', methods=['POST'])
def config_save_ner():
    data = request.get_json()
    ner_task = data.get("nerTask")
    ner_task_item = data.get("nerTaskItem")
    ner_task_item_details = json.loads(data.get("nerTaskItemDetails"))
    resp = make_response(save_config_ner_details(app, ner_task, ner_task_item, ner_task_item_details))
    return resp

@app.route('/config/train/classifier', methods=['POST'])
def config_train_classifier():
    resp = make_response(train_classifier())
    return resp

if __name__ == "__main__":
    app.run(debug=True)