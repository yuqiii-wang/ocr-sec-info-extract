from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import os, uuid, base64
from backend.config import (LABEL_TEXT_MAP,
                            LOCAL_INPUT_IMAGE_DIR,
                            TEXT_LABEL_MAP,
                            )

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

def query_dataset_by_time_range(start_time:str, end_time:str, return_items=["query_task", "uuid", "datetime"]):
    index_name = "dataset"
    for must_include_return_item in ["query_task", "uuid", "datetime"]:
        if not must_include_return_item in return_items:
            raise Exception('["query_task", "uuid", "datetime"] must be present in return_items')

    query_body = {
        "query": {
            "range": {
                "datetime": {
                    "gte": start_time,
                    "lte": end_time,
                    "format": "yyyy-MM-dd HH:mm:ss"
                }
            }
        },
        "size": 9999,
        "_source": return_items
    }
    response = es.search(index=index_name, body=query_body)

    results = []
    for hit in response['hits']['hits']:
        results.append(hit['_source'])
    return results

def query_ner_details(query_task:str):
    index_name = "ner"
    query_body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "query_task": query_task
                        }
                    }
                ]
            }
        }
    }
    response = es.search(index=index_name, body=query_body)

    results = []
    for hit in response['hits']['hits']:
        results.append({**hit['_source'],
                        "id": hit["_id"]})
    if len(results) > 0:
        return results[0]
    else:
        return []


def query_shell_config(query_task:str):
    index_name = "shell_config"
    query_body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "query_task": query_task
                        }
                    }
                ]
            }
        }
    }
    response = es.search(index=index_name, body=query_body)

    results = []
    for hit in response['hits']['hits']:
        results.append({**hit['_source'],
                        "id": hit["_id"]})
    if len(results) > 0:
        return results[0]
    else:
        return []

def get_all_query_tasks():
    index_name = "query_task"
    response = es.search(index=index_name)

    results = []
    for hit in response['hits']['hits']:
        results.append({**hit['_source'],
                        "id": hit["_id"]})
    if len(results) > 0:
        return results
    else:
        return []
    
def update_ner_details(ner_detail:dict):
    index_name = "ner"
    response = es.update(
        index=index_name,
        id=ner_detail["id"],
        doc={"ners": ner_detail["ners"],
                "query_task": ner_detail["query_task"]}
    )
    print(response)

def update_shell_config(shell_config:dict):
    index_name = "shell_config"
    response = es.update(
        index=index_name,
        id=shell_config["id"],
        doc={"shell_details": shell_config["shell_details"],
                "query_task": shell_config["query_task"]}
    )
    print(response)

def insert_doc_to_dataset(content:str, query_task:str, uuid=str(uuid.uuid4()), file_idx=0):
    INDEX_NAME = "dataset"
    doc = {
        "query_task": query_task,
        "uuid": uuid,
        "content": content,
        "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "in_sample_seq_id": file_idx,
        "requester": ""
    }
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

def insert_image_to_store(filename:str, query_task:str, uuid=str(uuid.uuid4()), file_idx=0):
    file_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, filename)
    with open(file_path, "rb") as img_file:
        image_base64 = base64.b64encode(img_file.read()).decode("utf-8")
    while len(image_base64) % 4 != 0:
        image_base64 += "="
    INDEX_NAME = "image_store"
    doc = {
        "query_task": query_task,
        "uuid": uuid,
        "image_base64": image_base64,
        "in_sample_seq_id": file_idx,
    }
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

def merge_queried_dataset_datetime_by_query_task(queried_results:list):
    merged_queried_datetime_results = {}
    already_included_uuids = set()
    for queried_result in queried_results:
        this_query_item_list:list = merged_queried_datetime_results.get(queried_result["query_task"], [])
        if (queried_result["uuid"] in already_included_uuids):
            continue
        else:
            already_included_uuids.add(queried_result["uuid"])
        this_query_item_list.append(queried_result["datetime"])
        merged_queried_datetime_results[queried_result["query_task"]] = this_query_item_list
    return merged_queried_datetime_results