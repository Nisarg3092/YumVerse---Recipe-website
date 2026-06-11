const mongoose = require("mongoose");
const User = require("../models/user.model");
const Recipe = require("../models/recipe.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary, unlinkOnCloudinary } = require("../utils/cloudinary");


const GetSingleRecipe = asyncHandler(async (req, res) => {

    const { slug } = req.params;

    if (!slug) {
        throw ApiError.notFound("recipe slug not found");
    }

    const recipe = await Recipe.aggregate([
        {
            $match: {
                slug: slug
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
            }
        },
        {
            $addFields: {
                createdBy: {
                    $first: "$createdBy"
                },
                category: {
                    $first: "$category.name"
                },
                subCategory: {
                    $first: "$subCategory.name"
                },
                image: {
                    $first: "$image"
                }
            }
        }
    ]);

    if (recipe.length === 0) {
        throw ApiError.notFound("Recipe not found");
    }

    res.status(200).json(
        ApiResponse.okResponse({
            recipe: recipe[0]
        }, "Recipe fetch successflly")
    );

});

const GetRecipes = asyncHandler(async (req, res) => {

    const {
        page = 1,
        search,
        category,
        difficulty,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const currentPage = Number(page);

    if (isNaN(currentPage) || currentPage < 1) {
        throw ApiError.badRequest("Invalid page number");
    }

    const matchQuery = {};
    let order = -1;

    if ("asc" === sortOrder.toLowerCase()) {
        order = 1
    }

    if (search?.trim()) {
        matchQuery.$text = {
            $search: search,
        }
    }

    if (category?.trim()) {
        const categoryId = await Category.findOne({
            name: category
        }).select("_id");

        if (!categoryId) {
            throw ApiError.notFound("Category not found");
        }

        matchQuery.category = categoryId._id;
    }

    if (difficulty?.trim()) {
        matchQuery.difficulty = difficulty;
    }

    const totalRecipes = await Recipe.countDocuments(matchQuery);

    const recipes = await Recipe.aggregate([
        {
            $match: matchQuery
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
            }
        },
        {
            $addFields: {
                createdBy: {
                    $first: "$createdBy"
                },
                category: {
                    $first: "$category.name"
                },
                subCategory: {
                    $first: "$subCategory.name"
                },
                image: {
                    $first: "$image"
                }
            }
        },
        {
            $project: {
                ingredients: false,
                instructions: false
            }
        }
    ]).sort({ [sortBy]: order }).skip((currentPage - 1) * 10).limit(10);

    res.status(200).json(
        ApiResponse.okResponse({
            recipes: recipes,
            totalRecipes: totalRecipes,
            totalPage: Math.max(1, Math.ceil(totalRecipes / 10)),
            currentPage: currentPage
        }, "Recipes fetch successflly")
    );

});

const addRecipe = asyncHandler(async (req, res) => {

    const { title, description, cookingTime, difficulty, category, subCategory } = req.body;

    let ingredients = [];
    let instructions = [];

    try {
        ingredients = JSON.parse(req.body.ingredients);
        instructions = JSON.parse(req.body.instructions);
    } catch {
        ingredients = req.body.ingredients
            .split("||")
            .map(item => item.trim())
            .filter(Boolean);

        instructions = req.body.instructions
            .split("||")
            .map(item => item.trim())
            .filter(Boolean);
    }

    if (
        ingredients.length === 0 ||
        instructions.length === 0
    ) {
        throw ApiError.badRequest("Ingredients and instructions are required");
    }

    const recipeImages = req.files.map((file) => file.path);


    if (!recipeImages || recipeImages.length === 0) {
        throw ApiError.notFound("recipeImage files are missing");
    }

    let recipeImagesUrl = [];

    for (const imagePath of recipeImages) {

        const cloudinaryUrl = await uploadOnCloudinary(imagePath);

        if (!cloudinaryUrl?.secure_url) {
            throw ApiError.serverError("Error while uploading on cloudinary");
        }

        recipeImagesUrl.push(cloudinaryUrl.secure_url);
    }

    const user = await User.findById(req.user?._id).select(" username avatar recipeCount");

    if (!user) {
        throw ApiError.notFound("user not found");
    }

    const recipe = await Recipe.create({
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        difficulty,
        category,
        subCategory,
        image: recipeImagesUrl,
        createdBy: req.user?._id
    });

    if (!recipe) {
        throw ApiError.serverError("Something went wrong while adding recipe");
    }

    user.recipeCount = user.recipeCount + 1;

    await user.save({ validateBeforeSave: false });

    return res.status(201).json(
        ApiResponse.created({
            user: user,
            recipe: recipe
        }, "recipe added successfully")
    );

});

const updateRecipe = asyncHandler(async (req, res) => {

    const { title, description, cookingTime, difficulty, category, subCategory } = req.body;

    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);


    if (recipe.createdBy.toString() !== req.user?._id.toString()) {
        throw ApiError.forbidden("you can not update someone elses recipe");
    }

    for (let field in req.body) {

        if (field && (req.body[field]).length > 0) {
            recipe.field = req.body[field];
            continue;
        }

        if (req.body[field]) {

            recipe[field] = req.body[field];
        }
    }

    await recipe.save({ validateBeforeSave: false });

    res.status(200).json(
        ApiResponse.okResponse({
            recipe: recipe
        }, "recipe updated successfully")
    );

});

