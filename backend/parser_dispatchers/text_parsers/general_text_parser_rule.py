import re

def parse_text_query_rule(text_query:str, ner_item_details:dict):
    ner_results:list[dict] = []
    ner_pos_results:list[dict] = []
    for rule_key, ner_item_detail in ner_item_details.items():
        ner_item_detail["full_regex"]
        ner_item_detail["key_regex"]
        ner_item_detail["val_regex"]

        full_regex_match = re.search(ner_item_detail["full_regex"], text_query)
        if not full_regex_match is None:
            full_regex_match_text = full_regex_match.group()
            match_start = full_regex_match.start()
            match_end = full_regex_match.end()
            key_regex_match = re.search(ner_item_detail["key_regex"], full_regex_match_text)
            if not key_regex_match is None:
                non_key_regex_match_text = full_regex_match_text.replace(key_regex_match.group(), "")
                val_regex_match = re.search(ner_item_detail["val_regex"], non_key_regex_match_text)
                if not val_regex_match is None:
                    ner_value = val_regex_match.group()
                    val_regex_exact_match = re.search(ner_value, full_regex_match_text)
                    tmp_ner_result = {}
                    tmp_ner_result[rule_key] = ner_value
                    ner_results.append(tmp_ner_result)
                    
                    ner_pos_results_per_rule_key:list = []
                    ner_pos_results_per_rule_key.append([ match_start+val_regex_exact_match.start(), 
                                                         match_start+val_regex_exact_match.end() ])
                    tmp_ner_pos_result = {}
                    tmp_ner_pos_result[rule_key] = ner_pos_results_per_rule_key
                    ner_pos_results.append(tmp_ner_pos_result)
    return ner_results, ner_pos_results