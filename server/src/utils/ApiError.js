class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }

    // 500 - Internal Server Error
    static serverError(message = "Internal Server Error", errors = []) {
        return new ApiError(500, message, errors);
    }

    // 400 - Bad Request 
    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    // 401 - Unauthorised
    static unauthorised(message = "Unauthorised", errors = []) {
        return new ApiError(401, message, errors);
    }

    // 403 - Forbidden
    static forbidden(message = "Forbidden", errors = []) {
        return new ApiError(403, message, errors);
    }

    // 404 - Not Found
    static notFound(message = "Not Found", errors = []) {
        return new ApiError(404, message, errors);
    }

    // 409 - Conflict
    static conflict(message = "Conflict", errors = []) {
        return new ApiError(409, message, errors);
    }
}

module.exports = ApiError;