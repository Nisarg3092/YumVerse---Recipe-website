const multer = require("multer");
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 recipe images are allowed",
                errors: []
            });
        }

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Each image must be less than 5MB",
                errors: []
            });
        }
    }

    if(err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: []
    });
}

module.exports = errorHandler;