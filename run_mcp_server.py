import os
import asyncio
from dotenv import load_dotenv
from mcp_ import create_scheme_agent, get_scheme_info

async def run_server():
    try:
        # Create the agent
        print("Initializing MCP server...")
        agent, exit_stack = await create_scheme_agent()
        
        print("MCP server is running. Press Ctrl+C to exit.")
        print("\nExample query:")
        example_query = "तेलंगाना 2BHK हाउसिंग स्कीम का मुख्य उद्देश्य गरीब लोगों को आश्रय प्रदान करना है।"
        print(f"Query: {example_query}")
        
        # Get response for example query
        async with exit_stack:
            response = await get_scheme_info(agent, example_query)
            print(f"\nResponse: {response}")
            
            # Keep the server running
            while True:
                await asyncio.sleep(1)
                
    except KeyboardInterrupt:
        print("\nShutting down MCP server...")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'exit_stack' in locals():
            await exit_stack.aclose()

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Check for required environment variables
    if not os.getenv("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable is not set")
        exit(1)
    
    # Run the server
    asyncio.run(run_server()) 