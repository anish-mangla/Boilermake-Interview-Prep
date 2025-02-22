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
db = client['users']
collection = db["users"]



@app.route('/login', methods=['POST'])
def login_handler():
    try:
        # Extract email and password from the request
        data = request.get_json()
        email = data.get('username')
        password = data.get('password')
        print(email)
        print(password)
        # Validate input
        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        # Find user in the database
        user = collection.find_one({"email": email})

        if not user:
            return jsonify({"message": "Incorrect username. User does not exist"}), 401
        # Check password
        if user["password"] != password:
            return jsonify({"message": "Incorrect password."}), 401

        # Successful login
        user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON serialization
        return jsonify(user), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal server error."}), 500


@app.route('/signup', methods=['POST'])
def signup_handler():
    try:
        # Parse request data
        data = request.json
        email = data.get('username')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        # Check if user already exists
        existing_user = collection.find_one({"email": email})
        if existing_user:
            return jsonify({"message": "User already exists."}), 409

        # Insert new user
        new_user = {"email": email, "password": password}
        insert_result = collection.insert_one(new_user)

        if not insert_result.acknowledged:
            return jsonify({"message": "User creation failed."}), 500

        # Fetch and return the new user
        user = collection.find_one({"_id": insert_result.inserted_id})
        if not user:
            return jsonify({"message": "Error retrieving user."}), 500

        # Success - Return created user
        return jsonify({
            "id": str(user["_id"]),
            "email": user["email"]
        }), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal Server Error."}), 500



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
