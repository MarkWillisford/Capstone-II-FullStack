'use strict';

const express = require('express');				
const faker = require('faker');	
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main.config');
const User = require('../models/user.model');
const Shift = require('../models/shift.model');
const Paycheck = require('../models/paycheck.model');
const mongoose = require('mongoose');
const errorsParser = require('../helpers/errorParser.helper');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');

require('../strategy/jwt.strategy')(passport);

const router = express.Router();

router.post('/demo', disableWithToken, requiredFields('email', 'password'), (req, res) => {
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

            // return res.json({ token: token, _id: tokenPayload._id }); 
            return { token: token, _id: tokenPayload._id };
        })
        .then(token => {
            // 1.) set the user settings
            const updated = {
                'monthlyIncomeGoal': 4000,
                'monthlyHourlyGoal': 45,
                'hourlyWage': 11.5
            };

            User
            .findByIdAndUpdate(token._id, { $set: updated }, { new: true })
            .catch(err => res.status(500).json({ message: 'Something went wrong' }))
            return token;
        })
        .then(token => {
            // 2.) clear any shifts or paychecks for this user
            const myquery = { user: token._id};
            Paycheck.deleteMany(myquery, function(err, obj) {
                if (err) throw err;
            });
            const myquery2 = { user_id: token._id}
            Shift.deleteMany(myquery2, function(err, obj) {
                if (err) throw err;
            });
            return token;
        })
        .then(token => {
            // 3.) populate data with predetermined data
                // 3.1 for each thur, fri and sat of the last year
                let month = (new Date().getMonth()) + 1; // Jan = 0, Feb = 1 etc
                let year = (new Date().getFullYear()) - 1; // last year
                let todayDate = new Date().getDate();    // todays number of the month
                let date = year + "-" + month + "-" + todayDate;  // create a string

                let today = new Date();             // today
                let first = new Date(date);         // make a date object representing this date last year

                let daysAfterLastThursday = (-7+4) - today.getDay();
                let currentMs = today.getTime();
                // finds last Thursday to start the algorithm
                let lastThursday = new Date(currentMs + (daysAfterLastThursday * 24 * 60 * 60 * 1000));
                let dateToAdd = lastThursday;

                let datesArray = [];

                while(dateToAdd > first){
                    datesArray.push(dateToAdd);
                    let dateToAddMs = dateToAdd.getTime();
                    dateToAdd = new Date(dateToAddMs + ((- 7) * 24 * 60 * 60 * 1000));
                };
                // finds and adds Fridays
                let daysAfterLastFriday = (-7+5) - today.getDay();
                let lastFriday = new Date(currentMs + (daysAfterLastFriday * 24 * 60 * 60 * 1000));
                dateToAdd = lastFriday;
                while(dateToAdd > first){
                    datesArray.push(dateToAdd);
                    let dateToAddMs = dateToAdd.getTime();
                    dateToAdd = new Date(dateToAddMs + ((- 7) * 24 * 60 * 60 * 1000));
                };
                // finally, finds and adds Saturday
                let daysAfterLastSat = (-7+6) - today.getDay();
                let lastSat = new Date(currentMs + (daysAfterLastSat * 24 * 60 * 60 * 1000));
                dateToAdd = lastSat;
                while(dateToAdd > first){
                    datesArray.push(dateToAdd);
                    let dateToAddMs = dateToAdd.getTime();
                    dateToAdd = new Date(dateToAddMs + ((- 7) * 24 * 60 * 60 * 1000));
                };

                // Now we have an array of every Thursday, Friday and Saturday over the last year
                // For each day, create a mock shift. 
                let seedShiftDataArray = [];
                for(let i = 0; i < datesArray.length; i++){
                    let date = new Date(datesArray[i]);
                    let data = generateShiftData(token._id, date);

                    seedShiftDataArray.push(data);
                };

                Shift.insertMany(seedShiftDataArray);
            return res.json(token);
        });     
    })
    .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

// helper functions to create mock data.
// generates a fake shift object for testing
function generateShiftData(demoUserID, date){
    return {
        user_id: mongoose.Types.ObjectId(demoUserID),
        date: date,
        day: date.getDay(),
        shift: generateShift(),
        food: faker.random.number({min:300, max:2000}),
        alcoholicBeverages: faker.random.number({min:100, max:1000}),
        roomCharges: faker.random.number({min:0, max:100}),
        guests: faker.random.number({min:0, max:200}),
        support: faker.random.number({min:0, max:75}),
        bar: faker.random.number({min:0, max:50}),
        servers: faker.random.number({min:0, max:100}),
        kitchen: faker.random.number({min:0, max:100}),
        netTips: faker.random.number({min:150, max:500}),
        hours: faker.random.number({min:5, max:12}),
        };
}

function generateShift(){
    const shifts = ['firstOff', 'secondOff', 'closer', 'bar', 'mid', 'lateMid'];
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    return shift;       
}

module.exports = { router };