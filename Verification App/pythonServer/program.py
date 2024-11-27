from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from moviepy.editor import VideoFileClip
import requests
import json

app = Flask(__name__)
CORS(app)

# Define the paths for the upload and converted folders
UPLOAD_FOLDER = "/tmp/uploads"
CONVERTED_FOLDER = "/tmp/converted"

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

# Flask API URL where the .wav file will be sent
FLASK_API_URL = "https://0905-202-142-147-154.ngrok-free.app/upload"


@app.route("/convert", methods=["POST"])
def convert_videos_to_audio():
    # Check if the files are present in the request
    if "files" not in request.files:
        return jsonify(error="No files part"), 400

    files = request.files.getlist("files")
    converted_files = []

    for file in files:
        try:
            # Save the uploaded video file to the UPLOAD_FOLDER
            video_filename = file.filename
            video_path = os.path.join(UPLOAD_FOLDER, video_filename)
            file.save(video_path)

            # Define the output audio file path in the CONVERTED_FOLDER
            output_filename = f"{os.path.splitext(video_filename)[0]}.wav"
            output_path = os.path.join(CONVERTED_FOLDER, output_filename)

            # Convert video to audio
            video = VideoFileClip(video_path)
            video.audio.write_audiofile(
                output_path,
                codec="pcm_s16le",  # PCM signed 16-bit little-endian
                ffmpeg_params=[
                    "-ac",
                    "1",
                    "-ar",
                    "16000",
                ],  # mono audio, 16 kHz sampling rate
            )
            video.close()
            # Clean up the video file if needed
            # os.remove(video_path)

            # Append the name and URI of the converted file to the list
            converted_files.append({"name": output_filename, "uri": output_path})

            # Automatically upload the .wav file to the Flask API
            with open(output_path, "rb") as wav_file:
                files = {"file": wav_file}
                response = requests.post(FLASK_API_URL, files=files)
                print(response.content)
                # print('reponse',response.content)
                # Decode the response content to a UTF-8 string
                response_str = response.content.decode("utf-8")

                # Parse the JSON
                response_json = json.loads(response_str)

                # Get the Urdu text from the 'text' key in the JSON
                urdu_text = response_json["text"]

                # Print the decoded Urdu text
                print(urdu_text)
                # response.raise_for_status()
                print(f"Uploaded {output_filename} to API successfully.")
                return jsonify({"id": response_json["Speaker_ID"]})

        except Exception as e:
            return jsonify(error=str(e)), 500

    # Return the names and URIs of all converted files
    # return jsonify({"id":response.content})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
