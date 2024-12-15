from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import uuid
from elasticsearch import Elasticsearch
import uuid

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Index to store user data
ADMIN_USER_INDEX = "admin_user"


# Helper to create user (for testing, not used in production login)
def process_create_admin_user(bcrypt, data):
    username = data.get('username')
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Index user data in Elasticsearch
    es.index(index=ADMIN_USER_INDEX, body={"username": username, 
                                            "password": hashed_password,
                                            "session_token": str(uuid.uuid4()),
                                            "session_created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                            "session_expired_at": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
                                            })
    return jsonify({"success": True, "message": "User created successfully"})

# Login route
def process_login_admin_user(bcrypt, data):
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "username and password are required"}), 400

    # Search for user in Elasticsearch
    result = es.search(index=ADMIN_USER_INDEX, body={
        "query": {
            "match": {"username": username}
        }
    })

    if not result['hits']['hits']:
        return jsonify({"success": False, "message": "User not found"}), 404

    user = result['hits']['hits'][0]['_source']
    if bcrypt.check_password_hash(user['password'], password):
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
