video_filename = "/Users/anish/Downloads/IMG_1296.MOV"
transcript_filename = "./IMG_1296.txt"



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
    # os.remove(video_filename)
    # os.remove(transcript_filename)

    # For now, simply return the transcript. Later, you can pass it to your grading model.
    # return jsonify({"transcript": transcript_text})

except Exception as e:
    print("Error processing video:", e)
    # return jsonify({"error": "Failed to process video"}), 500