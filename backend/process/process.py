from typing import List, Union
import zipfile
from flask import Flask, request, jsonify, send_file, make_response
import os
from config import LOCAL_INPUT_IMAGE_DIR


def process_upload_file(file):
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Optionally, you can save the file to a directory
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, file.filename)
    file.save(file_path)

    # Get file detail
    file_detail = {
        'file_name': file.filename,
        'file_size': len(file.read()),
        'content_type': file.content_type
    }

    # To avoid file.read() affecting file.save(), the position should be reset
    file.seek(0)

    return jsonify(file_detail), 200