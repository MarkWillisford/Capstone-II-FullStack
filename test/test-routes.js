'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../src/config/main.config');

const User = require('../src/models/user.model');
const { app, runServer, closeServer } = require('../src/index');
const { TEST_DATABASE_URL } = require('../src/config/main.config');

let userCredentials = { }

chai.use(chaiHttp);

/********************
*
*	These are all throwing something and crashing the server.  GRRRR>>>>>
*/
describe('tests', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	after(function(){
		return closeServer();
	});

	describe('HTML Paths', function(){
		it('/ should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/login should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/login.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/signup should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/signup.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/input_shift should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/input_shift.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/input_paycheck should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/input_paycheck.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/paycheck_varification should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/paycheck_varification.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/settings should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/settings.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
		it('/graphs should return HTML and status code 200', function(){
			return chai
				.request(app)
				.get('/graphs.html')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				});
		});
	});

	describe('Api Calls', function(){
		let user = null;
		let token = null;
		beforeEach(function(){
			return seedUser()
				.then(function(userData){
					user = userData;	
					const tokenPayload = {
		                _id: user._id
		            }; 
		            token = jwt.sign(tokenPayload, config.SECRET, {
		                expiresIn: config.EXPIRATION,
		            }); 				
				})	
				//.then(seedTestingData); <-- more data to seed
		});

		afterEach(function(){
			return tearDownDb();
		});

		// I'll use nested 'describe blocks' to make cleaner, 
		// clearer code to prove smaller goals
		describe('User GET endpoint', function(){
			it('should return user with correct fields', function(){
				// authenticatedUser has been populated

				// strategy
				// 1. get back all users retruned by Get request to /users
				// 2. prove res has right status and data type
				// 3. prove the number of users we got back is equal to 
				// 		the number in the db

				let res;			
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(_res){
						res = _res;
						expect(res).to.have.status(200);
						expect(res).to.be.a('object');
						/*expect(res).to.include.keys(
							'id', 'email', 'username', 'password', 'monthlyIncomeGoal',
							'monthlyHourlyGoal', 'hourlyWage', 'role');*/
						return User.findById(res.id);
					})
					then(function(user){
						expect(resUser.id).to.equal(user.id);
						expect(resUser.email).to.equal(user.email);
						expect(resUser.username).to.equal(user.username);
						expect(resUser.password).to.equal(user.password);
						expect(resUser.monthlyIncomeGoal).to.equal(user.monthlyIncomeGoal);
						expect(resUser.monthlyHourlyGoal).to.equal(user.monthlyIncomeGoal);
						expect(resUser.hourlyWage).to.equal(user.hourlyWage);
						expect(resUser.role).to.equal(user.role);
					});				
			});
		});

		// TODO! describe('User POST endpoint', function(){});
		// TODO! describe('User PUT endpoint', function(){});
		// TODO! describe('Login endpoint', function(){});
		// TODO! describe('Shift POST endpoint', function(){});
		// TODO! describe('Shift GET endpoint', function(){});
		// TODO! describe('Paychecks POST endpoint', function(){});
		// TODO! describe('Paychecks GET endpoint', function(){});
	});
});

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for content
// and then we insert that data into mongo

function seedTestingData(){
	const seedData = [];
};

function seedUser(){
	console.info('seeding user data');

	/*
	const seedUserData = [];

	for (let i=0; i<10; i++){
		seedUserData.push(generateUserData());
	}

    */

    let seedUserData = generateUserData();
	userCredentials.email = seedUserData.email;
	userCredentials.password = seedUserData.password;

	return User.create(seedUserData);
}

// used by generateUserData to create a random role
function generateRole(){
	const roles = ['user', 'admin'];
	const role = roles[Math.floor(Math.random() * roles.length)];
	return role;	
}

// generates a fake User object for testing
function generateUserData(){
	return {
		email: faker.internet.email(),
		username: faker.internet.userName(),
		password: faker.internet.password(8),
		monthlyIncomeGoal: faker.random.number({min:3000, max:5000}),
		monthlyHourlyGoal: faker.random.number({min:20, max:55}),
		hourlyWage: faker.random.number({min:10, max:20}),
		role: generateRole(),
	};
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}













/* okay here we go.  TODO!!!
function generateTestUserID(){
	const users = [ ];
	const user = users[Math.floor(Math.random() * users.length)];
	return user;
}

function generateShift(){
	const shifts = ['firstOff', 'secondOff', 'closer', 'bar', 'mid', 'lateMid'];
	const shift = shifts[Math.floor(Math.random() * shifts.length)];
	return shift;
}

function generateDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
// used to generate an object representing
// a shift
function generateShiftData(){
	return {
		user: type: ; 
		date: generateDate(new Date(2018, 0, 1), new Date());
		day: faker.random.number({min:1, max:30});
		shift: generateShift();
		food: faker.random.number({min:500, max:1000});
		alcoholicBeverages: faker.random.number({min:100, max:500});
		roomCharges: faker.random.number({min:0, max:250});
		guests: faker.random.number({min:25, max:100});
		support: faker.random.number({min:5, max:40});
		bar: faker.random.number({min:0, max:20});
		servers: type: faker.random.number({min:0, max:100});
		kitchen: type: faker.random.number({min:0, max:25});
		netTips: type: faker.random.number({min:150, max:400});
		hours: type: faker.random.number({min:5, max:12});
	};
}
*/