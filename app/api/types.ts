export interface ApiSuccess<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  error?: string;
  message: string;
  statusCode?: number;
  path?: string;
  timestamp?: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}
