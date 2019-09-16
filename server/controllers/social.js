/* eslint-disable require-jsdoc */
import SocialAuthHelper from '../helpers/helper.social.auth';

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
        data = req.user;
        if(data.provider === 'facebook'){
            SocialAuthHelper.handleFacebookLogin(data, req, res)
        }else if(data.provider === 'twitter') {
            SocialAuthHelper.handleTwitterLogin(data, req, res);
        }else {
            SocialAuthHelper.handleGoogleLogin(data, req, res);
        }
    }
}

export default Social;
