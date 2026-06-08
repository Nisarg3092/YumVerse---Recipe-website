const { model, Schema } = require('mongoose');
const slugify = require("slugify");

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },

    ingredients: {
        type: [String],
        required: true
    },

    instructions: {
        type: [String],
        required: true
    },

    cookingTime: {
        type: Number,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    image: {
        type: [String],
        required: true
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    averageRating: {
        type: Number,
        default: 0
    },

    slug: {
        type: String,
        unique: true
    },

    likesCount: {
        type: Number,
        default: 0
    },

    reviewCount: {
         type: Number,
        default: 0
    }

}, { timestamps: true });

recipeSchema.pre("save", async function () {

    if (!this.isModified("title")) return;

    const baseSlug = slugify(this.title, {
        lower: true,
        strict: true
    });

    let slug = baseSlug;
    let count = 1;

    while (await this.constructor.exists({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

recipeSchema.index({
    title: "text",
    description: "text"
});


const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
