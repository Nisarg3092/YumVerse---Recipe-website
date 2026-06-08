const { model, Schema } = require('mongoose');

const likeSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    recipe: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

likeSchema.index(
    {
        likedBy: 1,
        recipe: 1
    },
    {
        unique: true
    }
);

const Like = model("Like", likeSchema);

module.exports = Like;
