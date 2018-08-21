'use strict';

//require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');
const mongoose = require('mongoose');
//const passport = require('passport');
const { router: userRouter } = require('./routers/user.router');

const app = express();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, CONCURRENCY: WORKERS, ENV } = require('./config/main.config');
/* Middlewares */
// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

// Static files
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
morgan.token('processId', () => process.pid);
if (ENV === 'development') {
    app.use(morgan(':processId - :method :url :status :response-time ms - :res[content-length]'));
}


/* Routes */
app.use('/api', userRouter);



// Server scripts
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
// this function is responsable for loading the server 
function runServer(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app
			.listen(port, () => {
				console.log(`Listening on port ${port}`);
				resolve(server);
			})
			.on('error', err => {
				reject(err);
			});
	});
}

// like 'runServer', this function also returns a promise
function closeServer(){
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if(err){
				reject(err);
				return;
			}
			resolve();
		});
	});
}

// if server.js is called directly . . . 
if(require.main === module){
	runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };