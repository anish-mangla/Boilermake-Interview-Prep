
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import gridfs
import os
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# ✅ Connect to MongoDB
mongo_uri = (
    "mongodb+srv://pranaynandkeolyar:"
    "boilermake@boilermake.7cwex.mongodb."
    "net/?retryWrites=true&w=majority&appName=Boilermake"
)

client = MongoClient(mongo_uri)
db = client["users"]
collection = db["users"]
fs = gridfs.GridFS(db)  # ✅ GridFS for storing resumes

# ✅ Fetch Resume and Extract Text
@app.route("/resume", methods=["POST"])
def get_resume():
    try:
        data = request.get_json()
        user_id = data.get("userId")

        print(f"🔹 Fetching resume for userId: {user_id}")

        if not user_id:
            return jsonify({"message": "User ID is required."}), 400

        # Find user and check for resume
        user = collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"message": "User not found."}), 404

        if "resume_id" not in user:
            return jsonify({"message": "No resume found for this user."}), 404
        print("Have resume")
        # Retrieve resume from GridFS
        resume_file = fs.get(user["resume_id"])
        pdf_data = resume_file.read()

        # ✅ Extract text from PDF
        doc = fitz.open(stream=pdf_data, filetype="pdf")
        resume_text = "\n".join([page.get_text() for page in doc])

        print(f"✅ Extracted resume text for user: {user_id}")

        return jsonify({
            "resume_text": resume_text,
            "user": {
                "email": user["email"]
            },
            "filename": resume_file.filename
        }), 200

    except Exception as e:
        print(f"❌ ERROR extracting resume: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/grade-mult', methods=['POST'])
def grade_mult():
    videos = [request.files[f'videos[{i}]'] for i in range(5)]  # Accessing files[0], files[1], etc.
    questions = [request.form[f'questions[{i}]'] for i in range(5)]  # Accessing questions[0], questions[1], etc.
    print(videos)
    print(questions)
    # Ensure the 'uploads' directory exists
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
    if len(videos) != len(questions):
        return jsonify({"error": "Mismatch between number of videos and questions"}), 400

    grades = []
    for video, question in zip(videos, questions):
        print("Received video:", video.filename)
        print("Question:", question)

        # Save video if needed
        video_path = os.path.join("uploads", video.filename)
        video.save(video_path)

        # Call Whisper (or another service) to get text from the video
        # call_whisper(video_path)  # Implement your logic here
        
        # Call Abhi (or another service) to grade based on the video and question
        # grade = call_abhi(question, video_path)  # Implement your logic here

        # Mock grade response
        grades.append({"question": question, "grade": "A+"})

    return jsonify({"grades": grades})    



@app.route('/grade', methods=['POST'])
def grade():
    videos = request.files.getlist('videos[]')

    question = request.form['question']

    # print("Received video:", video.filename)
    # print("Question:", question)

    # Define filenames for saving the video and transcript
    video_filename = "received_video.webm"
    transcript_filename = "received_video.txt"

    # Save the uploaded video locally
    video.save(video_filename)

    try:
        import subprocess
        import os

        # Run the whisper command on the saved video.
        # This assumes that calling `whisper received_video.webm --output_format txt`
        # will generate a transcript file named "received_video.txt" in the same directory.
        result = subprocess.run(
            ["whisper", video_filename, "--output_format", "txt"],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            raise Exception(f"Whisper error: {result.stderr}")

        # Read the transcript from the generated file
        if not os.path.exists(transcript_filename):
            raise Exception("Transcript file not found.")

        with open(transcript_filename, "r", encoding="utf-8") as f:
            transcript_text = f.read()

        print("Transcript:", transcript_text)

        # Optional: Remove the temporary video and transcript files
        os.remove(video_filename)
        os.remove(transcript_filename)

        # For now, simply return the transcript. Later, you can pass it to your grading model.
        return jsonify({"transcript": transcript_text})

    except Exception as e:
        print("Error processing video:", e)
        return jsonify({"error": "Failed to process video"}), 500


# ✅ Login Route
@app.route("/login", methods=["POST"])
def login_handler():
    try:
        data = request.get_json()
        email = data.get("username")
        password = data.get("password")

        print("\n🔹 LOGIN REQUEST RECEIVED")
        print(f"🔸 Email: {email}, Password: {'*' * len(password) if password else ''}")

        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        user = collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "Incorrect username. User does not exist"}), 401

        if user["password"] != password:
            return jsonify({"message": "Incorrect password."}), 401

        user["_id"] = str(user["_id"])
        user["resume_id"] = str(user.get("resume_id", ""))

        return jsonify(user), 200

    except Exception as e:
        print(f"❌ LOGIN ERROR: {e}")
        return jsonify({"message": "Internal server error."}), 500


