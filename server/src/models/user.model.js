const { model, Schema } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { FEMALE_AVATAR, MALE_AVATAR } = require('../constant');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    avatar: {
        type: String, // cloudinary url
        default: MALE_AVATAR 
     // default: FEMALE_AVATAR
    },

    bio: {
        type: String,
        maxlength: 200
    },

    savedRecipes: [{
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    }],

    refreshToken: {
        type: String
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    },

    recipeCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.passwordCheck = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
}

const User = model("User", userSchema);

module.exports = User;
