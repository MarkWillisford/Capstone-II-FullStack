'use strict';

const express = require('express');
const app = express();
app.use(express.static('public'));

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