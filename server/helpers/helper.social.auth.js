import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import env from 'dotenv';
import Helper from './/helper.functions';
const User = require('../models/').User

env.config();
/**
 *
 *
 * @class SocialAuthHelper
 */
class SocialAuthHelper {

    static async handleFacebookLogin(profile, req, res) {
        try {
            const existingUser = await User.findOne({
                where: {
                   social_auth_id: profile.id,
                }
            });
            const avarta = gravatar.url(profile.emails[0].value, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const payload = {
                social_auth_id: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
            };
            if (existingUser) {
                Helper.generateToken(payload, res);
            }else {
                const newUser = new User({
                    social_auth_id: profile.id,
                    email: profile.emails[0].value,
                    avarta,
                    username: profile.name.familyName + ' ' + profile.name.givenName,
                });

                await newUser.save();
                Helper.generateToken(payload, res);
            }
          
        } catch (error) {
           Helper.handleErrors(res, error);
        }
    } 

   static async handleGoogleLogin(profile, req, res) {
        try {
            const existingUser = await User.findOne({
                where: {
                    social_auth_id: profile.id,
                }
            });
            const avarta = gravatar.url(profile.emails[0].value, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const payload = {
                social_auth_id: profile.id,
                email: profile.emails[0].value,
                avarta,
                username: profile.displayName,
            };
            if (existingUser) {
                Helper.generateToken(payload, res);
            }else {
                const newUser = new User({
                    social_auth_id: profile.id,
                    email: profile.emails[0].value,
                    avarta,
                    username: profile.displayName,
                });
                await newUser.save();
                Helper.generateToken(payload, res);
            }
          
        } catch (error) {
            Helper.handleErrors(res, error);
        }
   }

   static async handleTwitterLogin(profile, req, res) {
       try {
           const existingUser = await User.findOne({
               where: {
                   social_auth_id: profile.id,
               }
           });
            // const avarta = gravatar.url(profile.emails[0].value, {
            //     s: '200',
            //     r: 'pg',
            //     d: 'mm'
            // });
            const payload = {
                social_auth_id: profile.id,
                // avarta,
                // email: profile.emails[0].value,
                username: profile.displayName,
            }
           if (existingUser) {
              Helper.generateToken(payload, res);
           }
           else {
                const newUser = new User({
                    social_auth_id: profile.id,
                    username: profile.displayName,
                });
                await newUser.save();
                Helper.generateToken(payload, res);
           }
         
       } catch (error) {
           Helper.handleErrors(res, error);
       }
   }
}
export default SocialAuthHelper;
