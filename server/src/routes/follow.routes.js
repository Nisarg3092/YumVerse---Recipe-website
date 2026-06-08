const Router = require('express');
const jwtVerify = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    getUserFollowings,
    followUser,
    unfollowUser
} = require('../controllers/follow.controller');
const { userIdSchema } = require('../validators/params.validator');

const router = Router();


router.use(jwtVerify);

router.route("/:userId")
    .all(validate(userIdSchema, "params"))
    .get(getUserFollowings)
    .post(followUser)
    .delete(unfollowUser);

module.exports = router;