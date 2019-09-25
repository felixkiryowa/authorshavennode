import UserProfileController from '../../controllers/profiles';
// import validateUserLogin from '../../../validations/login';

import express from 'express';
import passport from '../../../config/passport';
const router = express.Router();

// @route PUT /api/user/username
// @desc Test update user profile
// @access  Private

router.put('/users/:username', passport.authenticate('jwt', { session: false }),
   UserProfileController.updateProfile
);

// @route GET /api/user/username
// @desc Test register user
// @access  Public
router.get('/users/:username',
    UserProfileController.getAUserProfile
);

export default router;
