from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import gridfs

app = Flask(__name__)
CORS(app)

# Connect to MongoDB using pymongo
mongo_uri = (
    "mongodb+srv://pranaynandkeolyar:"
    "boilermake@boilermake.7cwex.mongodb."
    "net/?retryWrites=true&w=majority&appName=Boilermake"
)

client = MongoClient(mongo_uri)
db = client["users"]
collection = db["users"]
fs = gridfs.GridFS(db)  # GridFS for storing files



@app.route('/grade', methods=['POST'])
def grade():
    if 'video' not in request.files or 'question' not in request.form:
        return jsonify({"error": "Missing video or question"}), 400

    video = request.files['video']
    question = request.form['question']

    print("Received video:", video.filename)
    print("Question:", question)

    # Save video if needed
    video.save("received_video.webm")

    # Mock grade response
    return jsonify({"grade": "A+"})


@app.route("/login", methods=["POST"])
def login_handler():
    try:
        data = request.get_json()
        email = data.get("username")
        password = data.get("password")

        print("LOGIN:", email, password)

        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        user = collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "Incorrect username. User does not exist"}), 401

        if user["password"] != password:
            return jsonify({"message": "Incorrect password."}), 401

        # Convert ObjectId to string and ensure resume_id exists
        user["_id"] = str(user["_id"])
        user["resume_id"] = str(user.get("resume_id", ""))  # Default to empty if not present

        return jsonify(user), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal server error."}), 500


@app.route("/signup", methods=["POST"])
def signup_handler():

    try:
        email = request.form.get("username")
        password = request.form.get("password")
        resume = request.files.get("file")

        print(
            "SIGNUP:",
            f"Email={email}",
            f"Password={'*' * len(password) if password else ''}",
            f"Resume={resume.filename if resume else 'NO FILE'}",
        )

        if not email or not password or not resume:
            return jsonify({"message": "Username, password, and resume are required."}), 400

        existing_user = collection.find_one({"email": email})
        if existing_user:
            # If user exists but doesn't have a resume, update them
            if "resume_id" not in existing_user:
                resume_id = fs.put(resume, filename=resume.filename, content_type=resume.content_type)
                collection.update_one(
                    {"email": email},
                    {"$set": {"resume_id": resume_id}}
                )
                return jsonify({"message": "Resume uploaded successfully for existing user.", "resume_id": str(resume_id)}), 200
            return jsonify({"message": "User already exists."}), 409

        # Store resume in GridFS
        resume_id = fs.put(resume, filename=resume.filename, content_type=resume.content_type)

        # Insert new user record
        new_user = {
            "email": email,
            "password": password,
            "resume_id": resume_id,
        }
        insert_result = collection.insert_one(new_user)
        if not insert_result.acknowledged:
            return jsonify({"message": "User creation failed."}), 500

        return jsonify(
            {
                "id": str(insert_result.inserted_id),
                "email": email,
                "resume_id": str(resume_id),
            }
        ), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": f"Internal Server Error: {e}"}), 500


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print("❌ MongoDB connection error:", e)

    app.run(debug=True)
