from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

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
            "title": {
                "type": "text",
                "analyzer": "custom_analyzer",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256  # Restrict field to 256 characters
                    }
                }
            },
            "author": {
                "type": "keyword",
                "ignore_above": 100  # Restrict field to 100 characters
            },
            "published_date": {
                "type": "date",
                "format": "yyyy-MM-dd||epoch_millis"  # Enforce specific date format
            },
            "tags": {
                "type": "keyword",
                "ignore_above": 50  # Restrict each tag to 50 characters
            },
            "content": {
                "type": "text",
                "analyzer": "custom_analyzer",
                "index_options": "positions"  # Optimize for phrase queries
            },
            "views": {
                "type": "integer"  # Restrict to integer values
            },
            "location": {
                "type": "geo_point"  # Restrict to valid geo-point formats
            },
            "comments": {
                "type": "nested",  # Nested structure for complex sub-documents
                "properties": {
                    "user": {
                        "type": "keyword",
                        "ignore_above": 100  # Restrict username to 100 characters
                    },
                    "comment": {
                        "type": "text",
                        "analyzer": "custom_analyzer"
                    },
                    "timestamp": {
                        "type": "date",
                        "format": "yyyy-MM-dd||epoch_millis"  # Restrict timestamp format
                    }
                }
            }
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index="my_index"):
    response = es.indices.create(index="my_index", body=index_settings)
    print("Index created:", response)
else:
    print("Index already exists!")
    exit()


######## Input a valid doc
document = {
    "title": "Understanding Elasticsearch Mappings",
    "author": "John Doe",
    "published_date": "2024-12-14",
    "tags": ["elasticsearch", "tutorial"],
    "content": "This guide covers the basics of Elasticsearch mappings.",
    "views": 150,
    "location": {"lat": 40.7128, "lon": -74.0060},
    "comments": [
        {"user": "Alice", "comment": "Great article!", "timestamp": "2024-12-01"},
        {"user": "Bob", "comment": "Fantastic!", "timestamp": "2024-12-02"}
    ]
}

response = es.index(index="my_index", document=document)
print("Document indexed:", response)

######## Input an invalid doc
invalid_document = {
    "title": "Invalid Data Example",
    "author": "A very long author name exceeding the limit of 100 characters...",
    "published_date": "Invalid Date Format",
    "views": "not_an_integer"
}

try:
    response = es.index(index="my_index", document=invalid_document)
    print("Document indexed:", response)
except Exception as e:
    print("Error indexing document:", e)

######## query a doc
query = {
    "query": {
        "term": {
            "author": {
                "value": "John Doe"
            }
        }
    }
}

response = es.search(index="my_index", body=query)
print(response['hits']['hits'])