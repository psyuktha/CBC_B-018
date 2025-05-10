import os
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv
from mcp.gtts_demo import detect_language, text_to_speech


# Load environment variables
load_dotenv()

# Get API key from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Please set GOOGLE_API_KEY environment variable")

# Configure the API
genai.configure(api_key=GOOGLE_API_KEY)

def initialize_model():
    """Initialize and return the Gemini model."""
    return genai.GenerativeModel('gemini-2.0-flash')

def load_context_files():
    """Load all combined text files from state_schemes directory."""
    context = ""
    base_path = Path("state_schemes")
    
    states = ["andhra-pradesh", "karnataka", "kerala", "tamilnadu", "telangana", "central"]
    
    for state in states:
        combined_file = base_path / state / f"{state}_combined.txt"
        if combined_file.exists():
            with open(combined_file, 'r', encoding='utf-8') as f:
                context += f"\n\n=== {state.upper()} SCHEMES ===\n"
                context += f.read()
    
    return context

def create_chatbot():
    """Create and return a chat instance with context."""
    model = initialize_model()
    context = load_context_files()
    
    chat = model.start_chat(history=[])
    
    system_prompt = f"""You are a helpful assistant that provides information about various government schemes from different states in India. 
    Use the following context and your knowledge to answer questions about these schemes. 
    
    Context:
    {context}
    """
    
    chat.send_message(system_prompt)
    return chat

def get_scheme_info(question: str) -> str:
    """
    Get information about government schemes based on the question.
    
    Args:
        question (str): The question about government schemes
        
    Returns:
        str: The response from the chatbot
    """
    try:
        chat = create_chatbot()
        response = chat.send_message(question)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# Example usage:
if __name__ == "__main__":
    question = "प्रधानमंत्री किसान सम्मान निधि योजना के अंतर्गत किसानों को प्रति वर्ष कितनी आर्थिक सहायता दी जाती है और यह कितनी किश्तों में प्रदान की जाती है?"
    text_to_speech(question)
    # response = get_scheme_info(question)
    # print(response)
    # text_to_speech(response)


