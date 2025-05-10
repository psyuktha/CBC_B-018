import os
from contextlib import AsyncExitStack
from typing import Dict, Any
from dotenv import load_dotenv
from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from pathlib import Path

# Load environment variables
load_dotenv()

async def create_scheme_agent():
    """Creates an LlmAgent with tools from an MCP Server to access state scheme files."""
    common_exit_stack = AsyncExitStack()

    # Configure MCP server to access local state scheme files
    local_tools, _ = await MCPToolset.from_server(
        connection_params=StdioServerParameters(
            command='npx',
            args=[
                "-y",
                "@modelcontextprotocol/server-filesystem",
                # TODO: Replace with the ABSOLUTE path to your state_schemes folder
                "/Volumes/One Touch/gemii/state"
            ],
        ),
        async_exit_stack=common_exit_stack
    )

    # Create system prompt
    system_prompt = """You are a helpful assistant that provides information about various government schemes from different states in India. 
    Use the context provided by the MCP server tools to answer questions about these schemes. If you don't know something, say so."""

    # Initialize LlmAgent
    agent = LlmAgent(
        model='gemini-2.0-flash',
        name='scheme_assistant',
        instruction=system_prompt,
        tools=local_tools
    )

    return agent, common_exit_stack

async def get_scheme_info(agent, question: str) -> str:
    """
    Get information about government schemes based on the question.
    
    Args:
        agent (LlmAgent): The LlmAgent instance
        question (str): The question about government schemes
    
    Returns:
        str: The response from the agent
    """
    try:
        # Use the agent to process the question
        response = await agent.generate_response(question)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# Example usage
if __name__ == "__main__":
    import asyncio

    async def main():
        # Create the agent
        agent, exit_stack = await create_scheme_agent()

        # Example question
        question = "तेलंगाना 2BHK हाउसिंग स्कीम का मुख्य उद्देश्य गरीब लोगों को आश्रय प्रदान करना है। इस योजना के तहत, सरकार पात्र लाभार्थियों को बिना किसी लागत के आवास प्रदान करती है।"
        
        # Get response
        async with exit_stack:
            response = await get_scheme_info(agent, question)
            print(response)

    # Run the async main function
    asyncio.run(main())