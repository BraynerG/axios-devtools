# Axios DevTools - Advanced API Client

A professional Model Context Protocol (MCP) server that enables advanced HTTP requests through Axios. Built with SOLID and CLEAN architecture principles.

## Features

- **Advanced HTTP Requests**: Support for GET, POST, PUT, PATCH, and DELETE.
- **Dynamic Configuration**: Overwrite base URLs and authentication tokens per request.
- **Robust Error Handling**: Detailed error messages optimized for LLM consumption.
- **Clean Architecture**: Modular design following SOLID principles for easy extensibility.

## Installation

```bash
npm install
npm run build
```

## Usage

Configure your MCP client to point to the server:

```json
{
  "mcpServers": {
    "axios": {
      "command": "node",
      "args": ["/absolute/path/to/axios-devtools/dist/index.js"],
      "env": {
        "API_BASE_URL": "https://api.example.com",
        "API_TOKEN": "your-default-token"
      }
    }
  }
}
```

## Available Tools

### `advanced_api_request`
Performs complex HTTP requests with dynamic headers, query params, and body data.

**Parameters:**
- `method` (required): GET, POST, PUT, PATCH, DELETE.
- `url` (required): Endpoint path or full URL.
- `baseUrl`: Optional URL override.
- `token`: Optional Bearer token override.
- `queryParams`: Optional object for URL parameters.
- `headers`: Optional additional headers.
- `data`: Optional request body.
- `timeout`: Optional timeout in ms (default: 10000).

## Author

**BraynerG** - [github.com/BraynerG](https://github.com/BraynerG)

## License

MIT
