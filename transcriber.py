import subprocess
import sys
from pathlib import Path

from openai import OpenAI
from dotenv import load_dotenv
import json

SCORING_MODEL = "gpt-4o-mini"
load_dotenv()
client = OpenAI()


def score_language_teaching(transcript):
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
                    "3. Whether there are clear teachable phrases that can be translated into English\n\n"
                    "Return VALID JSON ONLY with this exact structure:\n"
                    "{\n"
                    '  "teaching_score": <integer 1-10>,\n'
                    '  "language_being_taught": "<string>",\n'
                    '  "learner_native_language": "English",\n'
                    '  "detected_languages_in_transcript": ["<language1>", "<language2>"],\n'
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

    # safety: if model returned a JSON string inside JSON, decode again
    if isinstance(result, str):
        result = json.loads(result)

    return result


def convert_mp4_to_mp3(input_mp4, output_mp3):
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

    # optional: keep your bilingual biasing prompt here
    prompt = "Do NOT translate. english and chinese will be in the recording"

    try:
        convert_mp4_to_mp3(input_mp4, output_mp3)
        print(f"Extracted audio: {output_mp3}")

        text = transcribe_mp3(output_mp3, prompt=prompt)
        result = score_language_teaching(text)
        print("\nTranscript:")
        print(text)
        print("Analysis:")
        print(json.dumps(result, ensure_ascii=False, indent=2))

    except subprocess.CalledProcessError:
        print("ffmpeg failed. Make sure ffmpeg is installed and the MP4 file is valid.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
