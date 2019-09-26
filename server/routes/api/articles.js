import ArticlesController from '../../controllers/articles';
import multer from 'multer';
// import Util from '../../utils/utils';
// import validateUserLogin from '../../../validations/login';

import express from 'express';
import Util from '../../utils/utils';
import passport from '../../../config/passport';
const router = express.Router();
var upload = multer({
    dest: '../../../uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' || file.mimetype !== 'image/jpeg') {
            req.fileValidationError = 'File type should be a png, jpeg ';
            return cb(new Error('File is not supported'), false);
        } else {
            return cb(null, true);
        }
    }
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
