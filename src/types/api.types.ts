export interface ApiErrorResponse {
  readonly detail: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedResponse<TItem> {
  readonly items: TItem[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}
