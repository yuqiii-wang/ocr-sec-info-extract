from typing import List, Union
import zipfile
from flask import jsonify
import os, io, zipfile, base64, time, json
from pathlib import Path
from logging import getLogger
from flask_socketio import SocketIO, emit
from backend.classifier.utils import store_ocr_text_and_image, store_msg_text
from backend.audit.audit import load_audit_by_time
from backend.config import (LABEL_TEXT_MAP,
                            LOCAL_INPUT_IMAGE_DIR,
                            TEXT_LABEL_MAP,
                            )
from backend.db.db_query_utils import query_ner_details, query_shell_config, update_ner_details, update_shell_config
from backend.process.utils import (iterate_dict, 
                                   parse_ocr_to_box_and_json,
                                   parse_text_query_to_json)
from backend.OCREngine import OCREngine
from backend.classifier.classifier import DT_Classifier, train_dt_model
from backend.parser_dispatchers.ocr_parsers.image_seg_by_color import ImageSegByColor
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
from backend.shell_script_generator.shell_script_generator import (generate_shell_scripts, 
                                                    convert_to_merged_ner_jsons,
                                                    add_missing_ners_to_merged_ner_jsons)
from backend.shell_script_executor.bsi_sec_setup import load_dummy_log

ocr_engine = OCREngine()
dt_classifier = DT_Classifier()
imageSegByColor_engine = ImageSegByColor(ocr_engine)

logger = getLogger("app")

def process_upload_file(file, fileUuid):

    if file.filename == '':
        return {'error': 'No selected file'}

    # Optionally, you can save the file to a directory
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, file.filename)
    file.save(file_path)
    time.sleep(0.1)

    return {"filename": file.filename,
            "fileUuid": fileUuid,
            "filepath": file_path}

def process_text_query(text_query: str):
    label_func_pred = dt_classifier.predict(text_query)
    task_label = LABEL_TEXT_MAP[label_func_pred]
    task_ner_details = query_ner_details(task_label)
    ner_results, ner_pos_results = parse_text_query_to_json(text_query, task_ner_details)
    store_msg_text(text_query, task_label)
    approval_template_id = -1
    if (label_func_pred == 4):
        approval_template_id = 4
    return jsonify({"ner_results": ner_results,
            "ner_pos": ner_pos_results,
            "msg": text_query,
            "task_label": task_label,
            "approval_template_id": approval_template_id})

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

def load_ocr_results(text_bounding_boxes:list[TextBoundingBox]):
    all_text = ""
    for text_bounding_box in text_bounding_boxes:
        all_text += " " + text_bounding_box.text
    return all_text

def process_ocr(filenames:list[str], resp_content, socketio:SocketIO, task_label=None):

    found_item_jsons = []
    image_output_paths = []

    for file_idx, filename in enumerate(filenames):
        file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, filename)
        text_bounding_boxes = ocr_engine.process_ocr(file_path)
        # text_bounding_boxes = imageSegByColor_engine.reseg_image_by_color(file_path, text_bounding_boxes)
        trimmed_text = load_ocr_results(text_bounding_boxes)
        if (task_label is None or task_label == ""):
            label_func_pred = dt_classifier.predict(trimmed_text)
            task_label = LABEL_TEXT_MAP[label_func_pred]
        store_ocr_text_and_image(trimmed_text, filename, task_label, file_idx)
        logger.info(f"Loaded task handler is {task_label}")
        task_ner_details = query_ner_details(task_label)
        found_bounding_boxes, found_item_json = parse_ocr_to_box_and_json(text_bounding_boxes, task_ner_details["ners"])
        image_output_path = ocr_engine.draw_ocr(filename, found_bounding_boxes)
        found_item_jsons.append(found_item_json)
        image_output_paths.append(image_output_path)

        progress = int((file_idx+1 / len(filenames)) * 100)
        socketio.emit('ocr_progress', {'progress': progress, 'index':file_idx+1, 'total': len(filenames)})

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
        "task_label": task_label,
        "solution_reference": found_item_jsons,
        "zip_file": encoded_zip
    }

    socketio.emit('ocr_progress', {'progress': 100, "status": "completed"})
    resp_content = jsonify(response_data)
    return resp_content

def process_convert_to_merged_ner_jsons(ner_jsons, task_label):
    shell_script_generation_config = query_shell_config(task_label)
    task_ner_details = query_ner_details(task_label)
    merged_ner_jsons = convert_to_merged_ner_jsons(shell_script_generation_config["shell_details"], ner_jsons)
    merged_ner_jsons = add_missing_ners_to_merged_ner_jsons(merged_ner_jsons, task_ner_details["ners"])
    return jsonify({
        "merged_ner_jsons": merged_ner_jsons
    })

def process_generate_shell_scripts(ner_jsons, task_label, generator=generate_shell_scripts):
    shell_script_generation_config = query_shell_config(task_label)
    result_task_scripts = generator(shell_script_generation_config["shell_details"], ner_jsons)
    return jsonify({
        "shell_scripts": result_task_scripts
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
    task_ner_details = query_ner_details(ner_task)
    if ner_task is None or not ner_task in TEXT_LABEL_MAP:
        return jsonify({})
    elif ner_item is None:
        ner_config_task_items:dict = task_ner_details["ners"]
        return jsonify({
            "ner_task": ner_task,
            "ner_task_items": list(ner_config_task_items.keys()),
        })
    ner_task_item_details:dict = task_ner_details["ners"].get(ner_item, {})
    if len(ner_task_item_details.items()) == 0:
        iterate_dict(ner_task_item_details)
    return jsonify({
            "ner_task": ner_task,
            "ner_task_item": ner_item,
            "ner_task_item_details": ner_task_item_details
        })

def save_config_ner_details(ner_task:str, ner_item:str, new_ner_detail:dict):
    task_ner_details = query_ner_details(ner_task)
    if len(task_ner_details["ners"]) == 0:
        return jsonify({
            "error_message": f"{ner_task} not found."
        })
    task_ner_details["ners"][ner_item] = new_ner_detail
    update_ner_details(task_ner_details)
    return jsonify({"message": "ok"})

def train_classifier(training_labels:list):
    perf_metrics = train_dt_model(training_labels)
    return jsonify(perf_metrics)

def load_ner_task_scripts(ner_task):
    ner_task_script_config = query_shell_config(ner_task)
    return jsonify(ner_task_script_config["shell_details"])

def save_ner_task_scripts(ner_task:str, new_ner_task_script_config:dict):
    ner_task_script_config = query_shell_config(ner_task)
    if len(ner_task_script_config) == 0:
        return jsonify({
            "error_message": f"{ner_task} not found."
        })
    ner_task_script_config["shell_details"] = new_ner_task_script_config
    update_shell_config(ner_task_script_config)
    return jsonify(ner_task_script_config)

def load_audit_all():
    return jsonify({"message": "ok"})

def load_audit(start_time, end_time):
    audit_result:dict = load_audit_by_time(start_time, end_time)
    return jsonify(audit_result)
