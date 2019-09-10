import gravatar from 'gravatar';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../server/models').User; 
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

module.exports = passport => {

     passport.serializeUser((user, callback) => {
         callback(null, user);
     });

     passport.deserializeUser((obj, callback) => {
         callback(null, obj);
     });

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        getCurrentUser(jwt_payload, done);
    }));

    passport.use('facebookToken', new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
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
                username: profile.displayName,
            });
            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }
    }));

    passport.use('twitterToken', new TwitterStrategy({
            consumerKey: process.env.TWITTER_APP_ID,
            consumerSecret: process.env.TWITTER_API_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({
                    where: {
                        social_auth_id: profile.id,
                    }
                });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const newUser = new User({
                    social_auth_id: profile.id,
                    username: profile.displayName,
                });
                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, false, error.message);
            }
        }
    ));

    passport.use('googleToken', new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async(accessToken, refreshToken, profile, done) => {
            console.log('GOOGLE TOKEN.....', profile);
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
                  await newUser.save();
                  done(null, newUser);
              } catch (error) {
                  done(error, false, error.message);
              }
        }
    ));
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
