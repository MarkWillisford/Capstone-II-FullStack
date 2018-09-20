'use strict';

const express = require('express');					
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main.config');
const Shift = require('../models/shift.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const errorsParser = require('../helpers/errorParser.helper');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

require('../strategy/jwt.strategy')(passport);

const router = express.Router();

// This is our post to the /users endpoint
router.route('/shifts')
	// first it tries the middleware function disableWithToken, which checks to see if 
	// there is an authorization token in the header, if so it returns with an error
	// if we pass that, we call the requiredFields middleware which checks 
	.post(requiredFields('user_id', 'date', 'day', 'shift', 'food', 'alcoholicBeverages',
        'guests', 'netTips', 'hours'), (req, res) => {
		// assuming it passes all tests, we create a user from the req data
        User.findById(req.body.user_id)
            .then(user => {
                if(user){
                    Shift.create({
                        user_id: req.body.user_id,
                        date: req.body.date,
                        day: req.body.day,
                        shift: req.body.shift,
                        food: req.body.food,
                        alcoholicBeverages: req.body.alcoholicBeverages,
                        roomCharges: req.body.roomCharges,
                        guests: req.body.guests,
                        support: req.body.support,
                        bar: req.body.bar,
                        servers: req.body.servers,
                        kitchen: req.body.kitchen,
                        netTips: req.body.netTips,
                        hours: req.body.hours,
                    })
                    .then(shift => res.status(201).json({
                        id:shift.id,
                        user: `${user.username}`,
                        date: shift.date,
                        day: shift.day,
                        shift: shift.shift,
                        food: shift.food,
                        alcoholicBeverages: shift.alcoholicBeverages,
                        roomCharges: shift.roomCharges,
                        guests: shift.guests,
                        support: shift.support,
                        bar: shift.bar,
                        servers: shift.servers,
                        kitchen: shift.kitchen,
                        netTips: shift.netTips,
                        hours: shift.hours
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
    // the GET all route
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findById(req.user._id)
            .then(user => {
                if(user){
                    // turn the id into the right data type to search for
                    let myObjectID = mongoose.Types.ObjectId(user._id);
                    const filters = { 
                        user_id: user._id,
                    };
                    // adding the ability to search for an optional range
                    if(req.query['start']){
                        filters['date'] = {
                            $gte: req.query.start,
                            $lt: req.query.end
                        };                        
                    };
                    Shift.find(filters)                
                    .then(shifts => res.json(shifts))
                    .catch(err => {
                      console.error(err);
                      res.status(500).json({ error: 'something went terribly wrong' });
                    });
                } else {
                const message = `User not found which should never happen, contact your system admin`;
                console.error(message);
                return res.status(400).send(message);
                }
            })
        // if there are errors we catch them and send a 400 code and generate an error
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));         
    });

module.exports = { router };