const Like = require("../models/like.model");
const Recipe = require("../models/recipe.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const likeRecipe = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;

    const alreadyLiked = await Like.findOne({
        likedBy: req.user._id,
        recipe: recipeId
    });

    if (alreadyLiked) {
        throw ApiError.conflict("Recipe already liked");
    }

    const recipe = await Recipe.findById(recipeId).select("likesCount");

    
    const newLike = await Like.create({
        likedBy: req.user._id,
        recipe: recipeId
    });    

    recipe.likesCount += 1;

   await recipe.save({validateBeforeSave: false});

    return res.status(201).json(
        ApiResponse.created({
            isLiked: true,
            likesCount: recipe.likesCount
        }, "Recipe liked successfully")
    );

});

const unlikeRecipe = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId).select("likesCount");

    if(!recipe) {
        throw ApiError.notFound("Recipe not found");
    }

    const unlike = await Like.findOneAndDelete({
        likedBy: req.user?._id,
        recipe: recipeId
    });

    if(unlike) {
        recipe.likesCount = Math.max(0, recipe.likesCount - 1);
    }
    
    await recipe.save({validateBeforeSave: false});

    return res.status(200).json(
        ApiResponse.okResponse(
            {
                isLiked: false,
                likesCount: recipe.likesCount
            }, "Recipe unliked successfully"
        )
    );

});

module.exports = {
    likeRecipe,
    unlikeRecipe
};