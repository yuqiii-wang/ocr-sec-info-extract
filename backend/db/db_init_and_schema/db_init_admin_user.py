from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

INDEX_NAME = "admin_user"

# Define the index settings and mappings
index_settings = {
    "settings": {
        "analysis": {
            "analyzer": {
                "custom_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "stop"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "username": {
                "type": "keyword",
                "ignore_above": 100  # Restrict field to 100 characters
            },
            "password": {
                "type": "keyword",
            },
            "session_token": {
                "type": "keyword",
                "ignore_above": 50  # Restrict each tag to 50 characters
            },
            "session_created_at": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss"
            },
            "session_expired_at": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss"
            }
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index=INDEX_NAME):
    response = es.indices.create(index=INDEX_NAME, body=index_settings)
    print("Index created:", response)
else:
    print("Index already exists!")
    exit()


######## Input a valid doc
document = {
    "username": "kibana",
    "password": "$2b$12$X59VDhlAFCcAvmU61R0zGu0A5BM0neam/xnCOO0uEvuGfcdkkhvQK", # kibana
    "session_token": None,
    "session_created_at": "1970-01-01 00:00:00",
    "session_expired_at": "2099-12-31 23:59:59"
}

response = es.index(index=INDEX_NAME, document=document)
print("Document indexed:", response)
