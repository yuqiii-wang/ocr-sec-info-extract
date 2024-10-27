import re
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
import logging

logger = logging.getLogger('UNSETTLE_TRADE_RULES')

SEP = ";"
REGEX_RULES = {
    "ACCOUNT": r"^[A-Z]{3}\d{3}$",
}

def parse_ytd_trade_extract_msg(text_query:str) -> dict:
    ner_results = {}
    text_tokens = text_query.split(" ")
    for rule_key in REGEX_RULES:
        for token in text_tokens:
            match = re.search(REGEX_RULES[rule_key], token)
            if match:
                ner_results[rule_key] = token
    return ner_results