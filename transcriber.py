import subprocess
import sys
from pathlib import Path

from openai import OpenAI
from dotenv import load_dotenv
import json
import base64
import tempfile

# POC using cheaper models no point for gpt5.4 imo
SCORING_MODEL = "gpt-4o-mini"

load_dotenv()
client = OpenAI()


def score_language_teaching(transcript):
    """
    Scoring the transcription, the prompt here shows what are the metrics used for scoring
    Follows openai prompt engineering cookbook:
    https://developers.openai.com/cookbook
    https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353
    """
    response = client.responses.create(
        model=SCORING_MODEL,
        input=[
            {
                "role": "system",
                "content": (
                    "You are evaluating a SHORT language-learning video transcript.\n\n"
                    "The learner is a native English speaker.\n"
                    "Your job is to determine:\n"
                    "1. What language is being taught\n"
                    "2. Whether the transcript teaches that language effectively\n"
                    "3. Whether there are clear teachable phrases that can be translated into English\n"
                    "4. The learner difficulty level of the transcript\n\n"
                    "Return VALID JSON ONLY with this exact structure:\n"
                    "{\n"
                    '  "teaching_score": <integer 1-10>,\n'
                    '  "language_being_taught": "<string>",\n'
                    '  "learner_native_language": "English",\n'
                    '  "detected_languages_in_transcript": ["<language1>", "<language2>"],\n'
                    '  "transcription_difficulty": "<novice|intermediate|advanced>",\n'
                    '  "is_good_for_learning": <true or false>,\n'
                    '  "translation_quality": "<poor|fair|good|excellent>",\n'
                    '  "reason": "<short explanation>",\n'
                    '  "translations": [\n'
                    "    {\n"
                    '      "phrase": "<phrase from transcript>",\n'
                    '      "language": "<language>",\n'
                    '      "english_translation": "<translation>"\n'
                    "    }\n"
                    "  ],\n"
                    '  "recommendations": ["<rec1>", "<rec2>"]\n'
                    "}\n\n"
                    "Return JSON only. No markdown."
                ),
            },
            {
                "role": "user",
                "content": "Transcript:\n" + transcript,
            },
        ],
    )

    raw = response.output_text.strip()
    result = json.loads(raw)

    if isinstance(result, str):
        result = json.loads(result)

    return result


def extract_frames(video_path, max_frames=6):
    """
    Openai cant handle video, thus using ffmpeg to extract frames from the video
    """
    temp_dir = tempfile.mkdtemp()

    cmd = ["ffmpeg", "-i", video_path, "-vf", "fps=1", f"{temp_dir}/frame_%03d.jpg"]

    subprocess.run(
        cmd,
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    frames = sorted(Path(temp_dir).glob("*.jpg"))

    return frames[:max_frames]


def encode_image(image_path):
    """
    Just b64 no need further explanations
    """
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def convert_mp4_to_mp3(input_mp4, output_mp3):
    """
    To pull out the audio from the provided video
    """
    subprocess.run(
        [
            "ffmpeg",
            "-y",  # overwrite output if it exists
            "-i",
            input_mp4,
            "-vn",  # no video
            "-acodec",
            "libmp3lame",
            "-q:a",
            "2",  # high-quality VBR mp3
            output_mp3,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def transcribe_mp3(mp3_file, prompt=None):
    """
    Using whisper-1 to transcribe the video, found this to be the most accurate compared to gpt-4 when dealing with chinese + english
    """
    load_dotenv()
    client = OpenAI()

    with open(mp3_file, "rb") as audio_file:
        kwargs = {
            "model": "whisper-1",
            "file": audio_file,
            "temperature": 0,
            "response_format": "json",
            "prompt": prompt,
        }

        transcription = client.audio.transcriptions.create(**kwargs)

    return transcription.text


def score_video_quality(video_path):
    """
    Using openai to score the video frames on the metrics shown below under content variable
    """
    frames = extract_frames(video_path)

    content = [
        {
            "type": "input_text",
            "text": (
                "Evaluate the visual quality of this educational video.\n\n"
                "Return STRICT JSON with numeric scores from 1-10.\n\n"
                "Schema:\n"
                "{\n"
                '  "overall_video_score": integer,\n'
                '  "lighting": integer,\n'
                '  "framing": integer,\n'
                '  "camera_stability": integer,\n'
                '  "visual_clarity": integer,\n'
                '  "engagement": integer,\n'
                '  "issues": [string],\n'
                '  "recommendations": [string]\n'
                "}\n\n"
                "All scores must be integers between 1 and 10."
            ),
        }
    ]

    for frame in frames:
        img = encode_image(frame)
        content.append(
            {"type": "input_image", "image_url": f"data:image/jpeg;base64,{img}"}
        )

    response = client.responses.create(
        model="gpt-4o-mini",
        temperature=0,
        input=[{"role": "user", "content": content}],
        text={"format": {"type": "json_object"}},
    )

    # Extract model text safely
    raw = response.output_text

    if not raw:
        for item in response.output:
            if item.type == "message":
                for part in item.content:
                    if part.type == "output_text":
                        raw = part.text
                        break

    if not raw:
        raise RuntimeError("Model returned no text output")

    return json.loads(raw)


def combine_scores(transcript_result, video_result):
    """
    Currently the scoring im using 70% on transcript for learning content
    While remainder 30% is scored using video quality, because a good video doesnt just comprise purely on audio.
    Example a black screen with audio might not be the best for lang learning
    """
    transcript_score = transcript_result["teaching_score"]
    video_score = video_result["overall_video_score"]

    overall = round((transcript_score * 0.7) + (video_score * 0.3), 2)

    merged_recommendations = list(
        set(
            transcript_result.get("recommendations", [])
            + video_result.get("recommendations", [])
        )
    )

    return {
        "overall_score": overall,
        "learning_score": transcript_score,
        "video_score": video_score,
        "difficulty": transcript_result["transcription_difficulty"],
        "language": transcript_result["language_being_taught"],
        "good_for_learning": transcript_result["is_good_for_learning"],
        "recommendations": merged_recommendations[:5],
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 transcribe_video.py input.mp4")
        sys.exit(1)

    input_mp4 = sys.argv[1]
    input_path = Path(input_mp4)

    if not input_path.exists():
        print(f"File not found: {input_mp4}")
        sys.exit(1)

    output_mp3 = str(input_path.with_suffix(".mp3"))
    # english and chinese will be in the recording <- add this prompt if model suffers in accuracy we will narrow down the lang
    # Certain audio might not be that great in whisper-1 detection
    prompt = "Do NOT translate."

    try:
        convert_mp4_to_mp3(input_mp4, output_mp3)
        print(f"Extracted audio: {output_mp3}")

        text = transcribe_mp3(output_mp3, prompt=prompt)
        transcript_analysis = score_language_teaching(text)
        video_quality = score_video_quality(input_mp4)

        combined = combine_scores(transcript_analysis, video_quality)

        print("\nTranscript:")
        print(text)

        print("\nFinal Analysis:")
        print(json.dumps(combined, ensure_ascii=False, indent=2))
    # Download ffmpeg in my mac, server hosting this will be a unix system and we can easily install this.
    except subprocess.CalledProcessError:
        print("ffmpeg failed. Make sure ffmpeg is installed and the MP4 file is valid.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
