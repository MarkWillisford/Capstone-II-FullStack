'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { app, runServer, closeServer } = require('../src/index');

chai.use(chaiHttp);

describe('Landing Page', function(){
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

describe('Home Screen', function(){
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
		console.log("about to request");
		return chai
			.request(app)
			.get('/home.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Login Screen', function(){
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
			.get('/login.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Signup Screen', function(){
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
			.get('/signup.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Shift Input Screen', function(){
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
			.get('/input_shift.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Paycheck Input Screen', function(){
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
			.get('/input_paycheck.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Paycheck Varification Screen', function(){
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
			.get('/paycheck_varification.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Settings Screen', function(){
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
			.get('/settings.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Graphs Screen', function(){
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
			.get('/graphs.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('Tables Screen', function(){
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
			.get('/tables.html')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});