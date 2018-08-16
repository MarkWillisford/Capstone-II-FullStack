const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');
const config = require('../config/main.config');

module.exports = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.SECRET;
    passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    	// find the user
        User.findById(jwtPayload._id)
            .then((user) => {
            	// if we find it
                if (user) {
                	// build a userData object from it
                    const userData = {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                    };
                    // and pass it to the done function?
                    done(null, userData);
                } else {
                    done(null, false);
                }
            })
            .catch(error => done(error, false));
    }));
};