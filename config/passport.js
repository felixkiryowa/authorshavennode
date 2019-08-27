import gravatar from 'gravatar';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../server/models').User; 
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        getCurrentUser(jwt_payload, done);
    }));

    passport.use('facebookToken', new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log('profile', profile);
            // console.log('accessToken', accessToken);
            // console.log('refreshToken', refreshToken);
            const existingUser = await User.findOne({
                where: {
                    email: profile.emails[0].value
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
                email: profile.emails[0].value,
                avarta,
                username: profile.displayName,
            });
            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }
    }));
}

const getCurrentUser = (jwt_payload, done) => {
    User.findByPk(jwt_payload.id).then(user => {
        if(user) {
            return done(null, user);
        }
        // User not found
        return done(null, false); 
    }).catch(err => console.log(er))
}
