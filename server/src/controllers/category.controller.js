const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const getCategories = asyncHandler( async ( req, res ) => {
    
    const categories = await Category.find().select("name image");

    if (!categories.length) {
        throw ApiError.serverError("something wents wrong while fetching categories");
    }

    return res.status(200).json(
        ApiResponse.okResponse({
            categories: categories
        }, "Categoruies fetched successfuly")
    );

});

module.exports = {
    getCategories
};