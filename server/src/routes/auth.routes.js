const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    refreshAccessToken,
    logoutUser
} = require('../controllers/auth.controller');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validators/auth.validator');
const { authLimiter } = require("../middlewares/rateLimiter.middleware");

const router = Router();


router.route('/register')
    .post(
        authLimiter,
        validate(registerSchema),
        registerUser
    );

router.route('/login')
    .post(
        authLimiter,
        validate(loginSchema),
        loginUser
    );

router.route('/forgot-password')
    .post(
        authLimiter,
        validate(forgotPasswordSchema),
        forgetPassword
    );

router.route('/reset-password/:token')
    .post(
        authLimiter,
        validate(resetPasswordSchema),
        resetPassword
    );

router.route('/refresh-token')
    .post(refreshAccessToken);

router.route('/logout')
    .post(jwtVerify, logoutUser);

module.exports = router;
