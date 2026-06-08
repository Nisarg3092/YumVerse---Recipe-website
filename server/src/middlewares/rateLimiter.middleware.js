const { rateLimit } = require("express-rate-limit");

const commonConfig = {
    standardHeaders: true,
    legacyHeaders: false,
};

const apiLimiter = rateLimit({
    ...commonConfig,
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

const authLimiter = rateLimit({
    ...commonConfig,
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});

const reviewLimiter = rateLimit({
    ...commonConfig,
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many reviews submitted. Please wait before trying again."
    }
});

const recipeLimiter = rateLimit({
    ...commonConfig,
    windowMs: 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many recipe creation requests. Please try again later."
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    reviewLimiter,
    recipeLimiter,
};