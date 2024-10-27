import os
from backend.parser_dispatchers.ocr_parsers.bloomberg_bond_rules import parse_bloomberg_bond_ocr
from backend.parser_dispatchers.ocr_parsers.bloomberg_mbs_rules import parse_bloomberg_mbs_ocr
from backend.parser_dispatchers.text_parsers.unsettle_trade_rules import parse_unsettle_trade_msg
from backend.parser_dispatchers.text_parsers.ytd_trade_extract_rules import parse_ytd_trade_extract_msg

current_dir = os.path.dirname(os.path.abspath(__file__))
LOCAL_INPUT_IMAGE_DIR=os.path.join(current_dir, "local_files", "input_images")
LOCAL_OCR_IMAGE_DIR=os.path.join(current_dir, "local_files", "ocr_images")
LOCAL_OCR_TMP_IMAGE_DIR=os.path.join(current_dir, "local_files", "tmp_images")

TEXT_LABEL_MAP = {
    "bond_bloomberg": 0,
    "mbs_bloomberg":  1,
    "unsettle_trade":  2,
    "extract_ytd_trades":  3,
}

LABEL_PARSER_MAP = {
    0: parse_bloomberg_bond_ocr,
    1: parse_bloomberg_mbs_ocr,
    2: parse_unsettle_trade_msg,
    3: parse_ytd_trade_extract_msg
}

LABEL_SCRIPT_MAP = {
    0: parse_bloomberg_bond_ocr,
    1: parse_bloomberg_mbs_ocr,
    2: parse_unsettle_trade_msg,
    3: parse_ytd_trade_extract_msg
}


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