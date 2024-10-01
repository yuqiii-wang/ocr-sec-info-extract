from typing import List, Union
import zipfile
from flask import Flask, request, jsonify, send_file, make_response
import os, io, zipfile, base64
from backend.config import LOCAL_INPUT_IMAGE_DIR
from backend.OCREngine import OCREngine
from backend.shell_script_converter.shell_script_BBG_converter import convert_to_shell_script_BBG

ocr_engine = OCREngine()

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

def process_ocr(file_path:str):

    directory, filename = os.path.split(file_path)

    text_bounding_boxes = ocr_engine.process_ocr(filename)
    found_bounding_boxes, found_item_json = ocr_engine.parse_ocr(text_bounding_boxes)
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