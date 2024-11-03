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
        char_pos = 0
        for token in text_tokens:
            match = re.search(REGEX_RULES[rule_key], token)
            if match:
                ner_results_per_rule_key:list = ner_results.get(rule_key, [])
                ner_results_per_rule_key.append(token)
                ner_results[rule_key] = ner_results_per_rule_key
                ner_pos_results_per_rule_key:list = ner_pos_results.get(rule_key, [])
                ner_pos_results_per_rule_key.append([ match.start()+char_pos, match.end()+char_pos ])
                ner_pos_results[rule_key] = ner_pos_results_per_rule_key
            char_pos += len(token)+1
    return ner_results, ner_pos_results
