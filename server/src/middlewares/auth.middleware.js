const jwt = require('jsonwebtoken');
const ApiError = require("../utils/ApiError");
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');

const jwtVerify = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw ApiError.unauthorised("access token not found");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw ApiError.unauthorised("invalid or expired access token");
        }

        req.user = user;

        next();

    } catch (error) {
        throw ApiError.unauthorised(`invalid or expired access token ${error}`);
    }

})

module.exports = jwtVerify;