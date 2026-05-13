import os
from pymongo import MongoClient

# Use environment variable or default to local MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

try:
    # Connect to MongoDB cluster/local
    client = MongoClient(MONGO_URI)
    
    # Create or connect to the database
    db = client["plantdoc_db"]
    
    # Create or connect to the collection (like a table)
    diagnosis_collection = db["diagnosis"]
    
    # Quick test to ensure connection is working
    client.server_info()
    print("✅ Successfully connected to MongoDB!")

except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")