const Joi = require("joi");

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            "any.required": "Current password is required",
            "string.empty": "Current password is required",
            "string.base": "Current password must be a string"
        }),

    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            "any.required": "New password is required",
            "string.empty": "New password is required",
            "string.base": "New password must be a string",
            "string.min": "New password must be at least 6 characters long"
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.required": "Confirm password is required",
            "string.empty": "Confirm password is required",
            "string.base": "Confirm password must be a string",
            "any.only": "New password and confirm password must match"
        })
});

const updateAccountSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .messages({
            "string.base": "Username must be a string",
            "string.min": "Username must be at least 3 characters long"
        }),

    bio: Joi.string()
        .trim()
        .max(200)
        .messages({
            "string.base": "Bio must be a string",
            "string.max": "Bio cannot exceed 200 characters"
        })

}).min(1).messages({
    "object.min": "At least one field is required to update"
});

module.exports = {
    changePasswordSchema,
    updateAccountSchema
};