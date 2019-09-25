import dotenv from 'dotenv';
import models from '../../server/models';
import {
    ExtractJwt as ExtractJwt 
}  from 'passport-jwt';

dotenv.config();

export const callbackFunc = (accessToken, refreshToken, profile, done) => done(null, profile);

export const localJwtcallbackFunc =  (jwt_payload, done) =>  {
    models.User.findByPk(jwt_payload.id).then(user => {
        if (user) {
            return done(null, user);
        } 
        return done(null, false); 
    }).catch(err => console.log(err))
  
}
export const facebookConfig = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'name', 'email', 'photos']
};

export const twitterConfig = {
    consumerKey: process.env.TWITTER_APP_ID,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    profileFields: ['id', 'name', 'email', 'photos']
};

export const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

export const jwtLocalConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRETKEY,

}
