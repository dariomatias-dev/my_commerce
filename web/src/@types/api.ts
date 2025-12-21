export interface FieldError {
  field: string;
  error: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T;
  errors?: FieldError[];
}

export class ApiError extends Error {
  code: number;
  errors?: FieldError[];

  constructor(message: string, code: number, errors?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.errors = errors;
  }
}
