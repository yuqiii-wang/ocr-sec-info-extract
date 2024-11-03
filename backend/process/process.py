from typing import List, Union
import zipfile
from flask import jsonify
import os, io, zipfile, base64, time, json
from pathlib import Path
from logging import getLogger
from flask_socketio import SocketIO,emit
from backend.classifier.utils import store_ocr_text, store_msg_text
from backend.config import (LABEL_TEXT_MAP,
                            LOCAL_INPUT_IMAGE_DIR,
                            LABEL_PARSER_MAP,
                            TEXT_LABEL_MAP,
                            NER_CONFIG)
from backend.OCREngine import OCREngine
from backend.classifier.classifier import DT_Classifier, train_dt_model
from backend.parser_dispatchers.ocr_parsers.image_seg_by_color import ImageSegByColor
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
from backend.shell_script_converter.shell_script_BBG_converter import convert_to_shell_script_BBG
from backend.shell_script_executor.bsi_sec_setup import load_dummy_log

ocr_engine = OCREngine()
dt_classifier = DT_Classifier()
imageSegByColor_engine = ImageSegByColor(ocr_engine)
ner_config:dict[str, dict] = json.load(open(NER_CONFIG, "r"))

logger = getLogger("app")

def process_upload_file(file, fileUuid):

    if file.filename == '':
        return {'error': 'No selected file'}

    # Optionally, you can save the file to a directory
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, file.filename)
    file.save(file_path)

    return {"filename": file.filename,
            "fileUuid": fileUuid,
            "filepath": file_path}

def process_text_query(text_query: str):
    label_func_pred = dt_classifier.predict(text_query)
    proc_func = LABEL_PARSER_MAP[label_func_pred]
    task_handler_name = LABEL_TEXT_MAP[label_func_pred]
    ner_results, ner_pos_results = proc_func(text_query)
    store_msg_text(text_query)
    approval_template_id = -1
    if (label_func_pred == 4):
        approval_template_id = 4
    return {"ner_results": ner_results,
            "ner_pos": ner_pos_results,
            "msg": text_query,
            "task_label": task_handler_name,
            "approval_template_id": approval_template_id}

def process_remove_file(filename:str):
    file_path = Path(LOCAL_INPUT_IMAGE_DIR, filename)
    if file_path.exists():
        file_path.unlink()  # This will remove the file
        return jsonify({
            "message": f"{filename} has been removed."
        })
    else:
        return jsonify({
            "message": f"{filename} failed to get removed."
        })

def load_and_store_ocr_results(filename:str, text_bounding_boxes:list[TextBoundingBox]):
    all_text = ""
    for text_bounding_box in text_bounding_boxes:
        all_text += " " + text_bounding_box.text
    store_ocr_text(filename, all_text)
    return all_text

def process_ocr(filenames:list[str]):

    found_item_jsons = []
    image_output_paths = []

    for filename in filenames:
        file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, filename)
        text_bounding_boxes = ocr_engine.process_ocr(file_path)
        # text_bounding_boxes = imageSegByColor_engine.reseg_image_by_color(file_path, text_bounding_boxes)
        trimmed_text = load_and_store_ocr_results(filename, text_bounding_boxes)
        label_func_pred = dt_classifier.predict(trimmed_text)
        if not label_func_pred in (0,1,2):
            label_func_pred = 2
        proc_func = LABEL_PARSER_MAP[label_func_pred]
        logger.info(f"Loaded func is {proc_func.__name__}")
        found_bounding_boxes, found_item_json = ocr_engine.parse_ocr(text_bounding_boxes, proc_func)
        image_output_path = ocr_engine.draw_ocr(filename, found_bounding_boxes)
        found_item_jsons.append(found_item_json)
        image_output_paths.append(image_output_path)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED) as zip_file:
        for image_output_path in image_output_paths:
            with open(image_output_path, "br") as filehanlde:
                file_content = filehanlde.read()
                zip_file.writestr(os.path.split(image_output_path)[-1], file_content)

    # Seek to the beginning of the stream
    zip_buffer.seek(0)
    encoded_zip = base64.b64encode(zip_buffer.getvalue()).decode('utf-8')
    
    # Create a JSON response containing the encoded zip file
    response_data = {
        "status": "success",
        "task_label": proc_func.__name__,
        "solution_reference": found_item_jsons,
        "zip_file": encoded_zip
    }
    return jsonify(response_data)

def process_convert(ocr_jsons, converter=convert_to_shell_script_BBG):
    shell_scripts = []
    for ocr_json in ocr_jsons:
        shell_scripts.append(converter(ocr_json))
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

def load_config_approval_template_by_id(approval_template_id:int):
    return jsonify({"approval_template_id": approval_template_id,
                    "approval_email_recipients": ["yuqi.wang@xxx.com"],
                    "regulation_reference_links":["https://example.xxx.com/regulations",
                                                  "https://example.xxx.com/regulations/dataprivacy"],
                    "approval_email_template": 
"""Dear approval manager

This email seeks for your approval on the request.

Thanks,
John
"""
                    })

def load_config_ner_details(ner_task, ner_item):
    if ner_task is None or not ner_task in TEXT_LABEL_MAP:
        return jsonify({})
    elif ner_item is None:
        ner_config_task_items = list(ner_config[ner_task].keys())
        return jsonify({
            "ner_task": ner_task,
            "ner_task_items": ner_config_task_items,
        })
    ner_task_item_details = ner_config[ner_task].get(ner_item, -1)
    return jsonify({
            "ner_task": ner_task,
            "ner_task_item": ner_item,
            "ner_task_item_details": ner_task_item_details
        })

def train_classifier():
    perf_metrics = train_dt_model()
    return jsonify(perf_metrics)

def load_audit_all():
    return jsonify({"message": "ok"})

def load_audit(start_time, end_time):
    return jsonify({"message": "ok"})
