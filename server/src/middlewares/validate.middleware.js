const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => (req, res, next) => {

    const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true
    });

    if (!error) {
        req[source] = value;
        return next();
    }

    return next(
        ApiError.badRequest(
            error.details[0].message.replace(/["]/g, ""),
            error.details.map((err) => ({
                field: err.path.join("."),
                message: err.message.replace(/["]/g, "")
            }))
        )
    );
};

module.exports = validate;