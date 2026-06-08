const Joi = require("joi");

const addReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "any.required": "Rating is required",
            "number.base": "Rating must be a number",
            "number.integer": "Rating must be a whole number",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating cannot exceed 5"
        }),

    comment: Joi.string()
        .trim()
        .max(500)
        .required()
        .messages({
            "any.required": "Comment is required",
            "string.empty": "Comment is required",
            "string.base": "Comment must be a string",
            "string.max": "Comment cannot exceed 500 characters"
        })
});

const updateReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .messages({
            "number.base": "Rating must be a number",
            "number.integer": "Rating must be a whole number",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating cannot exceed 5"
        }),

    comment: Joi.string()
        .trim()
        .max(500)
        .messages({
            "string.base": "Comment must be a string",
            "string.max": "Comment cannot exceed 500 characters"
        })

}).min(1).messages({
    "object.min": "At least one field is required to update"
});

module.exports = {
    addReviewSchema,
    updateReviewSchema
};