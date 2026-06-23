const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!err.isOperational) {
        statusCode = 500;
        message = "Internal Server Error"
    }

    res.status(statusCode || 500).json({
        message: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
}

export default errorMiddleware