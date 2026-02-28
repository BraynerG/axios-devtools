import { BaseTool } from "./base-tool.js";
import { HttpClient } from "../core/http-client.js";
type AxiosRequestConfig = any;

/**
 * ApiRequestTool implements the 'advanced_api_request' tool.
 * Single Responsibility: Mapping MCP call to HTTP request.
 */
export class ApiRequestTool extends BaseTool {
  private static readonly TOOL_NAME = "advanced_api_request";
  private static readonly TOOL_DESCRIPTION = "Perform advanced HTTP requests with dynamic base URL and authentication support.";

  constructor(private httpClient: HttpClient) {
    super();
  }

  getDefinition() {
    return {
      name: ApiRequestTool.TOOL_NAME,
      description: ApiRequestTool.TOOL_DESCRIPTION,
      inputSchema: this.getSchema()
    };
  }

  private getSchema() {
    return {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          description: "HTTP method (GET, POST, etc.)"
        },
        url: {
          type: "string",
          description: "API endpoint path or full URL"
        },
        baseUrl: {
          type: "string",
          description: "Optional base URL override"
        },
        token: {
          type: "string",
          description: "Optional Bearer token override"
        },
        queryParams: {
          type: "object",
          description: "Optional URL query parameters"
        },
        headers: {
          type: "object",
          description: "Optional custom HTTP headers"
        },
        data: {
          type: "object",
          description: "Optional request body payload"
        },
        timeout: {
          type: "number",
          description: "Optional timeout in ms (default: 10000)"
        }
      },
      required: ["method", "url"]
    };
  }

  async execute(args: any): Promise<any> {
    const { url, baseUrl } = args;
    const restrictedBaseUrl = process.env.API_BASE_URL;

    if (restrictedBaseUrl) {
      // If baseUrl is provided, it must match or be a subpath of restrictedBaseUrl
      if (baseUrl && baseUrl !== restrictedBaseUrl) {
        return {
          content: [{
            type: "text",
            text: `Unallowed URL: The provided baseUrl "${baseUrl}" does not match the restricted API_BASE_URL set in the environment.`
          }],
          isError: true
        };
      }

      // 2. If url is absolute, it must start with restrictedBaseUrl
      try {
        const isAbsoluteUrl = /^(?:[a-z+.-]+:)?\/\//i.test(url);
        if (isAbsoluteUrl && !url.startsWith(restrictedBaseUrl)) {
          return {
            content: [{
              type: "text",
              text: `Unallowed URL: The provided absolute URL "${url}" does not match the restricted API_BASE_URL "${restrictedBaseUrl}" set in the environment.`
            }],
            isError: true
          };
        }
      } catch (e) {
        // Fallback for edge cases, though simple string check is usually enough for prefixing
      }
    }

    const config = this.prepareConfig(args);
    return await this.httpClient.request(config);
  }

  private prepareConfig(args: any): AxiosRequestConfig {
    const {
      method,
      url,
      baseUrl,
      token,
      queryParams,
      headers,
      data,
      timeout
    } = args;

    const axiosConfig: AxiosRequestConfig = {
      method: (method as string).toLowerCase(),
      url: url,
      baseURL: baseUrl || process.env.API_BASE_URL,
      params: queryParams || {},
      data: data || undefined,
      timeout: timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const activeToken = token || process.env.API_TOKEN;
    if (activeToken) {
      this.applyAuthToken(axiosConfig, activeToken);
    }

    return axiosConfig;
  }

  private applyAuthToken(config: AxiosRequestConfig, token: string): void {
    if (!config.headers) {
      config.headers = {};
    }

    const hasAuth = config.headers["Authorization"] || config.headers["authorization"];
    if (!hasAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
}

