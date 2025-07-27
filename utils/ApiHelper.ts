import { APIRequestContext, request } from '@playwright/test';

export class ApiHelper {
  private apiContext: APIRequestContext | null = null;
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async setAuthToken(token: string): Promise<void> {
    this.authToken = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async get(endpoint: string, params?: Record<string, string>): Promise<any> {
    if (!this.apiContext) throw new Error('API context not initialized');

    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await this.apiContext.get(url.toString(), {
      headers: this.getHeaders(),
    });

    return {
      status: response.status(),
      data: await this.parseResponse(response),
      headers: response.headers(),
    };
  }

  async post(endpoint: string, data?: any): Promise<any> {
    if (!this.apiContext) throw new Error('API context not initialized');

    const response = await this.apiContext.post(endpoint, {
      headers: this.getHeaders(),
      data: data ? JSON.stringify(data) : undefined,
    });

    return {
      status: response.status(),
      data: await this.parseResponse(response),
      headers: response.headers(),
    };
  }

  async put(endpoint: string, data?: any): Promise<any> {
    if (!this.apiContext) throw new Error('API context not initialized');

    const response = await this.apiContext.put(endpoint, {
      headers: this.getHeaders(),
      data: data ? JSON.stringify(data) : undefined,
    });

    return {
      status: response.status(),
      data: await this.parseResponse(response),
      headers: response.headers(),
    };
  }

  async delete(endpoint: string): Promise<any> {
    if (!this.apiContext) throw new Error('API context not initialized');

    const response = await this.apiContext.delete(endpoint, {
      headers: this.getHeaders(),
    });

    return {
      status: response.status(),
      data: await this.parseResponse(response),
      headers: response.headers(),
    };
  }

  private async parseResponse(response: any): Promise<any> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    } else {
      return await response.text();
    }
  }

  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}