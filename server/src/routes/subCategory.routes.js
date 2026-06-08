const Router = require('express');
const validate = require('../middlewares/validate.middleware');

const { getSubCategories } = require('../controllers/subCategory.controller');
const { categoryIdSchema } = require('../validators/params.validator');

const router = Router();


router.route("/:categoryId")
    .get(validate(categoryIdSchema, "params"), getSubCategories);

module.exports = router;