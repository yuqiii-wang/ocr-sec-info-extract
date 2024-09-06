import os

current_dir = os.path.dirname(os.path.abspath(__file__))
LOCAL_INPUT_IMAGE_DIR=os.path.join(current_dir, "local_files", "input_images")

if not os.path.exists(LOCAL_INPUT_IMAGE_DIR):
    os.makedirs(LOCAL_INPUT_IMAGE_DIR) 