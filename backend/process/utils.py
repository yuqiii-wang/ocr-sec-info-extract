import os, json
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
from backend.parser_dispatchers.ocr_parsers.ocr_parser_rules import parse_ocr_by_rules

def iterate_dict(d, parent_key=''):
    for k, v in d.items():
        new_key = f'{parent_key}.{k}' if parent_key else k
        if isinstance(v, dict):
            iterate_dict(v, new_key)
        elif isinstance(v, str):
            d[k] = v.replace('\\\\', '\\')

def parse_ocr_to_box_and_json(bounding_boxes:list[TextBoundingBox], ner_item_details:dict) -> list[TextBoundingBox]:
        return parse_ocr_by_rules(bounding_boxes, ner_item_details)
