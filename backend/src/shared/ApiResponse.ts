export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;

  constructor(success: boolean, message: string, data?: T, meta?: Record<string, unknown>) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(message: string, data?: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message, null);
  }
}
