from google.generativeai import GenerativeModel, configure
import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyAZ_w7pLdfI0gvkGI8ytBttm9jN-GNmYrg")

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
