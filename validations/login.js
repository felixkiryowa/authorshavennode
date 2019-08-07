const {
    body
} = require('express-validator');

module.exports = {
    validate() {
        return [
            body('email', 'Email is required').exists().normalizeEmail(),
            body('email', 'Invalid email').isEmail(),
            body('password').exists(),
        ]
    }
}
