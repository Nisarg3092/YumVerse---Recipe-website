const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    likeRecipe,
    unlikeRecipe
} = require('../controllers/like.controller');
const { recipeIdSchema } = require('../validators/params.validator');

const router = Router();


router.use(jwtVerify);

router.route("/:recipeId")
    .all(validate(recipeIdSchema, "params"))
    .post(likeRecipe)
    .delete(unlikeRecipe);

module.exports = router;