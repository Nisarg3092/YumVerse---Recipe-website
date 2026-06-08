const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    image: {
        type: String
    }

}, { timestamps: true });

const Category = model("Category", categorySchema);

module.exports = Category;