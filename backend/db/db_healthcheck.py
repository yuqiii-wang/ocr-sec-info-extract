import requests
import time
from threading import Lock
from elasticsearch import Elasticsearch


# Elasticsearch health check URL
ELASTICSEARCH_HEALTH_URL = "http://localhost:9200/_cluster/health"
es_health_status = {"status": "unknown", "error": None}

es = Elasticsearch("http://localhost:9200")

es_health_status_lock = Lock()

def elasticsearch_health_check():
    """Function to continuously check the health of Elasticsearch."""
    global es_health_status
    while True:
        try:
            response = requests.get(ELASTICSEARCH_HEALTH_URL, timeout=5)
            with es_health_status_lock:  # Lock access to health_status
                if response.status_code == 200:
                    status:str = response.json().get("status", "unknown")
                    es_health_status["status"] = "green" if status == "green" or status == "yellow" else status
                    es_health_status["error"] = None
                else:
                    es_health_status["status"] = "unhealthy"
                    es_health_status["error"] = f"HTTP {response.status_code}: {response.text}"
        except requests.RequestException as e:
            with es_health_status_lock:  # Lock access to health_status
                es_health_status["status"] = "unhealthy"
                es_health_status["error"] = "Connection Refused."

        time.sleep(10)  # Check every 10 seconds

# update uuid for data samples if found same uuid and in-sample seq id
def elasticsearch_cleanse_uuid():
    pass