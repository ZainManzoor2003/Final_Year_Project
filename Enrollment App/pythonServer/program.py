from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from moviepy.editor import VideoFileClip
import requests
import json
import cv2
import os
import random
import os
import zipfile


app = Flask(__name__)
CORS(app)

# Define the paths for the upload and converted folders
UPLOAD_FOLDER = "/tmp/uploads"
CONVERTED_FOLDER = "/tmp/converted"
OUTPUT_FOLDER = "/tmp/screenshots"
ZIP_FOLDER = "/tmp/zipped_screenshots"

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(ZIP_FOLDER, exist_ok=True)


# Flask API URL where the .wav file will be sent
FLASK_API_URL = "https://6edc-202-142-147-154.ngrok-free.app/upload_wav"
FLASK_API_URL2 = "https://fac3-111-68-102-25.ngrok-free.app/upload"


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
                requests.post(FLASK_API_URL, files=files)
                # print(response.content)
                # # print('reponse',response.content)
                # # Decode the response content to a UTF-8 string
                # response_str = response.content.decode("utf-8")

                # Parse the JSON
                # response_json = json.loads(response_str)

                # # Get the Urdu text from the 'text' key in the JSON
                # urdu_text = response_json["text"]

                # Print the decoded Urdu text
                # print(urdu_text)
                # # response.raise_for_status()
                # print(f"Uploaded {output_filename} to API successfully.")
                return jsonify({"message": "Uploaded Successfully For Training"})

        except Exception as e:
            print(e)
            return jsonify(error=str(e)), 500

    # Return the names and URIs of all converted files
    # return jsonify({"id":response.content})


def extract_images_from_video(video_path, output_folder, num_images=4):
    """Extracts `num_images` screenshots from the video at random intervals."""
    video = VideoFileClip(video_path)
    duration = video.duration
    images = []

    # Generate random timestamps to extract images
    timestamps = sorted(random.sample(range(1, int(duration)), num_images))

    for timestamp in timestamps:
        frame = video.get_frame(timestamp)
        image_path = os.path.join(
            output_folder,
            f"{os.path.splitext(os.path.basename(video_path))[0]}_{timestamp}.png",
        )
        video.save_frame(image_path, t=timestamp)
        images.append(image_path)

    video.close()
    return images


def create_zip_of_images(image_paths, zip_path):
    """Creates a zip file from the list of image paths."""
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for image_path in image_paths:
            zipf.write(image_path, os.path.basename(image_path))


@app.route("/extract_images", methods=["POST"])
def extract_images_from_videos():
    """Endpoint to process multiple video files and send a zip of images to another API."""
    files = request.files.getlist(
        "videos"
    )  # Assume the request contains multiple video files
    if not files:
        return jsonify(error="No video files provided"), 400

    all_screenshots = []

    # Process each video file
    for video_file in files:
        video_filename = video_file.filename
        video_path = os.path.join(UPLOAD_FOLDER, video_filename)
        video_file.save(video_path)

        # Extract images from the video
        screenshots = extract_images_from_video(video_path, OUTPUT_FOLDER)
        all_screenshots.extend(screenshots)

    # Create a zip file of all the screenshots
    zip_filename = "screenshots.zip"
    zip_path = os.path.join(ZIP_FOLDER, zip_filename)
    create_zip_of_images(all_screenshots, zip_path)

    # Send the zip file to another Flask API
    with open(zip_path, "rb") as zip_file:
        files = {"file": zip_file}
        requests.post(FLASK_API_URL2, files=files)

    # if response.status_code == 200:
    #     return jsonify(message="Zip file sent successfully!")
    # else:
    #     return jsonify(error="Failed to send zip file to another API"), 500
    return jsonify(message="send")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
