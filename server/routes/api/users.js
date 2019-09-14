import UserController from '../../controllers/user';
import validateUserRegisteration from '../../../validations/register';
import validateUserLogin from '../../../validations/login';

import express from 'express';
import  passport from '../../../config/passport';
import Social from '../../controllers/social';
const router = express.Router();

 router.get('/', (req, res) =>  {
     res.render('index.ejs'); // load the index.ejs file
 });

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

// @route POST /api/user/oauth/twitter
// @desc Test register user
// @access  Public

router.get('/auth/twitter', passport.authenticate('twitter', {
    scope: ['email', 'profile']
}));

// @route POST /api/user/oauth/twitter
// @desc Test register user
// @access  Public

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  Social.login);

// @route GET /api/user/oauth/google
// @desc Test register user
// @access  Private

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// @route GET /api/user/auth/google/callback'
// @desc Test register user
// @access  Private

router.get('/auth/google/callback', passport.authenticate('google', {
    session: false
}), Social.login);

// @route GET /api/user/auth/facebook
// @desc Test register user
// @access  Private
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile',
        'email'
    ]
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    session: false,
}), Social.login);






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
