const { OPTION, USER_SAFE_FIELDS, MALE_AVATAR, FEMALE_AVATAR } = require("../constant");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const resetPasswordTemplate = require("../template/resetPassword.template")


const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw ApiError.serverError("something wents wrong while generating access and refresh tokens \n", error);
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { password, } = req.body;
    const email = req.body.email.trim().toLowerCase();
    const username = req.body.username.trim().toLowerCase();
    const avatar = req.body.avatar.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw ApiError.conflict("User with email or username already exists");
    }

    // const query = { email, username, password };

    // const avatarLocalPath = req.files?.avatar[0]?.path;

    // let avatar;
    // if (avatarLocalPath) {
    //     avatar = await uploadOnCloudinary(avatarLocalPath);

    //     if (!avatar) {
    //         throw ApiError.serverError("Failed to upload avatar");
    //     }

    //     query.avatar = avatar.secure_url;
    // }

    let avatarUri;

    if (avatar === "male") {

        avatarUri = MALE_AVATAR;
    } else {
        avatarUri = FEMALE_AVATAR;

    }


    const user = await User.create({
        email,
        username,
        password,
        avatar: avatarUri
    });

    const createdUser = await User.findById(user._id).select(USER_SAFE_FIELDS);

    if (!createdUser) {
        throw ApiError.serverError("Something went wrong while registering the user");
    }

    return res.status(201).json(
        ApiResponse.created({
            createdUser: createdUser
        }, "User registered Successfully")
    );

});

const loginUser = asyncHandler(async (req, res) => {

    const { password } = req.body;
    const email = req.body.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
        throw ApiError.notFound("User does not exist");
    }

    const isPasswordValid = await user.passwordCheck(password);

    if (!isPasswordValid) {
        throw ApiError.unauthorised("Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(USER_SAFE_FIELDS);

    return res.status(200)
        .cookie("accessToken", accessToken, OPTION)
        .cookie("refreshToken", refreshToken, OPTION)
        .json(
            ApiResponse.okResponse({
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "User logged In Successfully")
        )


});

const forgetPassword = asyncHandler(async (req, res) => {

    const { email } = req.body.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json(
            ApiResponse.okResponse({}, "If an account exists, a reset link has been sent.")
        )
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const { subject, emailHtml } = resetPasswordTemplate(resetToken, user.username);

    await sendMail(email, subject, emailHtml);

    return res.status(200).json(
        ApiResponse.okResponse({}, "If an account exists, a reset link has been sent.")
    )

});

const resetPassword = asyncHandler(async (req, res) => {

    const { password, confirmPassword } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw ApiError.badRequest("Invalid or expired reset password link");
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.password = password;

    await user.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(USER_SAFE_FIELDS);

    return res.status(200)
        .cookie("accessToken", accessToken, OPTION)
        .cookie("refreshToken", refreshToken, OPTION)
        .json(
            ApiResponse.okResponse({
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "password reset successfuly")
        )

});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw ApiError.unauthorised("refresh token not found");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user || user?.refreshToken !== incomingRefreshToken) {
            throw ApiError.unauthorised("invalid or expired refresh token");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, OPTION)
            .cookie("refreshToken", newRefreshToken, OPTION)
            .json(
                ApiResponse.okResponse({
                    accessToken: accessToken,
                    refreshToken: newRefreshToken
                }, "Access token refreshed")
            )

    } catch (error) {
        throw ApiError.unauthorised(error?.message || "Invalid refresh token");
    }

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
                resetPasswordToken: 1,
                resetPasswordExpires: 1
            }
        },
        {
           returnDocument: "after"
        }
    )

    return res.status(200)
        .clearCookie("accessToken", OPTION)
        .clearCookie("refreshToken", OPTION)
        .json(
            ApiResponse.okResponse({}, "User Logged out ")
        );

});

module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    refreshAccessToken,
    logoutUser
}