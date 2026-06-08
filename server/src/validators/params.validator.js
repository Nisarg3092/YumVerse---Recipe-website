const Joi = require("joi");

const createMongoIdSchema = (fieldName = "id") =>
    Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "any.required": `${fieldName} is required`,
            "string.empty": `${fieldName} is required`,
            "string.base": `${fieldName} must be a string`,
            "string.hex": `Invalid ${fieldName}`,
            "string.length": `Invalid ${fieldName}`
        });


const userIdSchema = Joi.object({
    userId: createMongoIdSchema("userId")
});

const recipeIdSchema = Joi.object({
    recipeId: createMongoIdSchema("recipeId")
});

const reviewIdSchema = Joi.object({
    reviewId: createMongoIdSchema("reviewId")
});

const categoryIdSchema = Joi.object({
    categoryId: createMongoIdSchema("categoryId")
});

module.exports = {
    userIdSchema,
    recipeIdSchema,
    reviewIdSchema,
    categoryIdSchema
};