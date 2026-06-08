const Joi = require("joi");

const addRecipeSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .required()
        .messages({
            "any.required": "Title is required",
            "string.empty": "Title is required",
            "string.base": "Title must be a string",
            "string.min": "Title must be at least 3 characters long"
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .required()
        .messages({
            "any.required": "Description is required",
            "string.empty": "Description is required",
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 1000 characters"
        }),

    cookingTime: Joi.number()
        .positive()
        .required()
        .messages({
            "any.required": "Cooking time is required",
            "number.base": "Cooking time must be a number",
            "number.positive": "Cooking time must be greater than 0"
        }),

    difficulty: Joi.string()
        .valid("Easy", "Medium", "Hard")
        .required()
        .messages({
            "any.required": "Difficulty is required",
            "string.empty": "Difficulty is required",
            "string.base": "Difficulty must be a string",
            "any.only": "Difficulty must be Easy, Medium or Hard"
        }),

    category: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "any.required": "Category is required",
            "string.empty": "Category is required",
            "string.hex": "Invalid category id",
            "string.length": "Invalid category id"
        }),

    subCategory: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "any.required": "Subcategory is required",
            "string.empty": "Subcategory is required",
            "string.hex": "Invalid subcategory id",
            "string.length": "Invalid subcategory id"
        }),

    ingredients: Joi.string()
        .required()
        .messages({
            "any.required": "Ingredients are required",
            "string.empty": "Ingredients are required"
        }),

    instructions: Joi.string()
        .required()
        .messages({
            "any.required": "Instructions are required",
            "string.empty": "Instructions are required"
        })
});

const updateRecipeSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .messages({
            "string.base": "Title must be a string",
            "string.min": "Title must be at least 3 characters long"
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 1000 characters"
        }),

    cookingTime: Joi.number()
        .positive()
        .messages({
            "number.base": "Cooking time must be a number",
            "number.positive": "Cooking time must be greater than 0"
        }),

    difficulty: Joi.string()
        .valid("Easy", "Medium", "Hard")
        .messages({
            "string.base": "Difficulty must be a string",
            "any.only": "Difficulty must be Easy, Medium or Hard"
        }),

    category: Joi.string()
        .hex()
        .length(24)
        .messages({
            "string.hex": "Invalid category id",
            "string.length": "Invalid category id"
        }),

    subCategory: Joi.string()
        .hex()
        .length(24)
        .messages({
            "string.hex": "Invalid subcategory id",
            "string.length": "Invalid subcategory id"
        }),

    ingredients: Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .messages({
            "array.base": "Ingredients must be an array",
            "array.min": "At least one ingredient is required"
        }),

    instructions: Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .messages({
            "array.base": "Instructions must be an array",
            "array.min": "At least one instruction is required"
        })

}).min(1).messages({
    "object.min": "At least one field is required to update"
});

module.exports = {
    addRecipeSchema,
    updateRecipeSchema
};