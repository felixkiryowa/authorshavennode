import UserController from '../../controllers/user';
import validateUserRegisteration from '../../../validations/register';
import validateUserLogin from '../../../validations/login';

import express from 'express';
import  passport from 'passport';
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
    UserController.create
);

// @route POST /api/user/login
// @desc Test register user
// @access  Public

router.post('/login', 
    validateUserLogin.validate(),
    UserController.loginUser
);

// @route POST /api/user/oauth/facebook
// @desc Test register user
// @access  Public

router.post('/oauth/facebook',
    passport.authenticate('facebookToken', {
        session: false
    }),
    UserController.facebookOAuth,
);




// @route POST /api/user/password-reset
// @desc Test register user
// @access  Public

router.post('/password-reset',
    validateUserRegisteration.validate(),
    UserController.passwordReset
);

// @route POST /api/user/password-reset
// @desc Test register user
// @access  Public

router.post('/password-reset-request/:token',
    validateUserRegisteration.validate(),
    UserController.passwordResetRequest
);

// @route POST /api/user/verify-user-account
// @desc Test register user
// @access  Public

router.get('/verify-user-account/:token',
    UserController.verifyUser
);

// Test protected route
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});



export default router;
