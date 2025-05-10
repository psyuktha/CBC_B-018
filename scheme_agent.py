import os
from typing import Dict, Any
from dotenv import load_dotenv
import google.generativeai as genai
from pathlib import Path

# Load environment variables
load_dotenv()

# Get API key from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Please set GOOGLE_API_KEY environment variable")

# Initialize the client
client = genai.Client(api_key=GOOGLE_API_KEY)

class SchemeAgent:
    def __init__(self):
        self.context = self._load_context_files()
        self.system_prompt = self._create_system_prompt()
        
    def _load_context_files(self) -> str:
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
    
    def _create_system_prompt(self) -> str:
        """Create the system prompt with context."""
        return f"""You are a helpful assistant that provides information about various government schemes from different states in India. 
        Use the following context to answer questions about these schemes. If you don't know something, say so.
        
        Context:
        {self.context}
        """
    
    def get_scheme_info(self, question: str) -> str:
        """
        Get information about government schemes based on the question.
        
        Args:
            question (str): The question about government schemes
            
        Returns:
            str: The response from the chatbot
        """
        try:
            # Combine system prompt and question
            full_prompt = f"{self.system_prompt}\n\nQuestion: {question}"
            
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=full_prompt
            )
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"
    
   
# Example usage
if __name__ == "__main__":
    # Create an instance of the scheme agent
    agent = SchemeAgent()
    
    question = "तेलंगाना 2BHK हाउसिंग स्कीम का मुख्य उद्देश्य गरीब लोगों को आश्रय प्रदान करना है। इस योजना के तहत, सरकार पात्र लाभार्थियों को बिना किसी लागत के आवास प्रदान करती है।"
    response = agent.get_scheme_info(question)
    print(response)