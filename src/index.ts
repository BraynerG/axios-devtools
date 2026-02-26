import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HttpClient } from "./core/http-client.js";
import { McpServer } from "./core/mcp-server.js";
import { ApiRequestTool } from "./tools/api-request.tool.js";

async function main() {
  const server = new McpServer("axios-devtools", "2.0.0");
  const httpClient = new HttpClient();

  // Register tools
  server.registerTool(new ApiRequestTool(httpClient));

  // Connect
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
