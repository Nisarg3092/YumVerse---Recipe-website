const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const upload = require('../middlewares/fileUpload.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    getUserProfile,
    getUserRecipes,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getSavedRecipes,
    getCurrentUser
} = require("../controllers/user.controller");
const {
    changePasswordSchema,
    updateAccountSchema
} = require('../validators/user.validator');

const router = Router();


// public routes
router.route("/profile/:username")
    .get(getUserProfile);

router.route("/profile/:username/recipes")
    .get(getUserRecipes);

// protected routes
router.use(jwtVerify);

router.route("/change-password")
    .patch(validate(changePasswordSchema), changeCurrentPassword);

router.route("/update-account")
    .patch(validate(updateAccountSchema), updateAccountDetails);

router.route("/avatar")
    .patch(upload.single('avatar'), updateUserAvatar);

router.route("/saved-recipe")
    .get(getSavedRecipes);

router.route("/current-user")
    .get(getCurrentUser);

module.exports = router;
