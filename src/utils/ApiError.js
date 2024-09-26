class ApiError extends Error {
    constructor(
        statusCode,
        message = "Soemthing went wrong",
        errors = [],
        data = null,
        stack = ""


    ) {
        super(message),
            this.statusCode = statusCode,
            this.errors = errors,
            this.message = message,
            this.success = false,
            this.data = data

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default ApiError;
