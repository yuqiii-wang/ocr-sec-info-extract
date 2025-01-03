import os
from backend.db.db_query_utils import get_all_query_tasks

current_dir = os.path.dirname(os.path.abspath(__file__))
LOCAL_INPUT_IMAGE_DIR=os.path.join(current_dir, "local_files", "input_images")
LOCAL_OCR_IMAGE_DIR=os.path.join(current_dir, "local_files", "ocr_images")
LOCAL_OCR_TMP_IMAGE_DIR=os.path.join(current_dir, "local_files", "tmp_images")

all_query_tasks = get_all_query_tasks()

TEXT_LABEL_MAP = {task["query_task"]: task["label"] for task in all_query_tasks}
LABEL_TEXT_MAP = {v : k for k, v in TEXT_LABEL_MAP.items()}
TEXT_CONFIG_MAP = {task["query_task"]: task["metadata_config_labels"] for task in all_query_tasks}
TEXT_ENABLE_MAP = {task["query_task"]: task["is_enabled"] for task in all_query_tasks}

if not os.path.exists(LOCAL_INPUT_IMAGE_DIR):
    os.makedirs(LOCAL_INPUT_IMAGE_DIR)

if not os.path.exists(LOCAL_OCR_IMAGE_DIR):
    os.makedirs(LOCAL_OCR_IMAGE_DIR)

import os
from logging import Formatter, FileHandler, StreamHandler, getLogger, DEBUG, INFO, WARNING, ERROR, CRITICAL

# Define log file path
LOG_FILE = os.path.join(os.path.dirname(__file__), 'logs/app.log')
if not os.path.isdir(os.path.join(os.path.dirname(__file__), 'logs')):
    os.mkdir(os.path.join(os.path.dirname(__file__), 'logs'))

def setup_logger(app):
    # Create a logger object
    logger = getLogger('app')
    logger.setLevel(DEBUG)  # Set the minimum log level

    # Create file handler which logs even debug messages
    fh = FileHandler(LOG_FILE)
    fh.setLevel(DEBUG)

    # Create console handler with a higher log level
    ch = StreamHandler()
    ch.setLevel(INFO)

    # Create formatter and add it to the handlers
    formatter = Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    # Add the handlers to the logger
    logger.addHandler(fh)
    logger.addHandler(ch)

    # Attach the logger to the app
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)