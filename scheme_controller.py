from typing import Optional
from scheme_model import SchemeModel

class SchemeController:
    def __init__(self, model: SchemeModel):
        self.model = model
    
    def process_query(self, query: str) -> str:
        """
        Process a user query and return the response.
        
        Args:
            query (str): The user's query about government schemes
            
        Returns:
            str: The processed response
        """
        # Here you can add any preprocessing of the query if needed
        # For example, language detection, query validation, etc.
        
        # Get response from model
        response = self.model.generate_response(query)
        
        # Here you can add any postprocessing of the response if needed
        # For example, formatting, filtering, etc.
        
        return response 