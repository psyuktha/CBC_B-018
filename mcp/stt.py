from google.generativeai import GenerativeModel, configure
import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv
# Configure the API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Upload the file
myfile = genai.upload_file(path="output.mp3")

# Create the model instance
model = genai.GenerativeModel("gemini-2.0-flash")

# Prompt
prompt = 'Generate a transcript of the speech.'

# Generate content
response = model.generate_content([prompt, myfile])

# Print the transcript
print(response.text)
