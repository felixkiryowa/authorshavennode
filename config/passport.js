const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../server/models').User; 
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        getCurrentUser(jwt_payload, done);
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
