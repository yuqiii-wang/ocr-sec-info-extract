import re
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox
import logging

logger = logging.getLogger('OCR_RULES')


def parse_ocr_by_rules(bounding_boxes:list[TextBoundingBox], ner_item_details:dict) -> tuple[list[TextBoundingBox], dict]:
    bounding_box_str = " ".join([bounding_box.text for bounding_box in bounding_boxes])
    logger.info(bounding_box_str)
    found_bounding_boxes = []
    found_items = {}
    # Assume if regex matched, full text contained either this bounding box or two consecutive boxes
    for rule_key in ner_item_details:
        is_found_in_boxes = False
        for idx, bounding_box in enumerate(bounding_boxes):
            # get the surrounding text and locate the bounding box
            bounding_box_next_text = bounding_boxes[(idx+1) % len(bounding_boxes)].text
            bounding_box_this_text = bounding_boxes[idx].text
            surround_bounding_box_text = bounding_box_this_text + " " + bounding_box_next_text
            ner_item_detail = ner_item_details[rule_key]
            full_match = re.search(ner_item_detail["full_regex"], surround_bounding_box_text)
            if not full_match is None:
                full_matched_text = full_match.group()
                key_match = re.search(ner_item_detail["key_regex"], full_matched_text)
                if not key_match is None and not rule_key in found_items :
                    loaded_bounding_box_key_idx = -1
                    val_text = ""
                    if key_match.group() in full_matched_text:
                        # just for val extract
                        non_key_matched_text = full_matched_text.replace(key_match.group(), "")
                        val_match = re.search(ner_item_detail["val_regex"], non_key_matched_text)
                        if not val_match is None:
                            val_text = val_match.group()
                        bounding_box_this_key_match = re.search(ner_item_detail["key_regex"], bounding_box_this_text)
                        if not bounding_box_this_key_match is None:
                            loaded_bounding_box_key_idx = idx
                        else:
                            bounding_box_next_key_match = re.search(ner_item_detail["key_regex"], bounding_box_next_text)
                            if not bounding_box_next_key_match is None:
                                loaded_bounding_box_key_idx = (idx+1) % len(bounding_boxes)

                    loaded_bounding_box_val_idx = -1
                    val_this_text_match = re.search(ner_item_detail["val_regex"], bounding_box_this_text)
                    val_next_text_match = re.search(ner_item_detail["val_regex"], bounding_box_next_text)
                    if loaded_bounding_box_key_idx != -1:
                        if not val_next_text_match is None:
                            loaded_bounding_box_val_idx = (idx+1) % len(bounding_boxes)
                        elif not val_this_text_match is None:
                            loaded_bounding_box_val_idx = idx
                    if loaded_bounding_box_val_idx != -1:
                        found_bounding_boxes.append(bounding_boxes[loaded_bounding_box_val_idx])
                    if loaded_bounding_box_key_idx != -1:
                        found_bounding_boxes.append(bounding_boxes[loaded_bounding_box_key_idx])
                    found_items[rule_key] = val_text
                    is_found_in_boxes = True
                    break
                elif ner_item_detail["key_regex"] == "" and not rule_key in found_items :
                    val_this_text_match = re.search(ner_item_detail["val_regex"], bounding_box_this_text)
                    if not val_this_text_match is None:
                        found_bounding_boxes.append(bounding_boxes[idx])
                        found_items[rule_key] = val_this_text_match.group()
                        is_found_in_boxes = True
                        break
        if not is_found_in_boxes:
            full_match = re.search(ner_item_detail["full_regex"], bounding_box_str)
            if not full_match is None:
                found_text = full_match.group()
                key_match = re.search(ner_item_detail["key_regex"], found_text)
                if not key_match is None:
                    found_text = found_text.replace(key_match.group(), "")
                    val_match = re.search(ner_item_detail["val_regex"], found_text)
                    found_items[rule_key] = val_match.group()
                elif ner_item_detail["key_regex"] == "":
                    val_match = re.search(ner_item_detail["val_regex"], found_text)
                    found_items[rule_key] = val_match.group()
    return found_bounding_boxes, found_items

