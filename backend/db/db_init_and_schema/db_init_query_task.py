import time
from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

INDEX_NAME="query_task"

# Define the index settings and mappings
index_settings = {
    "mappings": {
        "properties": {
            "query_task": {
                "type": "keyword",
            },
            "metadata_keywords": {
                "type": "keyword",
            },
            "label": {
                "type": "integer",
            },
            "datetime_created_at": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss"
            },
            "is_enabled": {
                "type": "boolean",
            },
            "is_approval_required": {
                "type": "boolean",
            },
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index=INDEX_NAME):
    response = es.indices.create(index=INDEX_NAME, body=index_settings)
    print("Index created:", response)
else:
    print("Index shell_config already exists!")
    exit()


######## Set up query task handling
docs = [{
    "query_task": "bbg_bond",
    "label": 0,
    "datetime_created_at": "2024-12-01 00:00:00",
    "is_enabled": True,
    "is_approval_required": False
},{
    "query_task": "bbg_mbs",
    "label": 1,
    "datetime_created_at": "2024-12-01 00:00:00",
    "is_enabled": True,
    "is_approval_required": False
},{
    "query_task": "cfest_bond",
    "label": 2,
    "datetime_created_at": "2024-12-01 00:00:00",
    "is_enabled": True,
    "is_approval_required": False
}]

for doc in docs:
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

