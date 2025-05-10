import os
from typing import Dict, Any
from dotenv import load_dotenv
from google import genai
from pathlib import Path

class SchemeModel:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Get API key from environment variable
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("Please set GOOGLE_API_KEY environment variable")
            
        # Initialize the client
        self.client = genai.Client(api_key=self.api_key)
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
    
    def generate_response(self, question: str) -> str:
        """
        Generate a response for the given question.
        
        Args:
            question (str): The question about government schemes
            
        Returns:
            str: The generated response
        """
        try:
            # Combine system prompt and question
            full_prompt = f"{self.system_prompt}\n\nQuestion: {question}"
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=full_prompt
            )
            return response.text
        except Exception as e:
            return f"Error: {str(e)}" 