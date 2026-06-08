const Router = require('express');
const { getCategories } = require('../controllers/category.controller');

const router = Router();


router.route("/")
    .get(getCategories);

module.exports = router;