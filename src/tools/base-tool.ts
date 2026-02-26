/**
 * Base class for all MCP tools.
 * Following the Open/Closed Principle.
 */
export abstract class BaseTool {
  /**
   * Returns the tool definition for MCP registration.
   */
  abstract getDefinition(): any;

  /**
   * Returns the name of the tool.
   */
  getName(): string {
    return this.getDefinition().name;
  }

  /**
   * Executes the tool logic.
   * @param args Arguments passed to the tool.
   */
  abstract execute(args: any): Promise<any>;
}
