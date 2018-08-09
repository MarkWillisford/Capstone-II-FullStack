'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

describe('Home', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	// Test Strategy:
	// 1. make request to root
	// 2. ensure return object is HTML with status code 200
	it('should return HTML and status code 200', function(){
		return chai
			.request(app)
			.get('/')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});