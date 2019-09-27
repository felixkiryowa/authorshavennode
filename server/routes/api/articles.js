import ArticlesController from '../../controllers/articles';
import multer from 'multer';
// import Util from '../../utils/utils';
// import validateUserLogin from '../../../validations/login';

import express from 'express';
import Util from '../../utils/utils';
import passport from '../../../config/passport';
import path from 'path'
const router = express.Router();
var upload = multer({
    storage: multer.diskStorage({}),
    fileSize: 1 * 1024 * 1024,
});

// @route POST /api/article/create
// @desc Create User Profile
// @access  Private

router.post('/article/create', upload.single('articleImage'), passport.authenticate('jwt', {
        session: false
    }),
    ArticlesController.createArticle
);

// @route GET /api/article/:slug
// @desc Get a single article
// @access  Private
router.get('/article/:slug', passport.authenticate('jwt', {
    session: true
    }),
    ArticlesController.getAnArticle
);

export default router;
