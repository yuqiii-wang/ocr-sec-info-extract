import threading
from flask import (Flask,
                session,
                request,
                jsonify,
                render_template,
                make_response,
                stream_with_context,
                Response)
from flask_cors import CORS
import os, json
from flask_socketio import SocketIO
from backend.config import setup_logger
from flask_bcrypt import Bcrypt
import requests
from backend.process.admin import process_create_admin_user, process_login_admin_user
from backend.db.db_healthcheck import elasticsearch_health_check, es_health_status, es_health_status_lock
from backend.process.process import (process_execute,
                                     process_upload_file,
                                     process_download_files,
                                     process_get_file_texts,
                                     process_delete_one_sample,
                                     process_update_one_sample_query_task,
                                     process_ocr,
                                     process_generate_shell_scripts,
                                     process_convert_to_merged_ner_jsons,
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

ELASTICSEARCH_HEALTH_URL = "http://localhost:9200/_cluster/health"

# Create a Flask application instance
app = Flask(__name__, 
            template_folder='frontend/build',
            static_folder='frontend/build/static')
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32 MB limit
CORS(app, resources={r'/process/submit': {"origins": "http://localhost:3000"},
                        r'/process/update/sample': {"origins": "http://localhost:3000"},
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
                        r'/admin/login': {"origins": "http://localhost:3000"},
                        r'/admin/create_user': {"origins": "http://localhost:3000"},
                    },
                    headers='Content-Type')
app.secret_key = 'your_secret_key_here'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
app_dir = os.path.dirname(os.path.abspath(__file__))
bcrypt = Bcrypt(app)

setup_logger(app)

@app.after_request
def allow_cors(response):
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/')
@app.route('/#home')
@app.route('/flask')
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

@app.route('/process/file/download', methods=['POST'])
def download_files():
    data = request.get_json()
    task_label = data.get("taskLabel", None)
    uuid = data.get("uuid", None)
    uuids_to_exclude = data.get("uuidsToExclude", None)
    queried_file_list = process_download_files(task_label, uuid, uuids_to_exclude)
    def generate():
        delimiter = "\n---END---\n"
        for item in queried_file_list:
            yield json.dumps(item) + delimiter
    return Response(stream_with_context(generate()), content_type="application/json")

@app.route('/process/file/text', methods=['POST'])
def get_file_texts():
    data = request.get_json()
    task_label = data.get("taskLabel", None)
    uuids = data.get("uuids", None)
    resp_json = process_get_file_texts(task_label, uuids)
    resp = make_response(resp_json)
    return resp

@app.route('/process/delete/sample', methods=['POST'])
def delete_one_sample():
    data = request.get_json()
    task_label = data.get("taskLabel", None)
    uuid = data.get("uuid", None)
    resp_json = process_delete_one_sample(task_label, uuid)
    resp = make_response(resp_json)
    return resp

@app.route('/process/update/sample', methods=['POST'])
def update_one_sample():
    data = request.get_json()
    old_task_label = data.get("oldTaskLabel", None)
    new_task_label = data.get("newTaskLabel", None)
    uuid = data.get("uuid", None)
    resp_json = process_update_one_sample_query_task(old_task_label, new_task_label, uuid)
    resp = make_response(resp_json)
    return resp

@app.route('/process/submit', methods=['POST'])
def submit():
    data = request.get_json()
    filenames = data["filenames"]
    task_label = data.get("taskLabel", None)
    resp_content = None
    resp_content = process_ocr(filenames, resp_content, socketio, task_label)
    resp = make_response(resp_content)
    return resp

@app.route('/process/execute', methods=['POST'])
def execute():
    data = request.get_json()
    shell_scripts = data.get("shell_scripts")
    process_execute(shell_scripts, socketio)
    resp = make_response(jsonify({"message": "ok"}))
    return resp

@app.route('/process/convert', methods=['POST'])
def convert():
    data = request.get_json()
    task_label = data.get("task_label", None)
    ocr_jsons:list[dict] = data.get("ocr_jsons", [{}])
    ner_jsons:list[dict] = data.get("ner_jsons", [{}])
    ner_jsons = ocr_jsons + ner_jsons
    resp = make_response(process_convert_to_merged_ner_jsons(ner_jsons, task_label))
    return resp

@app.route('/process/generate', methods=['POST'])
def generate():
    data = request.get_json()
    task_label = data.get("task_label", None)
    ner_jsons:dict[str, dict] = data.get("ner_jsons", {"": {}})
    resp = make_response(process_generate_shell_scripts(ner_jsons, task_label))
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
    resp = make_response(load_config_ner_details(ner_task, ner_item))
    return resp

@app.route('/config/load/ner/task/scripts', methods=['GET'])
def config_load_ner_task_scripts():
    ner_task = request.args.get('nertask', None)
    resp = make_response(load_ner_task_scripts(ner_task))
    return resp

@app.route('/config/save/ner/task/scripts', methods=['POST'])
def config_save_ner_task_scripts():
    data = request.get_json()
    ner_task = data.get('nertask', None)
    ner_task_script_configs = data.get('nertaskScriptConfigs', None)
    resp = make_response(save_ner_task_scripts(ner_task, ner_task_script_configs))
    return resp

@app.route('/config/save/ner', methods=['POST'])
def config_save_ner():
    data = request.get_json()
    ner_task = data.get("nerTask")
    ner_task_item = data.get("nerTaskItem")
    ner_task_item_details = json.loads(data.get("nerTaskItemDetails"))
    resp = make_response(save_config_ner_details(ner_task, ner_task_item, ner_task_item_details))
    return resp

@app.route('/config/train/classifier', methods=['POST'])
def config_train_classifier():
    data = request.get_json()
    training_labels = data["trainingLabels"]
    resp = make_response(train_classifier(training_labels))
    return resp

@app.route('/admin/create_user', methods=['POST'])
def create_admin_user():
    data = request.get_json()
    return process_create_admin_user(bcrypt, data)

@app.route('/admin/login', methods=['POST'])
def login_admin_user():
    data = request.get_json()
    return process_login_admin_user(bcrypt, data)

# internal re-direct
@app.route("/check/elasticsearch-db-health", methods=["GET"])
def get_elasticsearch_health():
    with es_health_status_lock:  # Lock access to health_status
        return jsonify(es_health_status)

# Route nginx proxy to render Kibana
@app.route('/flask/kibana/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def render_kibana(path):
    if path is None or path == "":
        path = "app/home#"

    kibana_url = f"http://127.0.0.1:5601/flask/kibana/{path}"

    try:
        headers = {key: value for key, value in request.headers if key != 'Host'}

        # Ensure the `kbn-xsrf` header is included for non-GET requests
        if request.method != 'GET' and 'kbn-xsrf' not in headers:
            headers['kbn-xsrf'] = 'flask-proxy'

        resp = requests.request(
            method=request.method,
            url=kibana_url,
            headers=headers,
            data=request.get_data(),
            params=request.args,
            cookies=request.cookies,
            allow_redirects=False
        )

        # Build the Flask response from the proxied response
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        response_headers = [(name, value) for (name, value) in resp.headers.items() if name.lower() not in excluded_headers]

        response = Response(
            resp.content,
            resp.status_code,
            response_headers
        )
        return response

    except requests.exceptions.RequestException as e:
        return f"Error communicating with Kibana: {e}", 502


if __name__ == "__main__":
    health_check_thread = threading.Thread(target=elasticsearch_health_check, daemon=True)
    health_check_thread.start()

    socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
