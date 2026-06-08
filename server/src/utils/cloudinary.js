const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const ApiError = require('./ApiError');
const { MALE_AVATAR, FEMALE_AVATAR } = require('../constant');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getPublicId = (url) => {

    const urlParts = url.split("/");

    const public_id = urlParts[urlParts.length - 1];

    return public_id.split(".")[0];
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return ApiError.badRequest("Invalid Localfile path");
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        return ApiError.serverError("Something wents wrong while uploading file on cloudinary");
    }
}

const unlinkOnCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl || cloudinaryUrl === MALE_AVATAR || cloudinaryUrl === FEMALE_AVATAR) {
            return null;
        }

        const public_id = getPublicId(cloudinaryUrl);

        const response = await cloudinary.uploader.destroy(public_id);

        return response;
    } catch (error) {
        throw ApiError.serverError("Something wents wrong while unlinking file on cloudinary");
    }
}

module.exports = { uploadOnCloudinary, unlinkOnCloudinary };