const { check, validationResult } = require('express-validator');
const userController = require('../../controllers/user');
const validateUserRegisteration = require('../../../validations/register');
const validateUserLogin = require('../../../validations/login');

const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route GET /api/user/test
// @desc Test user route
// @access  Public
router.get('/test', (req, res) => res.json({ message: "Users Routes Works" }));

// @route POST /api/user/register
// @desc Test register user
// @access  Public

router.post('/register',
    validateUserRegisteration.validate(),
    userController.create
);

// @route POST /api/user/login
// @desc Test register user
// @access  Public

router.post('/login', 
    validateUserLogin.validate(),
    userController.loginUser
);

// Test protected route
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});



module.exports = router;
