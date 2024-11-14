from dateutil import parser
from collections import defaultdict
import copy

def _convert_to_standard_date(input_date_str, output_date_format:str='%Y-%m-%d'):
    try:
        date_obj = parser.parse(input_date_str)
        return date_obj.strftime(output_date_format)
    except (ValueError, TypeError):
        return input_date_str

# Group by duplicate_keys, merge allowed_merge_duplicate_items if there are multiple, otherwise, leave not merged item NOT populated in scripts
# The returned ner_jsons, inside each represents only one item to populate a script
def _merge_ner_list_by_duplicate_keys(duplicate_keys:list[str], 
                                      allowed_merge_duplicate_items:list[str], 
                                      ner_jsons:list[dict]):
    grouped_dict = defaultdict(set)
    for ner_json in ner_jsons:
        for group_key in duplicate_keys:
            key_value = ner_json.get(group_key)
            for k, v in ner_json.items():
                if k != group_key:
                    grouped_dict[key_value].add((k, v))

    # Convert each set of tuples back to a dictionary format
    result = {}
    for duplicate_val in grouped_dict:
        result[duplicate_val] = {}
        for ner_key, ner_val in grouped_dict[duplicate_val]:
            result[duplicate_val][ner_key] = ner_val
        for duplicate_key in duplicate_keys:
            result[duplicate_val][duplicate_key] = duplicate_val

    return result

def generate_shell_scripts(shell_script_generation_config:dict, ner_jsons:list[dict]):
    duplicate_keys = shell_script_generation_config["duplicate_keys"]
    allowed_merge_duplicate_items = shell_script_generation_config["allowed_merge_duplicate_items"]
    transform_lambda = shell_script_generation_config["transform_lambda"]
    pre_scripts:str = shell_script_generation_config["pre_scripts"]
    populated_scripts:str = shell_script_generation_config["populated_scripts"]
    post_scripts:str = shell_script_generation_config["post_scripts"]
    merged_ner_jsons = _merge_ner_list_by_duplicate_keys(duplicate_keys, allowed_merge_duplicate_items, ner_jsons)
    for transform_ner_name in transform_lambda:
        for merged_ner_key, merged_ner_json in merged_ner_jsons.items():
            if transform_ner_name in merged_ner_json:
                if "datetime" in transform_lambda[transform_ner_name]:
                    datetime_str = _convert_to_standard_date(merged_ner_json[transform_ner_name], transform_lambda[transform_ner_name]["datetime"])
                    merged_ner_json[transform_ner_name] = datetime_str
                elif "static_mapping" in transform_lambda[transform_ner_name]:
                    transform_val = transform_lambda[transform_ner_name]["static_mapping"][merged_ner_json[transform_ner_name]]
                    merged_ner_json[transform_ner_name] = transform_val
    result_populated_scripts = []
    result_populated_scripts.append(pre_scripts)
    for merged_ner_key, merged_ner_json in merged_ner_jsons.items():
        this_populated_scripts = copy.deepcopy(populated_scripts)
        for merged_ner_name in merged_ner_json:
            replace_val = merged_ner_json[merged_ner_name]
            if not isinstance(merged_ner_json[merged_ner_name], str):
                replace_val = str(replace_val)
            this_populated_scripts = this_populated_scripts.replace(r"{{" + merged_ner_name + r"}}", replace_val)
        result_populated_scripts.append(this_populated_scripts)
    result_populated_scripts.append(post_scripts)
    return result_populated_scripts
