from fastmcp.client import MCPClient

# Initialize the client
client = MCPClient("Government Schemes Assistant", transport="stdio")

# Call the add tool
result = client.call_tool("get_scheme_information", "What are the main government schemes in India?")
print(f"Add result: {result}")
