from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

INDEX_NAME="ner"

# Define the index settings and mappings
index_ner_settings = {
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
                "ignore_above": 100  # Restrict field to 100 characters
            },
            "ners": {
                "type": "nested"
            }
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index=INDEX_NAME):
    response = es.indices.create(index=INDEX_NAME, body=index_ner_settings)
    print("Index created:", response)
else:
    print("Index ner already exists!")
    exit()


######## Set up query task handling
docs = [{
    "query_task": "bbg_bond",
    "ners": {
        "Cpn_Freq": {
            "full_regex": "Cpn Freq[ ]*[\\w\\/]+",
            "key_regex": "Cpn Freq",
            "val_regex": "[\\w\\/]+"
        },
        "ISIN": {
            "full_regex": "ISIN[ ]*[A-Z0-9]{12}",
            "key_regex": "ISIN",
            "val_regex": "[A-Z0-9]{12}"
        },
        "Currency": {
            "full_regex": "Currency[ ]*[A-Z]{3}",
            "key_regex": "Currency",
            "val_regex": "[A-Z]{3}"
        },
        "Country": {
            "key_regex": "Country",
            "full_regex": "Country[ ]*[\\w ]+",
            "val_regex": "[A-Z]+"
        },
        "Moody's": {
            "full_regex": "Moody's[ ]*[\\w\\+\\-]+",
            "key_regex": "Moody's",
            "val_regex": "[\\w\\+\\-]+"
        },
        "S&P": {
            "full_regex": "S&P[ ]*[\\w\\+\\-]+",
            "key_regex": "S&P",
            "val_regex": "[\\w\\+\\-]+"
        },
        "Fitch": {
            "full_regex": "Fitch[ ]*[\\w\\+\\-]+",
            "key_regex": "Fitch",
            "val_regex": "[\\w\\+\\-]+"
        },
        "Coupon": {
            "full_regex": "Coupon[^s][ ]*[fF\\d\\.]+",
            "key_regex": "Coupon",
            "val_regex": "[fF\\d\\.]+"
        },
        "Day_Cnt": {
            "full_regex": "Day Cnt[; ]*[\\w\\/]+",
            "key_regex": "Day Cnt",
            "val_regex": "[\\w\\/]+"
        },
        "Interest_Accrual_Date": {
            "full_regex": "Interest Accrual Date[ ]*[\\w\\/]+",
            "key_regex": "Interest Accrual Date",
            "val_regex": "[\\w\\/]+"
        },
        "1st_Settle_Date": {
            "full_regex": "1st Settle Date[ ]*[\\w\\/]+",
            "key_regex": "1st Settle Date",
            "val_regex": "[\\w\\/]+"
        },
        "ticker": {
            "full_regex": "[A-Z]{1,8} [\\d \\/]+[\\d\\/\\-]+ ",
            "key_regex": "",
            "val_regex": "[A-Z]{1,8} [\\d \\/]+[\\d\\/\\-]+"
        },
        "Maturity": {
            "full_regex": "Maturity[ ]*[\\d]{2}\\/[\\d]{2}\\/[\\d]{4}",
            "key_regex": "Maturity",
            "val_regex": "[\\d]{2}\\/[\\d]{2}\\/[\\d]{4}"
        }
    }
}, {
    "query_task": "bbg_mbs",
    "ners": {
        "Currency": {
            "key_regex": "Currency",
            "full_regex": "Currency[ ]*[A-Z]{3}",
            "val_regex": "[A-Z]{3}"
        }
    }
}, {
    "query_task": "cfest_bond",
    "ners": {
        "Master_Sec_No": {
        "full_regex": "Sec Master No[\\.]?[ ]*[\\w]+",
        "key_regex": "Sec Master No",
        "val_regex": "[\\w]+"
        },
        "Currency": {
        "key_regex": "Currency",
        "full_regex": "Currency[ ]*[A-Z]{3}",
        "val_regex": "[A-Z]{3}"
        },
        "Ticker": {
        "full_regex": "Description[ ]+[\\w\\-\\.]+",
        "key_regex": "Description",
        "val_regex": "[\\w\\-\\.]+"
        },
        "Issuer": {
        "full_regex": "Issuer[ ]+[A-Z]+",
        "key_regex": "Issuer",
        "val_regex": "[A-Z]+"
        },
        "Coupon_Rate": {
        "full_regex": "Coupon[ ]?Rate[ ]*[\\d\\.]+",
        "key_regex": "Coupon[ ]?Rate",
        "val_regex": "[\\d\\.]+"
        },
        "Issue_Date": {
        "full_regex": "Issue[ ]?Dt[ ]*[\\dA-Z]+",
        "key_regex": "Issue[ ]?Dt",
        "val_regex": "[\\dA-Z]+"
        },
        "Maturity": {
        "full_regex": "Maturity[ ]?Issue[ ]?Dt[ ]*[0-9]{2}[A-Z]{3}[0-9]{4}",
        "key_regex": "Maturity[ ]?Issue[ ]?Dt",
        "val_regex": "[0-9]{2}[A-Z]{3}[0-9]{4}"
        },
        "Periodicity": {
        "full_regex": "Periodicity[ ]*[A-Z]{1}",
        "key_regex": "Periodicity",
        "val_regex": "[A-Z]{1}"
        },
        "Accrual_Start": {
        "full_regex": "Accural[ ]?Start[ ]*[\\d\\w]+",
        "key_regex": "Accural[ ]?Start",
        "val_regex": "[\\w]+"
        },
        "Sub_Sec_Type": {
        "full_regex": "(CGAPBJG)|(SCHOSHG)",
        "key_regex": "",
        "val_regex": "[\\w]+"
        },
        "Sec_Type": {
        "full_regex": "Issuer[ ]+[A-Z]+",
        "key_regex": "Issuer",
        "val_regex": "[A-Z]+"
        },
        "Market_Id": {
        "full_regex": "Issuer[ ]+[A-Z]+",
        "key_regex": "Issuer",
        "val_regex": "[A-Z]+"
        }
    }
}]

for doc in docs:
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

