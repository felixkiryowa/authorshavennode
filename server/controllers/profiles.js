import models from '../models';
import Util from '../utils/utils';
const util = new Util();

export default class UserProfileController {

    static async updateProfile(req, res) {
         const {
             username
         } = req.params;
        const {
            firstname,
            lastname,
            bio
        } = req.body;
        const usernameFromToken = req.user.username;
        const profile = await models.User.findOne({
            where: {
                username: username,
            }
        });
        try {
           
            if (!profile) {
                util.setError(404, 'User Not Found');
                return util.send(res);
            }else {
                if (username === usernameFromToken) {
                return profile.update({
                        firstname: firstname || profile.firstname,
                        lastname: lastname || profile.lastname,
                        bio: bio || profile.bio
                    }).then(() => {
                        util.setSuccess(200, 'Profile has been successfully updated', profile);
                        return util.send(res);
                    })
                } else {
                    util.setSuccess(200, 'You can not update a profile that does not belong to you', 'success');
                    return util.send(res);
                }
            }
        } catch (err) {
            util.setError(400, err.message);
            return util.send(res);
        }
    }

    static async getAUserProfile(req, res) {
        const { username }  = req.params;
        try {
            const userProfile = await models.User.findOne({
                where: {
                    username
                }
            });
            if (!userProfile) {
                util.setSuccess(200, 'User Not Found', 'success');
                return util.send(res);
            }else {
                const specificUserProfile = {
                    firstname: userProfile.firstname,
                    lastname: userProfile.lastname,
                    bio: userProfile.bio,
                    username: userProfile.username,
                    email: userProfile.email,
                    avarta: userProfile.avarta
                }
                util.setSuccess(200, `${userProfile.username} user profile`, specificUserProfile);
                return util.send(res);
            }
        } catch (error) {
             util.setError(400, error.message);
             return util.send(res);
        }
    }

}
