import re
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
import logging

logger = logging.getLogger('UNSETTLE_TRADE_RULES')

SEP = ";"
REGEX_RULES = {
    "TRADE_ID": r"^\d{10}$",
}

def parse_unsettle_trade_msg(text_query:str) -> dict:
    ner_results = {}
    ner_pos_results = {}
    text_tokens = text_query.split(" ")
    for rule_key in REGEX_RULES:
        for token in text_tokens:
            match = re.search(REGEX_RULES[rule_key], token)
            if match:
                ner_results[rule_key] = token
                ner_pos_results[rule_key] = ( match.start(), match.end() )
    return ner_results, ner_pos_results
