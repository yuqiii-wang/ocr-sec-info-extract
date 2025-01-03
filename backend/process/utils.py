import os, json
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
from backend.parser_dispatchers.ocr_parsers.ocr_parser_rules import parse_ocr_by_rules
from backend.parser_dispatchers.text_parsers.general_text_parser_rule import parse_text_query_rule
from logging import getLogger

logger = getLogger("app")


def iterate_dict(d, parent_key=''):
    for k, v in d.items():
        new_key = f'{parent_key}.{k}' if parent_key else k
        if isinstance(v, dict):
            iterate_dict(v, new_key)
        elif isinstance(v, str):
            d[k] = v.replace('\\\\', '\\')

def parse_ocr_to_box_and_json(bounding_boxes:list[TextBoundingBox], ner_item_details:dict) -> list[TextBoundingBox]:
        return parse_ocr_by_rules(bounding_boxes, ner_item_details)

def parse_text_query_to_json(query_text: str, ner_item_details:dict):
    return parse_text_query_rule(query_text, ner_item_details)


def parse_ocr_by_checking_empty_key(bounding_boxes:list[TextBoundingBox], found_items: dict,
                                    ner_item_details:dict, file_path) -> tuple[list[TextBoundingBox], dict]:
    for ner_item_key in ner_item_details:
        if not ner_item_key in found_items:
            logger.info(f"{ner_item_key} not found")
            pass