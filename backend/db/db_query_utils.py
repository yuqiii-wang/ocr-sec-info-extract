from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import os, uuid, base64
import logging
from backend.env import LOCAL_INPUT_IMAGE_DIR
import random

logger = logging.getLogger("app")

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

def query_dataset_by_uuids(query_task:str, uuids:list):
    index_name = "dataset"
    query_body = {
        "query": {
            "terms": {
                    "uuid": uuids
                }
            }
    }
    response = es.search(index=index_name, body=query_body)

    results = []
    for hit in response['hits']['hits']:
        results.append({**hit['_source'],
                        "id": hit["_id"]})
    return results

def query_ner_details(query_task:str):
    index_name = "ner"
    match_conditions = [{"match": {"query_task": query_task} }]
    query_body = {
        "query": {
            "bool": {
                "must": match_conditions
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
    match_conditions = [{"match": {"query_task": query_task} }]
    query_body = {
        "query": {
            "bool": {
                "must": match_conditions
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

def query_image(query_task:str, uuid:str=None, uuids_to_exclude:list=[]):
    index_name = "image_store"
    match_conditions = [{"match": {"query_task": query_task} }]
    return_size = 100
    if not uuid is None:
        match_conditions.append({"match": {"uuid": uuid} })
        query_body = {
            "query": {
                "bool": {
                    "must": match_conditions
                }
            },
            "size": return_size
        }
    else: # randomly got a uuid then get this
        match_uuid_exclusion_conditions = []
        query_body = {
            "query": {
                "function_score": {
                    "query": {"match": {"query_task": query_task} },
                    "random_score": {
                        "field": "uuid",
                        "seed": random.randint(1, 999999)
                    }
                }
            },
            "size": 1
        }
        response = es.search(index=index_name, body=query_body)
        found_rand_uuid = response['hits']['hits'][0]['_source']['uuid']
        if len(uuids_to_exclude) > 0:
            research_count = 0
            while research_count < 5 and found_rand_uuid in uuids_to_exclude:
                research_count += 1
                response = es.search(index=index_name, body=query_body)
                found_rand_uuid = response['hits']['hits'][0]['_source']['uuid']
            match_uuid_exclusion_conditions.append({"terms": {"uuid": uuids_to_exclude} })
        match_conditions.append({"match": {"uuid": found_rand_uuid} })
        query_body = {
            "query": {
                "bool": {
                    "must": match_conditions,
                    "must_not": match_uuid_exclusion_conditions
                }
            },
            "size": return_size
        }
    
    response = es.search(index=index_name, body=query_body)

    results = []
    for hit in response['hits']['hits']:
        results.append({**hit['_source'],
                        "id": hit["_id"]})
    return results

def delete_one_data_sample_by_one_uuid(query_task:str, uuid:str=None):
    image_store_index_name = "image_store"
    dataset_index_name = "dataset"
    match_conditions = [{"match": {"query_task": query_task} },
                        {"match": {"uuid": uuid} },]
    query_body = {
        "query": {
            "bool": {
                "must": match_conditions
            }
        }
    }
    response = es.search(index=image_store_index_name, body=query_body)
    image_found_results = []
    for hit in response['hits']['hits']:
        image_found_results.append({**hit['_source'],
                        "id": hit["_id"]})
    for image_found_result in image_found_results:
        image_doc_seq_no, image_doc_primary_term = get_document_version(image_store_index_name, image_found_result["id"])
        response = es.delete(index=image_store_index_name, id=image_found_result["id"],
                            if_seq_no=image_doc_seq_no, if_primary_term=image_doc_primary_term)
        logger.info(response)
    
    response = es.search(index=dataset_index_name, body=query_body)
    text_found_results = []
    for hit in response['hits']['hits']:
        text_found_results.append({**hit['_source'],
                        "id": hit["_id"]})
    for text_found_result in text_found_results:
        text_doc_seq_no, text_doc_primary_term = get_document_version(dataset_index_name, text_found_result["id"])
        response = es.delete(index=dataset_index_name, id=text_found_result["id"],
                            if_seq_no=text_doc_seq_no, if_primary_term=text_doc_primary_term)
        logger.info(response)
    return {"message": f"Deleted {uuid} under index {query_task}"}

def update_ner_details(ner_detail:dict):
    index_name = "ner"
    response = es.index(
        index=index_name,
        id=ner_detail["id"],
        document={"ners": ner_detail["ners"],
                "query_task": ner_detail["query_task"]}
    )
    logger.info(response)

def update_shell_config(shell_config:dict):
    index_name = "shell_config"
    response = es.index(
        index=index_name,
        id=shell_config["id"],
        document={"shell_details": shell_config["shell_details"],
                "query_task": shell_config["query_task"]}
    )
    logger.info(response)

def update_data_sample_query_task_by_uuid(old_query_task:str, new_query_task:str, uuid:str):
    image_store_index_name = "image_store"
    dataset_index_name = "dataset"
    match_conditions = [{"match": {"query_task": old_query_task} },
                        {"match": {"uuid": uuid} },]
    query_body = {
        "query": {
            "bool": {
                "must": match_conditions
            }
        }
    }
    for index_name in [image_store_index_name, dataset_index_name]:
        search_response = es.search(index=index_name, body=query_body)
        for hit in search_response['hits']['hits']:
            src = hit["_source"]
            src["query_task"] = new_query_task
            update_response = es.update(
                index=index_name,
                id=hit["_id"],
                doc=src
            )
            logger.info(f"update_data_sample_query_task_by_uuid: {old_query_task} to {new_query_task}")
            logger.info(update_response)
    return {"message": f"Updated {uuid} from {old_query_task} to {new_query_task}"}

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
    logger.info(f"Document dataset indexed for {query_task}")
    logger.info(response)

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
    logger.info(f"Document image_store indexed for {query_task}")

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


def get_document_version(index, doc_id):
    try:
        # Retrieve the document
        response = es.get(index=index, id=doc_id)
        seq_no = response['_seq_no']
        primary_term = response['_primary_term']
        print(f"Document found. seqNo: {seq_no}, primaryTerm: {primary_term}")
        return seq_no, primary_term
    except NotFoundError:
        print(f"Document with ID '{doc_id}' not found in index '{index}'.")
        return None, None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None, None
