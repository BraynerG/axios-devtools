import axios from "axios";
// Using any for config to bypass environment type resolution issues
type AxiosRequestConfig = any;

export interface HttpResponse {
  status: number;
  statusText: string;
  data: any;
}

export interface HttpError {
  message: string;
  isNetworkError: boolean;
  status?: number;
  statusText?: string;
  data?: any;
}

/**
 * HttpClient service that wraps axios.
 * Follows the Dependency Inversion Principle.
 */
export class HttpClient {
  /**
   * Performs an HTTP request.
   * @param config Axios request configuration.
   * @returns The server response.
   */
  async request(config: any): Promise<HttpResponse> {
    try {
      const response = await axios(config);
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      };
    } catch (error: any) {
      const errorDetails: HttpError = {
        message: error.message,
        isNetworkError: !error.response,
      };

      if (error.response) {
        errorDetails.status = error.response.status;
        errorDetails.statusText = error.response.statusText;
        errorDetails.data = error.response.data;
      }

      throw errorDetails;
    }
  }
}
