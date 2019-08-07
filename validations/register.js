const { check } = require('express-validator');

module.exports = {
   validate(){
      
        return [
            check('username', 'userName doesn\'t exists ').exists(),
            check('email', 'Invalid email').exists().isEmail().normalizeEmail(),
            check('password').exists(),
        ]    
    }
}
