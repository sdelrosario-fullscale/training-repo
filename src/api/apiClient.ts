import { Platform } from 'react-native';

export type NetworkApiError = {
  kind: 'network';
  message: string;
};

export type HttpApiError = {
  kind: 'http';
  message: string;
  status: number;
  body: unknown;
};

export type DecodeApiError = {
  kind: 'decode';
  message: string;
  status: number;
};

export type ApiError = NetworkApiError | HttpApiError | DecodeApiError;

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ApiError };

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

type GetOptions = Omit<RequestInit, 'body' | 'method'>;
type PostOptions = Omit<RequestInit, 'body' | 'method'>;

export type ApiClient = {
  get<T>(path: string, options?: GetOptions): Promise<ApiResult<T>>;
  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: PostOptions,
  ): Promise<ApiResult<TResponse>>;
};

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return fallback;
}

function getNetworkMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Network request failed';
}

export function createApiClient(
  baseUrl: string,
  fetcher: Fetcher = fetch,
): ApiClient {
  async function request<T>(
    path: string,
    options: RequestInit,
  ): Promise<ApiResult<T>> {
    let response: Response;

    try {
      response = await fetcher(buildUrl(baseUrl, path), options);
    } catch (error: unknown) {
      return {
        ok: false,
        error: {
          kind: 'network',
          message: getNetworkMessage(error),
        },
      };
    }

    let body: unknown;

    try {
      body = await response.json();
    } catch {
      if (!response.ok) {
        return {
          ok: false,
          error: {
            kind: 'http',
            message: `Request failed with status ${response.status}`,
            status: response.status,
            body: null,
          },
        };
      }

      return {
        ok: false,
        error: {
          kind: 'decode',
          message: 'Response body was not valid JSON',
          status: response.status,
        },
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: 'http',
          message: getErrorMessage(
            body,
            `Request failed with status ${response.status}`,
          ),
          status: response.status,
          body,
        },
      };
    }

    return { ok: true, data: body as T, status: response.status };
  }

  return {
    get: <T>(path: string, options: GetOptions = {}) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <TResponse, TBody = unknown>(
      path: string,
      body: TBody,
      options: PostOptions = {},
    ) =>
      request<TResponse>(path, {
        ...options,
        body: JSON.stringify(body),
        headers: options.headers ?? {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
  };
}

export const workforceApiBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const apiClient = createApiClient(workforceApiBaseUrl);
