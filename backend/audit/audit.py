import json, random
from dateutil import parser as datetime_parser
from backend.config import MSG_DATASET

msg_dataset = json.load(open(MSG_DATASET, "r"))

color_scheme = [
    "rgba(255, 185, 50, 0.8)",
    "rgba(255, 140, 0, 0.8)",
    "rgba(255, 160, 50, 0.7)",
    "rgba(255, 190, 80, 0.9)",
    "rgba(255, 130, 0, 0.75)",
    "rgba(255, 170, 70, 0.8)",
    "rgba(255, 100, 0, 0.85)",
    "rgba(255, 150, 30, 0.8)",
    "rgba(250, 170, 20, 0.8)",
    "rgba(255, 120, 10, 0.7)",
]

def load_audit_by_time(start_time, end_time):
    start_datetime = datetime_parser.parse(start_time)
    end_datetime = datetime_parser.parse(end_time)
    audit_result:dict[str, list] = {}
    audit_result["datasets"] = []
    for task_label_idx, task_label in enumerate(msg_dataset):
        audit_chart_item = {"label": task_label,
                            "data": [],
                            "backgroundColor": color_scheme[task_label_idx
                                                        % len(color_scheme)],
                            "pointRadius": 5}
        for item in msg_dataset[task_label]:
            if start_datetime < datetime_parser.parse(item["datetime"]) and \
            end_datetime > datetime_parser.parse(item["datetime"]):
                audit_chart_item["data"].append({
                    "x": item["datetime"],
                    "y": task_label})
        audit_result["datasets"].append(audit_chart_item)
    
    return audit_result