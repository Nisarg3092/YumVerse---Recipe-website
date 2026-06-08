const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory,model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getSubCategories = asyncHandler(async (req, res) => {

    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({category: categoryId}).select("name");

    const category = await Category.findById(categoryId).select("name image");

    if (!category) {
        throw ApiError.notFound("category not found");
    }

    return res.status(200).json(
        ApiResponse.okResponse({
            category: category, 
            subCategories: subCategories
        },"subcategories fetch successfully")
    );

});

module.exports = {
    getSubCategories
};

