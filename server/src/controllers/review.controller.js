const mongoose = require("mongoose");
const Review = require("../models/review.model");
const Recipe = require("../models/recipe.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const getReviews = asyncHandler(async (req, res) => {

    const { recipeId } = req.params;
    const {
        page = 1,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const currentPage = Number(page);
    const rating = Number(req.query.rating);

    if (isNaN(currentPage) || currentPage < 1) {
        throw ApiError.badRequest("Invalid page number");
    }

    let order = -1;

    if ("asc" === sortOrder.toLowerCase()) {
        order = 1
    }

    const matchQuery = {
        recipe: new mongoose.Types.ObjectId(recipeId)
    }

    if (req.query.rating !== undefined) {
        if ((isNaN(rating) || rating < 0 || rating > 5)) {
            throw ApiError.badRequest("Invalid rating");
        }

        matchQuery.rating = rating;
    }

    const recipe = await Recipe.findById(recipeId).select("title averageRating");

    if (!recipe) {
        throw ApiError.notFound("recipe not found");
    }

    const recipeReviews = await Review.aggregate([
        {
            $match: matchQuery
        },
        {
            $facet: {
                totalReviews: [{
                    $count: "reviewCount"
                }],
                reviews: [
                    {
                        $sort: {
                            [sortBy]: order
                        }
                    },
                    {
                        $skip: ((currentPage - 1) * 10)
                    },
                    {
                        $limit: 10
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
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
                        $addFields: {
                            user: {
                                $first: "$user"
                            }
                        }
                    },
                    {
                        $project: {
                            rating: 1,
                            comment: 1,
                            createdAt: 1,
                            user: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalReviews: {
                    $first: "$totalReviews.reviewCount"
                }
            }
        }
    ]);

    const totalReviews = recipeReviews?.[0]?.totalReviews || 0;

    return res.status(200).json(
        ApiResponse.okResponse({
            recipe: recipe,
            totalReviews: totalReviews,
            reviews: recipeReviews?.[0]?.reviews,
            currentPage: currentPage,
            totalPages:Math.max(1, Math.ceil(totalReviews / 10))
        }, "Recipe reviews fetched successfully")
    );

});

const addReview = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId).select("title slug averageRating reviewCount");

    if (!recipe) {
        throw ApiError.notFound("recipe not found");
    }

    const reviewAlreadyExist = await Review.findOne({
        recipe: recipeId,
        user: req.user?._id
    });

    if (reviewAlreadyExist) {
        throw ApiError.conflict("User already wrote a review");
    }

    const newReview = await Review.create({
        recipe: recipeId,
        user: req.user?._id,
        rating,
        comment
    });

    if (!newReview) {
        throw ApiError.serverError("Something went wrong while adding review");
    }

    const oldAverage = recipe.averageRating;
    const oldCount = recipe.reviewCount;

    const newCount = oldCount + 1;

    const newAverage =
        ((oldAverage * oldCount) + rating) / newCount;

    recipe.averageRating = Number(newAverage.toFixed(1));
    recipe.reviewCount = newCount;

    await recipe.save({ validateBeforeSave: false });

    return res.status(201).json(
        ApiResponse.created(
            {
                review: newReview,
                recipe: recipe
            },
            "Review added successfully"
        )
    );

});

const updateReview = asyncHandler(async (req, res) => {

    const { rating: newRating, comment } = req.body;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw ApiError.notFound("review not found");
    }

    if (review.user.toString() !== req.user?._id.toString()) {
        throw ApiError.forbidden("You can only update your own review");
    }

    if (newRating !== undefined) {

        const recipe = await Recipe.findById(review.recipe).select("title slug averageRating reviewCount");

        if (!recipe) {
            throw ApiError.notFound("recipe not found");
        }

        const oldAverage = recipe.averageRating;
        const reviewCount = recipe.reviewCount;
        const oldRating = review.rating;

        const newAverage =
            ((oldAverage * reviewCount) - oldRating + newRating)
            / reviewCount;

        recipe.averageRating = Number(newAverage.toFixed(1));

        await recipe.save({ validateBeforeSave: false });

        review.rating = newRating;
    }

    if (comment?.trim()) {
        review.comment = comment;
    }

    await review.save({ validateBeforeSave: false });

    return res.status(200).json(
        ApiResponse.okResponse({
            review: review
        },"Review updated successfully"
        )
    );

});

const deleteReview = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;

    if (!reviewId) {
        throw ApiError.notFound("reviewId not found");
    }

    const reviewToDelete = await Review.findById(reviewId);

    if (!reviewToDelete) {
        throw ApiError.notFound("review not found");
    }

    if (reviewToDelete.user.toString() !== req.user?._id.toString()) {
        throw ApiError.forbidden("You can only delete your own review");
    }

    const recipe = await Recipe.findById(reviewToDelete.recipe);

    if (!recipe) {
        throw ApiError.notFound("recipe not found");
    }

    const oldAverage = recipe.averageRating;
    const oldCount = recipe.reviewCount;

    const newCount = oldCount - 1;

    let newAverage = 0;

    if (newCount > 0) {

        newAverage =
            ((oldAverage * oldCount) - reviewToDelete.rating)
            / newCount;

        newAverage = Number(newAverage.toFixed(1));
    }

    recipe.averageRating = newAverage;
    recipe.reviewCount = newCount;

    await recipe.save({ validateBeforeSave: false });

    await reviewToDelete.deleteOne();

    return res.status(200).json(
        ApiResponse.okResponse({}, "Review deleted successfully")
    );

});

module.exports = {
    getReviews,
    addReview,
    updateReview,
    deleteReview
}