const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error.middleware');
const {apiLimiter} = require('./middlewares/rateLimiter.middleware');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const subCategoryRoutes = require('./routes/subCategory.routes');
const recipeRoutes = require('./routes/recipe.routes');
const likeRoutes = require('./routes/like.routes');
const followRoutes = require('./routes/follow.routes');
const reviewRoutes = require('./routes/review.routes');

app.set("trust proxy", 1);
app.use("/api/v1", apiLimiter);

app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

app.get("/api/v1", (req, res) => {
    res.json({
        message: "These are Recipe APIs",
        apiHealth: "Good",
        apiVersion: "V1.0.0",
    });
});

//routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use(errorHandler);

module.exports = app;
