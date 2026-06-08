const mongoose = require("mongoose");
const { OPTION, USER_SAFE_FIELDS } = require("../constant");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary, unlinkOnCloudinary } = require("../utils/cloudinary");


const getUserProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;

    if (!username) {
        throw ApiError.badRequest("username is missing");
    }

    const currentUserId = req.user?._id
        ? new mongoose.Types.ObjectId(req.user._id)
        : null;

    const userProfile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "followings"
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers"
            }
        },
        {
            $addFields: {
                followerCount: {
                    $size: "$followers"
                },
                followingCount: {
                    $size: "$followings"
                },
                isFollowing: {
                    $in: [currentUserId, "$followers.follower"]
                },
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                bio: 1,
                createdAt: 1,
                followerCount: 1,
                followingCount: 1,
                isFollowing: 1,
                recipeCount: 1
            }
        }
    ]);

    if (!userProfile?.length) {
        throw ApiError.notFound("user profile does not exists");
    }

    return res.status(200).json(
        ApiResponse.okResponse({
            userProfile: userProfile[0]
        }, "user Profile fetched successfully")
    )

});

const getUserRecipes = asyncHandler(async (req, res) => {

    const { username } = req.params;

    if (!username) {
        throw ApiError.badRequest("username is missing");
    }

    const userRecipes = await User.aggregate([
        { $match: { username: username?.toLowerCase() } },
        {
            $lookup: {
                from: "recipes",
                localField: "_id",
                foreignField: "createdBy",
                as: "recipes",
                pipeline: [
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
                            title: 1,
                            description: 1,
                            cookingTime: 1,
                            difficulty: 1,
                            category: 1,
                            subCategory: 1,
                            image: 1,
                            averageRating: 1,
                            slug: 1,
                            createdAt: 1,
                            likesCount: 1,
                            reviewCount: 1

                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    _id: "$_id",
                    username: "$username",
                    avatar: "$avatar",
                    bio: "$bio",
                    createdAt: "$createdAt"
                }
            }
        },
        {
            $project: {
                _id: false,
                user: 1,
                recipes: 1,
                recipeCount: 1
            }
        }
    ]);

    if (!userRecipes?.length) {
        throw ApiError.notFound("user Recipes not exsist");
    }

    return res.status(200).json(
        ApiResponse.okResponse({
            userProfile: userRecipes[0]
        }, "user Recipes fetched successfuly")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.passwordCheck(currentPassword);

    if (!isPasswordValid) {
        throw ApiError.badRequest("Invalid current password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        ApiResponse.okResponse({}, "Password chnaged successfully")
    )

});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { username, bio } = req.body;

    if (!bio && username === req.user.username) {
        return res.status(200).json(
            ApiResponse.okResponse({}, "Nothing to update")
        );
    }

    let updatedField = {};

    if (username) {
        const checkUsername = await User.findOne({
            username,
            $ne: { _id: req.user._id }

        });

        if (checkUsername) {
            throw ApiError.conflict("Username already exist");
        }

        updatedField.username = username;
    }

    if (bio) {
        updatedField.bio = bio;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updatedField
        },
        {
            returnDocument: "after"
        }
    ).select(USER_SAFE_FIELDS);

    if (!updatedUser) {
        throw ApiError.serverError("something went wrong while updating user");
    }

    return res.status(200).json(
        ApiResponse.okResponse({
            updatedUser: updatedUser
        }, "User data updated successfuly")
    );

});

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw ApiError.notFound("Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.secure_url) {
        throw ApiError.serverError("Error while uploading on cloudinary");
    }

    const user = await User.findById(req.user?._id).select("avatar");

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    const oldAvatarUrl = user.avatar;

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.secure_url
            }
        },
        {
            returnDocument: "after"
        }
    ).select(USER_SAFE_FIELDS);

    if (!updatedUser) {
        throw ApiError.serverError("something went wrong while updating user");
    }

    await unlinkOnCloudinary(oldAvatarUrl);

    return res.status(200).json(
        ApiResponse.okResponse({
            updatedUser: updatedUser
        }, "Avatar image updated successfully")
    );

});

const getSavedRecipes = asyncHandler(async (req, res) => {

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

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "recipes",
                localField: "savedRecipes",
                foreignField: "_id",
                as: "savedRecipes",
                pipeline: [
                    {
                        $match: matchQuery
                    },
                    {
                        $facet: {
                            totalRecipes: [{
                                $count: "totalRecipes"
                            }],
                            recipes: [
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
                                        category: {
                                            $first: "$category.name"
                                        },
                                        subCategory: {
                                            $first: "$subCategory.name"
                                        },
                                        createdBy: {
                                            $first: "$createdBy"
                                        },
                                        image: {
                                            $first: "$image"
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        title: 1,
                                        description: 1,
                                        cookingTime: 1,
                                        difficulty: 1,
                                        category: 1,
                                        subCategory: 1,
                                        image: 1,
                                        createdBy: 1,
                                        averageRating: 1,
                                        slug: 1,
                                        createdAt: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            totalRecipes: {
                                $first: "$totalRecipes.totalRecipes"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                savedRecipes: {
                    $first: "$savedRecipes"
                }
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                bio: 1,
                savedRecipes: 1
            }
        }
    ]);

    const totalRecipes = user?.[0].savedRecipes?.totalRecipes || 0;

    return res.status(200).json(
        ApiResponse.okResponse({
            username: user?.[0].username,
            avatar: user?.[0].avatar,
            bio: user?.[0].bio,
            totalRecipes: totalRecipes,
            totalPage: Math.max(1, Math.ceil(totalRecipes / 10)),
            savedRecipes: user?.[0].savedRecipes.recipes,
            currentPage: currentPage
        }, "saved recipe fatch successfuly")
    );

});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200)
        .json(
            ApiResponse.okResponse({
                user: req.user
            }, "User fetched successfully")
        );

});

module.exports = {
    getUserProfile,
    getUserRecipes,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getSavedRecipes,
    getCurrentUser
}