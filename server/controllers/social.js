/* eslint-disable require-jsdoc */
import Helper from '../helpers/helper.functions';
import SocialAuthHelper from '../helpers/helper.social.auth';
// import verifyUser from '../helpers/verification-email';
const User = require('../models/').User

let data;

/**
 *
 *
 * @class Social
 */
class Social {
    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {Object} returns access token and user information
     * @memberof Social
     */
    static  login(req, res) {
        // console.log('GIVEN USER....', req.user);
        data = req.user;
        if(data.provider === 'facebook'){
            SocialAuthHelper.handleFacebookLogin(data, req, res)

        }else if(data.provider === 'twitter') {
            SocialAuthHelper.handleTwitterLogin(data, req, res);
        }else {
            SocialAuthHelper.handleGoogleLogin(data, req, res);
        }
    }

    /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {Object} returns new user
     * @memberof Social
     */
    static async signup(req, res) {
        console.log('SIGN UP USER .......', req.user);
        const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
        const lastname = data.name ? data.name.middleName || data.name.familyName : data.displayName.split(' ')[1];
        const email = data.emails ? data.emails[0].value : req.body.email || req.query.email;
        const username = `${firstname}.${lastname}`;
        const hasspassword = Helper.hashPassword('password');
        const dbSchema = {
            firstname,
            lastname,
            email,
            username,
            password: hasspassword
        };
        const createdUser = await User.addUser(dbSchema);
        const payload = {
            email: createdUser.email,
            role: createdUser.role,
            verified: createdUser.verified
        };
        const token = Helper.generateToken(payload);
        const verifyUrl = `${process.env.BACKEND_URL}/api/${
      process.env.API_VERSION
    }/users/verify?token=${token}`;
        verifyUser(payload.email, createdUser.username, verifyUrl);
        return res.status(201).json({
            status: 201,
            message: 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it. Your default password is password, Please change on activatio',
            data: {
                firstname: createdUser.firstname,
                lastname: createdUser.lastname,
                email: createdUser.email,
                username: createdUser.username,
                role: createdUser.role,
            },
            token,
        });
    }
}

export default Social;
