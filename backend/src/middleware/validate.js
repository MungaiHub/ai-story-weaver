const { validationResult } = require('express-validator');

/**
 * Express middleware that checks express-validator results and short-circuits
 * with 422 + a structured error body if any validation rule failed.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

module.exports = validate;
