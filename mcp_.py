from fastmcp import Client

# Connect to the running MCP server
client = Client("http://127.0.0.1:9000")

# Call the tool defined on the server
response = client.call("get_scheme_information", question="What is PM-KISAN?")

print("📘 Answer:", response)
