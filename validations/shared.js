const { validationResult } = require('express-validator');


module.exports = {
    validate(res, req){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
        } catch (error) {
            return next(err)
        }
    }
}

