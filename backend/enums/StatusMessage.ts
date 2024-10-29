export enum StatusMessage {
  SUCCESS = "Operation successful",
  CREATED_SUCCESS = "Resource created successfully",
  BAD_REQUEST = "Bad request, please check the input data",
  UNAUTHORIZED = "Unauthorized access",
  FORBIDDEN = "Access forbidden",
  NOT_FOUND = "Resource not found",
  INTERNAL_SERVER_ERROR = "An internal server error occurred",
  INVALID_CREDENTIALS = "Invalid credentials provided",
  EMAIL_ALREADY_EXISTS = "An account with this email already exists",
  PASSWORD_TOO_WEAK = "Password does not meet strength requirements",
  TOKEN_EXPIRED = "The token has expired, please request a new one",
  RESOURCE_NOT_AVAILABLE = "Requested resource is currently unavailable",
  OPERATION_FAILED = "The operation could not be completed",
  USER_NOT_FOUND = "User not found",
  EMAIL_NOT_FOUND = "No account associated with this email",
  FORGOT_PASSWORD_REQUEST_FAILED = "Failed to process password reset request",
  INVALID_INPUT = "Invalid input provided",
  }