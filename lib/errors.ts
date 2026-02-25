/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public errorCode: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errorCode: string;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  errorCode: string
): ErrorResponse {
  return {
    success: false,
    message,
    errorCode,
  };
}

/**
 * Common error handlers
 */
export const ErrorHandler = {
  invalidCredentials: () =>
    new AppError("Invalid email or password", "INVALID_CREDENTIALS", 401),

  unauthorized: () =>
    new AppError("Unauthorized access", "UNAUTHORIZED", 401),

  tokenMissing: () =>
    new AppError("Authentication token is missing", "TOKEN_MISSING", 401),

  tokenInvalid: () =>
    new AppError("Invalid or expired token", "TOKEN_INVALID", 401),

  userExists: () =>
    new AppError("An account with this email already exists. Please login instead.", "USER_EXISTS", 409),

  userNotFound: () =>
    new AppError("User not found", "USER_NOT_FOUND", 404),

  taskNotFound: () =>
    new AppError("Task not found", "TASK_NOT_FOUND", 404),

  forbiddenAccess: () =>
    new AppError("You don't have permission to access this resource", "FORBIDDEN", 403),

  validationError: (message: string) =>
    new AppError(message, "VALIDATION_ERROR", 400),

  internalError: () =>
    new AppError("Internal server error", "INTERNAL_ERROR", 500),
};
