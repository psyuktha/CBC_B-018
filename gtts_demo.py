import argparse
from gtts import gTTS
import os
from langdetect import detect

# Language mappings for gTTS
LANGUAGE_MAP = {
    "en": {"name": "English", "gtts": "en-in"},
    "hi": {"name": "Hindi", "gtts": "hi"},
    "te": {"name": "Telugu", "gtts": "te"},
    "kn": {"name": "Kannada", "gtts": "kn"},
    "bn": {"name": "Bengali", "gtts": "bn"},
    "gu": {"name": "Gujarati", "gtts": "gu"},
    "ml": {"name": "Malayalam", "gtts": "ml"},
    "mr": {"name": "Marathi", "gtts": "mr"},
    "ta": {"name": "Tamil", "gtts": "ta"},
    "ur": {"name": "Urdu", "gtts": "ur"}
}

# Detect language of text
def detect_language(text):
    try:
        lang = detect(text)
        return lang if lang in LANGUAGE_MAP else "en"
    except:
        return "en"

# Convert text to speech
def text_to_speech(text, language=None, output_file="output.mp3"):
    # Detect language if not specified
    lang_code = LANGUAGE_MAP[language]["gtts"] if language in LANGUAGE_MAP else LANGUAGE_MAP[detect_language(text)]["gtts"]
    lang_name = LANGUAGE_MAP.get(language, LANGUAGE_MAP[detect_language(text)])["name"]
    print(f"Converting text to speech in {lang_name}...")
    
    # Create gTTS object
    tts = gTTS(text=text, lang=lang_code)
    
    # Save to file
    tts.save(output_file)
    
    # Play the audio using afplay (macOS)
    print(f"Playing audio: {output_file}")
    os.system(f"afplay {output_file}")

# Main function
def main():
    parser = argparse.ArgumentParser(description="Text-to-Speech Demo with gTTS on macOS")
    parser.add_argument("--text", help="Text to convert to speech")
    parser.add_argument("--language", choices=["en", "hi", "te", "kn"], help="Language code (en, hi, te, kn)")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")
    args = parser.parse_args()
    
    if args.interactive:
        while True:
            text = input("Enter text (or 'quit' to exit): ")
            if text.lower() == "quit":
                break
            lang = input("Enter language (en, hi, te, kn, or leave blank for auto-detect): ") or None
            text_to_speech(text, lang)
    elif args.text:
        text_to_speech(args.text, args.language)
    else:
        print("Error: Provide text or use --interactive mode.")

if __name__ == "__main__":
    main()