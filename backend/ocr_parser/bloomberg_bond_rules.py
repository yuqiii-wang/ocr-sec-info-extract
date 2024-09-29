import re
from backend.ocr_parser.text_bounding_box import TextBoundingBox
import logging

logger = logging.getLogger('BBG_RULES')

SEP = ";"
REGEX_RULES = {
    "ISIN": r"ISIN[; ]*[A-Z0-9]{12}",
    "Currency": r"Currency[; ]*[A-Z]{3}",
    "Country": r"Country[; ]*[\w ]+",
    "Moody": r"Moody's[; ]*[\w\+\-]+",
    "S&P": r"S&P[; ]*[\w\+\-]+",
    "Fitch": r"Fitch[; ]*[\w\+\-]+",
    "Coupon": r"Coupon[^s][; ]*[fF\d\.]+",
    "Maturity": r"Coupon[^s][; ]*[\w\/]+",
    "Day Cnt": r"Day Cnt[; ]*[\w\/]+",
    "Cpn Freq": r"Cpn Freq[; ]*[\w\/]+",
    "Interest Accrual Date": r"Interest Accrual Date[; ]*[\w\/]+",
    "1st Settle Date": r"1st Settle Date[; ]*[\w\/]+",
}

def parse_bloomberg_bond_ocr(bounding_boxes:list[TextBoundingBox]) -> tuple[list[TextBoundingBox], dict]:
    bounding_box_str = SEP.join([boudning_box.text for boudning_box in bounding_boxes])
    logger.info(bounding_box_str)
    found_bounding_boxes = []
    found_items = {}
    # Assume if regex matched, full text contained either this bounding box or two consecutive boxes
    for idx, boudning_box in enumerate(bounding_boxes):
        for rule_key in REGEX_RULES:
            if rule_key in boudning_box.text and not rule_key in found_items:
                match = re.search(REGEX_RULES[rule_key], bounding_box_str)
                if match:
                    found_bounding_boxes.append(boudning_box)
                    bounding_box_next_text = bounding_boxes[(idx+1) % len(bounding_boxes)].text
                    matched_text = match.group()
                    if bounding_box_next_text in matched_text:
                        found_items[rule_key] = bounding_box_next_text
                        found_bounding_boxes.append(bounding_boxes[(idx+1) % len(bounding_boxes)])
                    else:
                        item_text:str = boudning_box.text
                        item_text = item_text.replace(rule_key, "").replace(";", "").replace(" ", "")
                        found_items[rule_key] = item_text
    return found_bounding_boxes, found_items
