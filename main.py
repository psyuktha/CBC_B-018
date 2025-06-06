from fastapi import FastAPI
from fastapi import FastAPI, UploadFile, File, Form
from google.generativeai import GenerativeModel, configure
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv
import os
import argparse
from gtts import gTTS
import os
from langdetect import detect
from fastapi.responses import FileResponse
import json
import pandas as pd

load_dotenv()

app = FastAPI()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model=genai.GenerativeModel('gemini-2.0-flash')
chat = model.start_chat(history=[])

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.post("/chat")
async def govt_scheme(file: UploadFile = File(...),user_profile_json: str = Form(...)):
    print("came")
    try:
        user_profile = json.loads(user_profile_json)
    except json.JSONDecodeError as e:
        return {"error": "Invalid user profile JSON", "details": str(e)}
    file_path = f"temp_{file.filename}"
    
    with open(file_path, "wb") as f:
        f.write(await file.read())

    print(f"File saved at: {file_path}")
    
    text = stt(file_path)
    print(f"Transcript: {text}")
    
    reply = llmcall(text,user_profile)
    print(f"LLM Response: {reply}")
    
    tts = text_to_speech(reply, language=detect_language(reply), output_file="response.mp3")

    return FileResponse("response.mp3", media_type="audio/mpeg", filename="response.mp3")
def stt(file):
    
    myfile = genai.upload_file(path=file)
    prompt = 'Generate a transcript of the speech.'
    response = model.generate_content([prompt, myfile])
    return response.text

def llmcall(question,user_profile):
    """Create and return a chat instance with context."""
    context = ""
    # base_path = Path("state")
    
    # states = ["andhra-pradesh", "karnataka", "kerala", "tamilnadu", "telangana", "central"]
    
    # for state in states:
    #     combined_file = base_path / f"{state}_combined.txt"
    #     if combined_file.exists():
    #         with open(combined_file, 'r', encoding='utf-8') as f:
    #             context += f"\n\n=== {state.upper()} SCHEMES ===\n"
    #             context += f.read()
    # print(context)
    # output_file = Path("state") / "all_states_combined.txt"
    # with open(output_file, 'w', encoding='utf-8') as out_f:
    #     out_f.write(context)
    with open("context.txt",'r',encoding='utf-8') as f:
        context+=f.read()
    
    df=pd.read_csv("market_price.csv")
    data_list = df.to_dict('records')
    market = str(data_list)
    
    
    system_prompt = f"""You are a helpful assistant that provides information about various government schemes, market prices and digital literacy from different states in India. 
    Use the following context and your knowledge to answer questions about these schemes. Provide a very clean output without any special characters. Also give relevant information according to the user profile. Refer to marker prices of different commodities in different regions in this file {market}
    User Profile:
    {user_profile}
    Context:
    {context}
    """
    
    chat.send_message(system_prompt)
    response = chat.send_message(question)
    return response.text

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

def detect_language(text):
    try:
        lang = detect(text)
        return lang if lang in LANGUAGE_MAP else "en"
    except:
        return "en"

def text_to_speech(text, language=None, output_file="output2.mp3"):
    lang_code = LANGUAGE_MAP[language]["gtts"] if language in LANGUAGE_MAP else LANGUAGE_MAP[detect_language(text)]["gtts"]
    lang_name = LANGUAGE_MAP.get(language, LANGUAGE_MAP[detect_language(text)])["name"]
    print(f"Converting text to speech in {lang_name}...")
    
    tts = gTTS(text=text, lang=lang_code)
    
    tts.save(output_file)
    print('saved')
    
    # return tts

