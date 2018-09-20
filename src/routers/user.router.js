'use strict';

const express = require('express');					
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main.config');
const User = require('../models/user.model');
const errorsParser = require('../helpers/errorParser.helper');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

require('../strategy/jwt.strategy')(passport);

const router = express.Router();

// This is our post to the /users endpoint
router.route('/users')
	// first it tries the middleware function disableWithToken, which checks to see if 
	// there is an authorization token in the header, if so it returns with an error
	// if we pass that, we call the requiredFields middleware which checks 
	.post(disableWithToken, requiredFields('email', 'username', 'password'), (req, res) => {
		// assuming it passes all tests, we create a user from the req data
		User.create({
			email: req.body.email,
			password: req.body.password,
			username: req.body.username,
		})
		// assuming no errors we return a 201 created code

        .then(user => {
            // if we got here, create a token payload (user)
            const tokenPayload = {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                monthlyIncomeGoal: user.monthlyIncomeGoal,
                monthlyHourlyGoal: user.monthlyHourlyGoal,
                hourlyWage: user.hourlyWage
            }; // send it off in a token
            const token = jwt.sign(tokenPayload, config.SECRET, {
                expiresIn: config.EXPIRATION,
            }); // and return it
            return res.status(201).json({ token: token });
        })
		// if there are errors we catch them and send a 400 code and generate an error
		.catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
	})
	// finally we get the passport we need to set the session and return 200
	.get(passport.authenticate('jwt', { session: false }), (req, res) => {
		res.status(200).json(req.user);
    })
    .put(passport.authenticate('jwt', { session: false }), (req, res) => {
        const updated = {};
        const updateableFields = ['monthlyIncomeGoal', 'monthlyHourlyGoal', 'hourlyWage'];
        updateableFields.forEach(field => {
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        });

        User
        .findByIdAndUpdate(req.body.id, { $set: updated }, { new: true })
        .then(updatedUser => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// To access the login page, we run through the disableWithToken
// and the requiredFields
router.post('/login', disableWithToken, requiredFields('email', 'password'), (req, res) => {
	// Assuming you have both we look for a user with that email
    User.findOne({ email: req.body.email })
    .then((foundResult) => {
    	// if we didn't find it
        if (!foundResult) {
            return res.status(400).json({
                generalMessage: 'Email or password is incorrect',       // <!-- if this is returned the following
            });                                                         // then statement breaks
        }
        // if we did we continue
        return foundResult;
    })                              // <!-- Solve one thing at at time. Jay suggested this, but now it breaks
                                    // everything!
    .then((foundUser) => {
    	// okay we found a user, compare the password
        foundUser.comparePassword(req.body.password)
        .then((comparingResult) => {
        	// if false
            if (!comparingResult) {
            	// return an error, exiting the chain
                return res.status(400).json({
                    generalMessage: 'Email or password is incorrect',
                });
            }
            // if we got here, create a token payload (user)
            const tokenPayload = {
                _id: foundUser._id,
                email: foundUser.email,
                username: foundUser.username,
                role: foundUser.role,
                monthlyIncomeGoal: foundUser.monthlyIncomeGoal,
                monthlyHourlyGoal: foundUser.monthlyHourlyGoal,
                hourlyWage: foundUser.hourlyWage
            }; // send it off in a token
            const token = jwt.sign(tokenPayload, config.SECRET, {
                expiresIn: config.EXPIRATION,
            }); // and return it
            return res.json({ token: token });
        });
    })
    .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

module.exports = { router };