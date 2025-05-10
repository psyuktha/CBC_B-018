from typing import Optional
from mcp.scheme_controller import SchemeController

class SchemePresenter:
    def __init__(self, controller: SchemeController):
        self.controller = controller
    
    def present_response(self, query: str) -> str:
        """
        Present the response to a user query in a formatted way.
        
        Args:
            query (str): The user's query
            
        Returns:
            str: Formatted response
        """
        # Get response from controller
        response = self.controller.process_query(query)
        
        # Format the response
        formatted_response = self._format_response(response)
        
        return formatted_response
    
    def _format_response(self, response: str) -> str:
        """
        Format the response for presentation.
        
        Args:
            response (str): Raw response from the model
            
        Returns:
            str: Formatted response
        """
        # Add any formatting logic here
        # For example, adding headers, bullet points, etc.
        
        if response.startswith("Error:"):
            return f"❌ {response}"
        
        return f"✅ {response}" 