const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    getReviews,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/review.controller');
const {
    addReviewSchema,
    updateReviewSchema
} = require('../validators/review.validator');
const {
    reviewIdSchema,
    recipeIdSchema
} = require('../validators/params.validator');
const { reviewLimiter } = require("../middlewares/rateLimiter.middleware");

const router = Router();


router.route("/:recipeId")
    .all(validate(recipeIdSchema, "params"))
    .get(getReviews)
    .post(
        jwtVerify,
        reviewLimiter,
        validate(addReviewSchema),
        addReview
    );

router.route("/id/:reviewId")
    .all(
        jwtVerify,
        validate(reviewIdSchema, "params")
    ).
    patch(
        validate(updateReviewSchema),
        updateReview
    )
    .delete(deleteReview);

module.exports = router;
