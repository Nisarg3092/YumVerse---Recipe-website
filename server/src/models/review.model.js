const { model, Schema } = require('mongoose');

const reviewSchema = new Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

const Review = model("Review",reviewSchema);

module.exports = Review;