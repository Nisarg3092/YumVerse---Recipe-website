const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .required()
        .messages({
            "any.required": "Username is required",
            "string.empty": "Username is required",
            "string.base": "Username must be a string",
            "string.min": "Username must be at least 3 characters long"
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "any.required": "Email is required",
            "string.empty": "Email is required",
            "string.base": "Email must be a string",
            "string.email": "Please provide a valid email address"
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password is required",
            "string.base": "Password must be a string",
            "string.min": "Password must be at least 6 characters long"
        }),

    avatar: Joi.string()
        .valid("male", "female")
        .required()
        .messages({
            "any.required": "Avatar is required",
            "string.empty": "Avatar is required",
            "string.base": "Avatar must be a string",
            "any.only": "Avatar must be either male or female"
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "any.required": "Email is required",
            "string.empty": "Email is required",
            "string.base": "Email must be a string",
            "string.email": "Please provide a valid email address"
        }),

    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password is required",
            "string.base": "Password must be a string"
        })
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "any.required": "Email is required",
            "string.empty": "Email is required",
            "string.base": "Email must be a string",
            "string.email": "Please provide a valid email address"
        })
});

const resetPasswordSchema = Joi.object({
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password is required",
            "string.base": "Password must be a string",
            "string.min": "Password must be at least 6 characters long"
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.required": "Confirm password is required",
            "string.empty": "Confirm password is required",
            "any.only": "Passwords do not match"
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};