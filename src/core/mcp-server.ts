import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BaseTool } from "../tools/base-tool.js";

/**
 * McpServer manages the registration and execution of MCP tools.
 */
export class McpServer {
  private server: Server;
  private tools: Map<string, BaseTool>;

  constructor(name: string, version: string) {
    this.server = new Server(
      { name, version },
      { capabilities: { tools: {} } }
    );
    this.tools = new Map();
  }

  /**
   * Registers a tool implementation.
   * @param tool instance of a class extending BaseTool.
   */
  registerTool(tool: BaseTool): void {
    this.tools.set(tool.getName(), tool);
  }

  /**
   * Sets up the request handlers for the server.
   */
  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Array.from(this.tools.values()).map((tool) => tool.getDefinition()),
    }));

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      if (!tool) {
        throw new Error(`Tool not found: ${request.params.name}`);
      }

      try {
        const result = await tool.execute(request.params.arguments || {});
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(error, null, 2),
            },
          ],
        };
      }
    });
  }

  /**
   * Connects the server to a transport.
   * @param transport StdioServerTransport or other.
   */
  async connect(transport: StdioServerTransport): Promise<void> {
    this.setupHandlers();
    await this.server.connect(transport);
  }
}
