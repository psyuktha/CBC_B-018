import os
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

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
    Use the following context to answer questions about these schemes. If you don't know something, say so.
    
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
    question = "तेलंगाना 2BHK हाउसिंग स्कीम का मुख्य उद्देश्य गरीब लोगों को आश्रय प्रदान करना है। इस योजना के तहत, सरकार पात्र लाभार्थियों को बिना किसी लागत के आवास प्रदान करती है।"
    response = get_scheme_info(question)
    print(response)



