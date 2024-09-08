from typing import List, Union
import zipfile
from flask import Flask, request, jsonify, send_file, make_response
import os, io, zipfile, base64
from backend.config import LOCAL_INPUT_IMAGE_DIR
from backend.OCREngine import OCREngine

ocr_engine = OCREngine()

def process_upload_file(file):
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Optionally, you can save the file to a directory
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, file.filename)
    file.save(file_path)

    return jsonify({"file_path": file_path}), 200

def process_ocr(file_path):

    text_bounding_boxes = ocr_engine.process_ocr(file_path)
    json_output_path = ocr_engine.parse_ocr(text_bounding_boxes)
    image_output_path = ocr_engine.draw_ocr(text_bounding_boxes)

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
        "solution_reference": json_output_path,
        "zip_file": encoded_zip
    }
    return jsonify(response_data), 200