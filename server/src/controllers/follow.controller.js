const mongoose = require("mongoose");
const Follow = require("../models/follow.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const getUserFollowings = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const followings = await Follow.aggregate([
        {
            $match: {
                follower: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "following"
            }
        },
        {
            $addFields: {
                following: {
                    $first: "$following.username"
                }
            }
        },
        {
            $project: {
                following: 1,
                createdAt: 1
            }
        }
    ]);


    return res.status(200).json(
        ApiResponse.okResponse({
            followings: followings
        }, "followings fetched successfully")
    );

});

const followUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
        throw ApiError.badRequest("You cannot follow yourself");
    }
    const alreadyFollowed = await Follow.findOne({
        follower: req.user._id,
        following: userId
    });

    if (alreadyFollowed) {
        throw ApiError.conflict("Already following this user");
    }

    const newFollower = await Follow.create({
        follower: req.user?._id,
        following: userId
    });

    return res.status(201).json(
        ApiResponse.created({
            isFollowed: true,
            newFollower: newFollower
        }, "user follow successfully")
    );

});

const unfollowUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
        throw ApiError.badRequest("you cannot unfollow yourself")
    }

    const unfollowedUser = await Follow.findOneAndDelete({
        follower: req.user?._id,
        following: userId
    });

    if (!unfollowedUser) {
        throw ApiError.serverError("Something went wrong while unfollowing user");
    }

    return res.status(200).json(
        ApiResponse.okResponse({ 
            isFollowed : false
        }, "User unfollowed successfully"
        )
    );

});

module.exports = {
    getUserFollowings,
    followUser,
    unfollowUser
};