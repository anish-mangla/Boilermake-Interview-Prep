from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Connect to MongoDB using pymongo
mongo_uri = "mongodb+srv://pranaynandkeolyar:boilermake@boilermake.7cwex.mongodb.net/?retryWrites=true&w=majority&appName=Boilermake"

client = MongoClient(mongo_uri)
print(client)
db = client['users']

@app.route('/add_member', methods=["GET", "POST"])  # Ensure POST is allowed
def add_member():
    # Get the JSON data from the request
    data = request.get_json()
    print(data)
    # Make sure the data includes a 'name' field
    if 'name' not in data:
        return jsonify(message="Error: 'name' is required"), 400

    # Insert the new member into the 'members' collection
    members_collection = db.members
    member = {"name": data["name"]}
    members_collection.insert_one(member)
    member["_id"] = str(member["_id"])  # Convert ObjectId to string
    return jsonify(message="Member added successfully!", member=member), 201

# Fetch members from MongoDB
@app.route("/members")
def members():
    members_collection = db.members
    members = [member["name"] for member in members_collection.find()]
    return jsonify({"members": members})

if __name__ == "__main__":
    try:
        client.admin.command('ping')  # Check MongoDB connection
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print("❌ MongoDB connection error:", e)

    app.run(debug=True)
