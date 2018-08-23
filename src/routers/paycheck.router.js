'use strict';

const express = require('express');					
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main.config');
const Paycheck = require('../models/paycheck.model');
const User = require('../models/user.model');
const errorsParser = require('../helpers/errorParser.helper');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

require('../strategy/jwt.strategy')(passport);

const router = express.Router();

// This is our post to the /users endpoint
router.route('/paychecks')
	// first we call the requiredFields middleware which checks 
	.post(requiredFields('user_id', 'dateOfCheck', 'startDate', 'endDate', 'hours', 'wages',
        'declaredTips', 'taxes', 'netPay'), (req, res) => {
		// assuming it passes all tests, we create a user from the req data
        User.findById(req.body.user_id)
            .then(user => {
                if(user){
                    Paycheck.create({
                        user: req.body.user_id,
                        dateOfCheck: req.body.dateOfCheck,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        hours: req.body.hours,
                        wages: req.body.wages,
                        declaredTips: req.body.declaredTips,
                        taxes: req.body.taxes,
                        netPay: req.body.netPay,
                    })
                        .then(paycheck => res.status(201).json({
                            id:paycheck.id,
                            user: `${user.username}`,
                            dateOfCheck: paycheck.dateOfCheck,
                            startDate: paycheck.startDate,
                            endDate: paycheck.endDate,
                            hours: paycheck.hours,
                            wages: paycheck.wages,
                            declaredTips: paycheck.declaredTips,
                            taxes: paycheck.taxes,
                            netPay: paycheck.netPay
                        }))
                    .catch(err => {
                      console.error(err);
                      res.status(500).json({ message: "Internal server error" });
                    });
                } else {
                const message = `User not found`;
                console.error(message);
                return res.status(400).send(message);
                }
            })
		// if there are errors we catch them and send a 400 code and generate an error
		.catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
	})
    // finally we get the passport we need to set the session and return 200
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        res.status(200).json(req.user);
});

module.exports = { router };