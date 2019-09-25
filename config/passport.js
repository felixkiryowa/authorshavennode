import passport from 'passport';
import {
    Strategy as FacebookStrategy
} from 'passport-facebook';

import { 
    Strategy as JwtStrategy 
}
from 'passport-jwt';

import {
    Strategy as TwitterStrategy
} from 'passport-twitter';
import {
    OAuth2Strategy as GoogleStrategy
} from 'passport-google-oauth';

import {
    facebookConfig,
    googleConfig,
    twitterConfig,
    jwtLocalConfig,
    callbackFunc, 
    localJwtcallbackFunc
} from '../server/middlewares/oauth';

passport.use(new FacebookStrategy(facebookConfig, callbackFunc));

passport.use(new GoogleStrategy(googleConfig, callbackFunc));

passport.use(new TwitterStrategy(twitterConfig, callbackFunc));

passport.use(new JwtStrategy(jwtLocalConfig, localJwtcallbackFunc));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