# ✅ Signup Route (Requires Resume Upload)
@app.route("/signup", methods=["POST"])
def signup_handler():
    try:
        email = request.form.get("username")
        password = request.form.get("password")
        resume = request.files.get("file")

        print("\n🔹 SIGNUP REQUEST RECEIVED")
        print(f"🔸 Email: {email}, Password: {'*' * len(password) if password else ''}, Resume: {resume.filename if resume else 'NO FILE'}")

        if not email or not password or not resume:
            return jsonify({"message": "Username, password, and resume are required."}), 400

        if resume.content_type != "application/pdf":
            return jsonify({"message": "Only PDF files are allowed."}), 400

        existing_user = collection.find_one({"email": email})
        if existing_user:
            if "resume_id" not in existing_user:
                resume_id = fs.put(resume, filename=resume.filename, content_type="application/pdf")
                collection.update_one(
                    {"email": email},
                    {"$set": {"resume_id": resume_id}}
                )
                return jsonify({"message": "Resume uploaded successfully for existing user.", "resume_id": str(resume_id)}), 200
            return jsonify({"message": "User already exists."}), 409

        resume_id = fs.put(resume, filename=resume.filename, content_type="application/pdf")

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
        print(f"❌ SIGNUP ERROR: {e}")
        return jsonify({"message": f"Internal Server Error: {e}"}), 500


# ✅ Resume Update Route (Requires Logged-In User)
@app.route("/upload-resume", methods=["POST"])
def update_resume():
    try:
        email = request.form.get("email")  # ✅ Get user email from frontend
        new_resume = request.files.get("file")  # ✅ Get the uploaded resume

        print("\n🔹 RESUME UPDATE REQUEST RECEIVED")
        print(f"🔸 Email: {email}, Resume: {new_resume.filename if new_resume else 'NO FILE'}")

        if not email or not new_resume:
            return jsonify({"message": "Email and resume are required."}), 400

        if new_resume.content_type != "application/pdf":
            return jsonify({"message": "Only PDF files are allowed."}), 400

        user = collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "User not found."}), 404

        # ✅ Remove old resume if it exists
        if "resume_id" in user:
            old_resume_id = user["resume_id"]
            try:
                fs.delete(old_resume_id)  # ✅ Delete old resume from GridFS
                print("✅ Old resume deleted successfully.")
            except Exception as e:
                print(f"⚠️ Failed to delete old resume: {e}")

        # ✅ Store new resume in GridFS
        new_resume_id = fs.put(new_resume, filename=new_resume.filename, content_type="application/pdf")

        # ✅ Update the user record with the new resume ID
        collection.update_one({"email": email}, {"$set": {"resume_id": new_resume_id}})

        print(f"✅ New resume uploaded successfully: {new_resume_id}")

        return jsonify({"message": "Resume updated successfully.", "resume_id": str(new_resume_id)}), 200

    except Exception as e:
        print(f"❌ RESUME UPLOAD ERROR: {e}")
        return jsonify({"message": f"Internal Server Error: {e}"}), 500


# ✅ Health Check Route (Optional, for debugging)
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"message": "Server is running!", "status": "healthy"}), 200


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print("❌ MongoDB connection error:", e)

    app.run(debug=True)