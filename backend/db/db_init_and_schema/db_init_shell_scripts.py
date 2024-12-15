import time
from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

INDEX_NAME="shell_config"

# Define the index settings and mappings
index_shell_config_settings = {
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
            "query_task": {
                "type": "keyword",
            },
            "shell_details": {
                "type": "nested",
                "properties": {
                    "pre_scripts": {
                        "type": "text",
                        "analyzer": "custom_analyzer",
                        "index_options": "positions"
                    },
                    "post_scripts": {
                        "type": "text",
                        "analyzer": "custom_analyzer",
                        "index_options": "positions"
                    },
                    "populated_scripts": {
                        "type": "text",
                        "analyzer": "custom_analyzer",
                        "index_options": "positions"
                    },
                    "duplicate_keys": {
                        "type": "keyword",
                    },
                    "allowed_merge_duplicate_items": {
                        "type": "keyword",
                    },
                    "transform_lambda": {
                        "type": "nested",
                    }
                }
            }
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index=INDEX_NAME):
    response = es.indices.create(index=INDEX_NAME, body=index_shell_config_settings)
    print("Index created:", response)
else:
    print("Index shell_config already exists!")
    exit()


######## Set up query task handling
docs = [{
    "query_task": "bbg_bond",
    "shell_details": {
        "pre_scripts": "",
        "post_scripts": "",
        "populated_scripts": "",
        "duplicate_keys": ["ISIN"],
        "allowed_merge_duplicate_items": [""],
        "transform_lambda": {
            "1st_Settle_Date": { "datetime": "%Y-%m-%d" },
            "Cpn_Freq": { "static_mapping": { "A": 1, "Q": 4, "S/A": 2 } },
            "Interest_Accrual_Date": { "datetime": "%Y-%m-%d" },
            "Maturity": { "datetime": "%Y-%m-%d" }
        }
    }
}, {
    "query_task": "bbg_mbs",
    "shell_details": {
        "pre_scripts": "",
        "post_scripts": "",
        "populated_scripts": "",
        "duplicate_keys": ["ISIN"],
        "allowed_merge_duplicate_items": [""],
        "transform_lambda": {
            "1st_Settle_Date": { "datetime": "%Y-%m-%d" },
            "Cpn_Freq": { "static_mapping": { "A": 1, "Q": 4, "S/A": 2 } },
            "Interest_Accrual_Date": { "datetime": "%Y-%m-%d" },
            "Maturity": { "datetime": "%Y-%m-%d" }
        }
    }
}, {
    "query_task": "cfest_bond",
    "shell_details": {
        "pre_scripts": "",
        "post_scripts": "",
        "populated_scripts": "",
        "duplicate_keys": ["Master_Sec_No"],
        "allowed_merge_duplicate_items": [""],
        "transform_lambda": {
            "Accrual_Start": { "datetime": "%Y-%m-%d" },
            "Cpn_Freq": { "static_mapping": { "A": 1, "M": 12, "Q": 4, "S": 2 } },
            "Issue_Date": { "datetime": "%Y-%m-%d" },
            "Market_Id": {
                "static_mapping": {
                "AGBCBJG": "CORP",
                "AGDCBJG": "GOVT",
                "DUGKBND": "GOVT"
                }
            },
            "Sec_Type": {
                "static_mapping": {
                "AGBCBJG": "CNYCORP",
                "AGDCBJG": "CNYGOVT",
                "DUGKBND": "CNYGOVTHY"
                }
            }
        }
    }
}]

for doc in docs:
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

