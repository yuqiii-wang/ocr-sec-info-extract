#!/bin/bash

# Define the path to your Elasticsearch installation directory.
ELASTICSEARCH_HOME="./elasticsearch"

# Define the path to your Kibana installation directory.
KIBANA_HOME="./kibana"

# Check if Elasticsearch is already running.
if pgrep -x "java" -f "${ELASTICSEARCH_HOME}/lib/elasticsearch" > /dev/null
then
    echo "Elasticsearch is already running."
else
    # Start Elasticsearch in the background.
    echo "Starting Elasticsearch..."
    nohup ${ELASTICSEARCH_HOME}/bin/elasticsearch -d &
    
    # Wait for Elasticsearch to start up.
    sleep 10
    
    # Check if Elasticsearch started successfully.
    if pgrep -x "java" -f "${ELASTICSEARCH_HOME}/lib/elasticsearch" > /dev/null
    then
        echo "Elasticsearch has been started."
    else
        echo "Failed to start Elasticsearch."
        exit 1
    fi
fi

sleep 30

# Check if Kibana is already running.
if pgrep -x "node" -f "${KIBANA_HOME}/node_modules" > /dev/null
then
    echo "Kibana is already running."
else
    # Start Kibana in the background.
    echo "Starting Kibana..."
    nohup ${KIBANA_HOME}/bin/kibana -c ${KIBANA_HOME}/config/kibana.yml &
    
    # Wait for Kibana to start up.
    sleep 10
    
    # Check if Kibana started successfully.
    if pgrep -x "node" -f "${KIBANA_HOME}/node_modules" > /dev/null
    then
        echo "Kibana has been started."
    else
        echo "Failed to start Kibana."
        exit 1
    fi
fi
