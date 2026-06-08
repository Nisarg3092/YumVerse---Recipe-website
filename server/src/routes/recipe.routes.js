const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const upload = require('../middlewares/fileUpload.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    GetSingleRecipe,
    GetRecipes,
    addRecipe,
    updateRecipe,
    updateRecipeImages,
    deleteRecipe,
    saveRecipe,
    unsaveRecipe
} = require('../controllers/recipe.controller');
const {
    addRecipeSchema,
    updateRecipeSchema
} = require('../validators/recipe.validator');
const { recipeIdSchema } = require('../validators/params.validator');
const { recipeLimiter } = require("../middlewares/rateLimiter.middleware");

const router = Router();


router.route("/:slug")
    .get(GetSingleRecipe);

router.route("/")
    .get(GetRecipes)
    .post(
        jwtVerify,
        recipeLimiter,
        upload.array("recipeImages", 5),
        validate(addRecipeSchema),
        addRecipe
    );

router.route("/id/:recipeId")
    .all(
        jwtVerify,
        validate(recipeIdSchema, "params")
    )
    .patch(
        validate(updateRecipeSchema),
        updateRecipe
    )
    .delete(deleteRecipe);

router.route("/id/:recipeId/images")
    .patch(
        jwtVerify,
        validate(recipeIdSchema, "params"),
        upload.array("recipeImages", 5),
        updateRecipeImages
    )

router.route("/id/:recipeId/save")
    .all(
        jwtVerify,
        validate(recipeIdSchema, "params"),
    )
    .post(saveRecipe)
    .delete(unsaveRecipe)


module.exports = router;
