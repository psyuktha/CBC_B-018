from fastmcp import FastMCP
from gemini import initialize_model, load_context_files, get_scheme_info
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP
mcp = FastMCP(name="Government Schemes Assistant", stateless_http=True)

# Load context and model once at startup
logger.info("Loading context files...")
context = load_context_files()
logger.info("Initializing model...")
model = initialize_model()

@mcp.tool()
def get_scheme_information(question: str) -> str:
    """Get information about government schemes based on the question."""
    return get_scheme_info(question)

@mcp.tool()
def get_state_schemes(state: str) -> str:
    """Get all schemes available in a specific state."""
    question = f"What are all the schemes available in {state}?"
    return get_scheme_info(question)

@mcp.tool()
def get_scheme_details(scheme_name: str, state: str = None) -> str:
    """Get detailed information about a specific scheme."""
    question = f"Tell me about the {scheme_name}"
    if state:
        question += f" in {state}"
    return get_scheme_info(question)

if __name__ == "__main__":
    print("🚀 Government Schemes Assistant is running!")
    mcp.run(transport="sse", host="127.0.0.1", port=9000)