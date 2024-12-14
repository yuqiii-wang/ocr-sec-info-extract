from backend.db.db_query_utils import merge_queried_dataset_datetime_by_query_task, query_dataset_by_time_range

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
    audit_result:dict[str, list] = {}
    audit_result["datasets"] = []
    queried_results = query_dataset_by_time_range(start_time, end_time)
    merged_queried_datetime_results = merge_queried_dataset_datetime_by_query_task(queried_results)
    for task_label_idx, task_label in enumerate(merged_queried_datetime_results):
        audit_chart_item = {"label": task_label,
                            "data": [],
                            "backgroundColor": color_scheme[task_label_idx
                                                        % len(color_scheme)],
                            "pointRadius": 5}
        for datetime_item in merged_queried_datetime_results[task_label]:
            audit_chart_item["data"].append({
                "x": datetime_item,
                "y": task_label})
        audit_result["datasets"].append(audit_chart_item)
    return audit_result