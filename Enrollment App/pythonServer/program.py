from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from moviepy.editor import VideoFileClip
import requests
import zipfile
import random

app = Flask(__name__)
CORS(app)

# Define the paths for the upload and converted folders
UPLOAD_AUDIOS = "/tmp/audios"
UPLOAD_FOLDER = "/tmp/uploads"
CONVERTED_FOLDER = "/tmp/converted"
ZIP_FOLDER = "/tmp/zipped_screenshots"

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
os.makedirs(ZIP_FOLDER, exist_ok=True)

# Flask API URL where the zip file will be sent
FLASK_API_URL = "http://202.142.147.3:6001/upload_zip"
FLASK_API_URL2 = "http://202.142.147.3:5003/uploaddd"


@app.route("/convert", methods=["POST"])
def convert_videos_to_audio_and_zip():
    # Check if the files are present in the request
    if "files" not in request.files:
        return jsonify(error="No files part"), 400

    files = request.files.getlist("files")
    converted_files = []

    for file in files:
        try:
            # Save the uploaded video file to the UPLOAD_FOLDER
            video_filename = file.filename
            video_path = os.path.join(UPLOAD_AUDIOS, video_filename)
            file.save(video_path)

            # Define the output audio file path in the CONVERTED_FOLDER
            output_filename = f"{os.path.splitext(video_filename)[0]}.wav"
            output_path = os.path.join(CONVERTED_FOLDER, output_filename)

            # Convert video to audio
            video = VideoFileClip(video_path)
            video.audio.write_audiofile(
                output_path,
                codec="pcm_s16le",  # PCM signed 16-bit little-endian
                ffmpeg_params=["-ac", "1", "-ar", "16000"],  # mono audio, 16 kHz
            )
            video.close()

            # Append the name and path of the converted file to the list
            converted_files.append(output_path)

        except Exception as e:
            print(f"Error processing file {file.filename}: {e}")
            return (
                jsonify(error=f"Error processing file {file.filename}: {str(e)}"),
                500,
            )

    # Create a zip file containing all converted audio files
    zip_filename = "converted_audios.zip"
    zip_path = os.path.join(ZIP_FOLDER, zip_filename)
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for audio_file in converted_files:
            zipf.write(audio_file, os.path.basename(audio_file))

    # Send the zip file to the Flask API
    try:
        with open(zip_path, "rb") as zip_file:
            files = {"file": zip_file}
            response = requests.post(FLASK_API_URL, files=files)
            response.raise_for_status()  # Raise an error if the request failed
    except Exception as e:
        print(f"Error uploading zip file: {e}")
        return jsonify(error=f"Error uploading zip file: {str(e)}"), 500

    # Clean up: Remove uploaded videos and converted audios
    for file_path in converted_files:
        if os.path.exists(file_path):
            os.remove(file_path)
    for file in files:
        video_path = os.path.join(UPLOAD_FOLDER, file.filename)
        if os.path.exists(video_path):
            os.remove(video_path)

    return jsonify(
        {"message": "All files processed, zipped, and uploaded successfully"}
    )

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
        screenshots = extract_images_from_video(video_path, UPLOAD_FOLDER)
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
