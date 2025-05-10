from fastmcp import Client
import asyncio

async def main():
    # Connect to the server
    async with Client("http://127.0.0.1:9000") as client:
        # List available tools
        tools = await client.list_tools()
        print(f"Available tools: {tools}")
        
        # Test the get_scheme_information tool
        response = await client.tool.get_scheme_information(
            "What is the 2BHK scheme in Telangana?"
        )
        print(f"\nResponse: {response}")
        
        # Test the get_state_schemes tool
        response = await client.tool.get_state_schemes("karnataka")
        print(f"\nKarnataka schemes: {response}")
        
        # Test the get_scheme_details tool
        response = await client.tool.get_scheme_details(
            "2BHK Housing Scheme", 
            "telangana"
        )
        print(f"\nScheme details: {response}")

if __name__ == "__main__":
    asyncio.run(main())