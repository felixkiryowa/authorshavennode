import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import env from 'dotenv';
import Helper from './helper.social.auth';
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
                // res.status(200).json({
                //     user: existingUser
                // });
                // res.json({
                //     success: true,
                //     token: 'Bearer ' + token
                // });
                 jwt.sign(
                     payload,
                     process.env.SECRETKEY, {
                         expiresIn: 3600
                     },
                     (err, token) => {
                         res.json({
                             success: true,
                             token: 'Bearer ' + token
                         });
                     }
                 );
                // return done(null, existingUser);
                // Helper.generateToken(payload, res);
            }else {
                  const newUser = new User({
                      social_auth_id: profile.id,
                      email: profile.emails[0].value,
                      avarta,
                      username: profile.name.familyName + ' ' + profile.name.givenName,
                  });

                  await newUser.save();
                  // done(null, newUser);
                  // Generate the token or Sign Token
                  jwt.sign(
                      payload,
                      process.env.SECRETKEY, {
                          expiresIn: 3600
                      },
                      (err, token) => {
                          res.json({
                              success: true,
                              token: 'Bearer ' + token
                          });
                      }
                  );
            }
          
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
            // done(error, false, error.message);
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
            if (existingUser) {
                return done(null, existingUser);
            }
            const newUser = new User({
                social_auth_id: profile.id,
                email: profile.emails[0].value,
                avarta,
                username: profile.displayName,
            });
            const payload = {
                social_auth_id: profile.id,
                email: profile.emails[0].value,
                avarta,
                username: profile.displayName,
            };

            await newUser.save();
            done(null, newUser);
            // Generate the token or Sign Token
            jwt.sign(
                payload,
                process.env.SECRETKEY, {
                    expiresIn: 3600
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                }
            );
        } catch (error) {
            done(error, false, error.message);
        }
   }

   static async handleTwitterLogin() {
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
           if (existingUser) {
               return done(null, existingUser);
           }
           const newUser = new User({
                social_auth_id: profile.id,
                avarta,
                email: profile.emails[0].value,
                username: profile.displayName,
           });
           const payload = {
                social_auth_id: profile.id,
                avarta,
                email: profile.emails[0].value,
                username: profile.displayName,
           }

           await newUser.save();
           done(null, newUser);
           // Generate the token or Sign Token
           jwt.sign(
               payload,
               process.env.SECRETKEY, {
                   expiresIn: 3600
               },
               (err, token) => {
                   res.json({
                       success: true,
                       token: 'Bearer ' + token
                   });
               }
           );
       } catch (error) {
           done(error, false, error.message);
       }
   }
}
export default SocialAuthHelper;