const updateRecipeImages = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;

    const recipeImages = req.files.map((file) => file.path);

    if (!recipeImages || recipeImages.length === 0) {
        throw ApiError.notFound("recipeImage files are missing");
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
        throw ApiError.notFound("Recipe not found");
    }

    if (recipe.createdBy.toString() !== req.user?._id.toString()) {
        throw ApiError.forbidden("you can not update someone elses recipe");
    }

    for (const imageUrl of recipe.image) {
        await unlinkOnCloudinary(imageUrl);
    }

    let recipeImagesUrl = [];

    for (const imagePath of recipeImages) {

        const cloudinaryUrl = await uploadOnCloudinary(imagePath);

        if (!cloudinaryUrl?.secure_url) {
            throw ApiError.serverError("Error while uploading on cloudinary");
        }

        recipeImagesUrl.push(cloudinaryUrl.secure_url);
    }

    recipe.image = recipeImagesUrl;

    await recipe.save({ validateBeforeSave: false });


    return res.status(200).json(
        ApiResponse.okResponse({
            recipe: recipe
        }, "recipe images update successfully")
    );

});

const deleteRecipe = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;

    const user = await User.findById(req.user?._id).select("username avatar recipeCount");

    if (!user) {
        throw ApiError.notFound("user not found");
    }

    const deletedRecipe = await Recipe.findOneAndDelete({
        _id: recipeId,
        createdBy: req.user?._id
    });

    if (!deletedRecipe) {
        throw ApiError.notFound("Recipe not found or you are not authorized");
    }

    for (const imageUrl of deletedRecipe.image) {
        await unlinkOnCloudinary(imageUrl);
    }

    user.recipeCount = user.recipeCount - 1;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        ApiResponse.okResponse({}, "recipe deleted successfully")
    );

});

const saveRecipe = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;
    const userId = req.user?._id;

    const recipe = await Recipe.findById(recipeId).select("title slug image");

    if (!recipe) {
        throw ApiError.notFound("Recipe not found");
    }

    const user = await User.findById(userId).select("savedRecipes");

    if (!user) {
        throw ApiError.notFound("user not found");
    }

    if (user.savedRecipes.includes(recipeId)) {
        throw ApiError.badRequest("Recipe already saved");
    }

    user.savedRecipes.push(recipeId);

    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        ApiResponse.okResponse({
            savedRecipe: recipe
        }, "Recipe is saved successfully"
        )
    );

});

const unsaveRecipe = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;
    const userId = req.user?._id;

    const recipe = await Recipe.findById(recipeId).select("title slug image");

    if (!recipe) {
        throw ApiError.notFound("Recipe not found");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull: { savedRecipes: recipeId }
        },
        {
            returnDocument: "after"
        }
    )

    if (!user) {
        throw ApiError.serverError("Something went wrong while unsaving recipe");
    }

    res.status(200).json(
        ApiResponse.okResponse({}, "Recipe is unsaved successfully"
        )
    );

});

module.exports = {
    GetSingleRecipe,
    GetRecipes,
    addRecipe,
    updateRecipe,
    updateRecipeImages,
    deleteRecipe,
    saveRecipe,
    unsaveRecipe
}