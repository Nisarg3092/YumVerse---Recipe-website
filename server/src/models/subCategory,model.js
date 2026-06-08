const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }

}, { timestamps: true });

const SubCategory = model("SubCategory", categorySchema);

module.exports = SubCategory;