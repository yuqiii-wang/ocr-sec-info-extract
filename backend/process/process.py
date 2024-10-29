from typing import List, Union
import zipfile
from flask import jsonify, send_file, make_response
import os, io, zipfile, base64, time
from logging import getLogger
from flask_socketio import SocketIO,emit
from backend.classifier.utils import trim_text, store_text
from backend.config import LOCAL_INPUT_IMAGE_DIR, LABEL_PARSER_MAP, TEXT_LABEL_MAP
from backend.OCREngine import OCREngine
from backend.classifier.classifier import DT_Classifier, train_dt_model
from backend.parser_dispatchers.ocr_parsers.image_seg_by_color import ImageSegByColor
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
from backend.shell_script_converter.shell_script_BBG_converter import convert_to_shell_script_BBG
from backend.shell_script_executor.bsi_sec_setup import load_dummy_log

ocr_engine = OCREngine()
dt_classifier = DT_Classifier()
imageSegByColor_engine = ImageSegByColor(ocr_engine)

logger = getLogger("app")

def process_upload_file(file, fileUuid):

    if file.filename == '':
        return {'error': 'No selected file'}

    split_filename = file.filename.split(".")
    uudi_file_name = split_filename[0] + "_" + fileUuid + "." + split_filename[-1]

    # Optionally, you can save the file to a directory
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, uudi_file_name)
    file.save(file_path)

    return {"filename": file.filename,
            "fileUuid": fileUuid,
            "filepath": file_path}

def process_text_query(text_query: str):
    label_func_pred = dt_classifier.predict(text_query)
    return text_query

def load_and_store_ocr_results(filename:str, text_bounding_boxes:list[TextBoundingBox]):
    all_text = ""
    for text_bounding_box in text_bounding_boxes:
        all_text += " " + text_bounding_box.text
    trimmed_text = trim_text(all_text)
    store_text(filename, trimmed_text)
    return trimmed_text

def process_ocr(file_path:str):

    _, filename = os.path.split(file_path)

    text_bounding_boxes = ocr_engine.process_ocr(filename)
    # text_bounding_boxes = imageSegByColor_engine.reseg_image_by_color(file_path, text_bounding_boxes)
    trimmed_text = load_and_store_ocr_results(filename, text_bounding_boxes)
    label_func_pred = dt_classifier.predict(trimmed_text)
    proc_func = LABEL_PARSER_MAP[label_func_pred]
    logger.info(f"Loaded func is {proc_func.__name__}")
    found_bounding_boxes, found_item_json = ocr_engine.parse_ocr(text_bounding_boxes, proc_func)
    image_output_path = ocr_engine.draw_ocr(filename, found_bounding_boxes)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED) as zip_file:
        with open(image_output_path, "br") as filehanlde:
            file_content = filehanlde.read()
            zip_file.writestr(os.path.split(image_output_path)[-1], file_content)

    # Seek to the beginning of the stream
    zip_buffer.seek(0)
    encoded_zip = base64.b64encode(zip_buffer.getvalue()).decode('utf-8')
    
    # Create a JSON response containing the encoded zip file
    response_data = {
        "status": "success",
        "solution_reference": found_item_json,
        "zip_file": encoded_zip
    }
    return jsonify(response_data)

def process_convert(ocr_json, converter=convert_to_shell_script_BBG):
    shell_scripts = converter(ocr_json)
    return jsonify({
        "shell_scripts": shell_scripts
    })

def process_execute(shell_scripts:list[str], socketio:SocketIO):
    dummy_log_str = load_dummy_log(shell_scripts)
    for dummy_log_line in dummy_log_str.split('\n')[:10]:
        socketio.emit('message', {'data': f'{dummy_log_line}'})
        time.sleep(0.1)
    time.sleep(3)
    for dummy_log_line in dummy_log_str.split('\n')[10:]:
        socketio.emit('message', {'data': f'{dummy_log_line}'})
        time.sleep(0.1)
    socketio.emit('end', {'data': 'End of log'})

def load_config_classifier_all():
    return jsonify({"classifier_config": TEXT_LABEL_MAP})

def train_classifier():
    perf_metrics = train_dt_model()
    return jsonify(perf_metrics)

def load_audit_all():
    return jsonify({"message": "ok"})

def load_audit(start_time, end_time):
    return jsonify({"message": "ok"})
