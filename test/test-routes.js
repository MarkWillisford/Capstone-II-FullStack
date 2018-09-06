'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../src/config/main.config');

const User = require('../src/models/user.model');
const Shift = require('../src/models/shift.model');
const Paycheck = require('../src/models/paycheck.model');
const { app, runServer, closeServer } = require('../src/index');
const { TEST_DATABASE_URL } = require('../src/config/main.config');

let user = null;
let token = null;

let userCredentials = { }

chai.use(chaiHttp);

describe('tests', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	after(function(){
		return closeServer();
	});




	






	// describe('HTML Paths', function(){
	// 	it('/ should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/login should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/login.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/signup should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/signup.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/input_shift should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/input_shift.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/input_paycheck should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/input_paycheck.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/paycheck_varification should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/paycheck_varification.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/settings should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/settings.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// 	it('/graphs should return HTML and status code 200', function(){
	// 		return chai
	// 			.request(app)
	// 			.get('/graphs.html')
	// 			.then(function(res){
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.html;
	// 			});
	// 	});
	// });



	




	describe('Api Calls', function(){
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
		            return seedShifts(user._id)
		            .then(function(res){
		            	return seedChecks(user._id)
		            	.then(function(res){
		            		// console.log(res);
		            	});
		            });
				});	
		});

		afterEach(function(){
			return tearDownDb();
		});

		// // I'll use nested 'describe blocks' to make cleaner, 
		// // clearer code to prove smaller goals
		describe('User GET endpoint', function(){
			it('should return user with correct fields', function(){
				// authenticatedUser has been populated

				// strategy
				// 1. get back all users returned by Get request to /users
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
						// expect(res).to.include.keys(
						// 	'id', 'email', 'username', 'password', 'monthlyIncomeGoal',
						// 	'monthlyHourlyGoal', 'hourlyWage', 'role');
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

		// describe('User POST endpoint', function(){});
		describe('User Post endpoint', function(){
			it('should return 201 code with matching data', function(){
				let testUser = generateUserData();		
				return chai.request(app)
					.post('/api/users')
					.send(testUser)
					.then(function(res){
						// had to find the data in the res.  not easy!
						// console.log(res.request._data);
						expect(res).to.have.status(201);
					    expect(res).to.be.json;
					    expect(res.body).to.be.a('object');
					    expect(res.request._data).to.include.keys(
					      'email', 'username', 'password');
					    expect(res.request._data.email.toLowerCase()).to.equal(testUser.email.toLowerCase());
					    expect(res.request._data.username).to.equal(testUser.username);
					    expect(res.request._data.password).to.not.be.null;
	    									
	    				return User.findById(res.body.id);
					});
			});
		});

		// describe('User PUT endpoint', function(){});
		describe('User PUT endpoint', function(){
			it('should update item', function(){
				const updateData = {
					monthlyIncomeGoal: 4000,
					monthlyHourlyGoal: 40,
					hourlyWage: 14, 
				};
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(res){
						updateData.id = res.body._id;						
			            return chai.request(app)
			                .put('/api/users')
							.set('Authorization', `Bearer ${token}`)
			                .send(updateData);
					})
					.then(function(res){
			            expect(res).to.have.status(204);		

	    				return User.findById(user._id);		
					})
					.then(function(res){
			            expect(res).to.be.a("object");
					    expect(res.monthlyIncomeGoal).to.equal(updateData.monthlyIncomeGoal);
					    expect(res.monthlyHourlyGoal).to.equal(updateData.monthlyHourlyGoal);
					    expect(res.hourlyWage).to.equal(updateData.hourlyWage);
					})
			});
		});
		
		// describe('Login endpoint', function(){});
		describe('Login endpoint', function(){
			it('should return an authentication token', function(){
				let testUser = generateUserData();		
				// console.log(testUser.email);
				return chai.request(app)
					.post('/api/users')
					.send(testUser)
					.then(function(res){
						let testUserCredentials = {
							email: testUser.email.toLowerCase(),
							password: testUser.password,
						};

						return chai.request(app)
							.post('/api/login')
							.send(testUserCredentials)
							.then(function(res){
							    expect(res).to.be.json;
							    expect(res.body).to.be.a('object');
							    expect(res.body).to.have.keys('token');
							    expect('Location', '/index');
							});
					});
			});

			// test for bad input?
		});
		// describe('Shift POST endpoint', function(){});
		describe('Shift POST endpoint', function(){
			it('should return 201 with matching data', function(){
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(res){
						let testUserID = res.body._id;
						let data = generateShiftData(testUserID);
						return chai.request(app)
						.post('/api/shifts')
						.send(data)
						.then(function(res){
							expect(res).to.have.status(201);
							expect(res).to.be.json;
							expect(res.body).to.be.a('object');
							expect(res.body).to.have.keys('id', 'user', 'date', 'day', 'shift', 'food', 
								'alcoholicBeverages', 'roomCharges', 'guests', 'support', 'bar', 'servers', 
								'kitchen', 'netTips', 'hours');
							expect(res.body.id).to.not.be.null;					
							expect(res.body.user).to.not.be.null;
							expect(new Date(res.body.date).toISOString()).to.equal(data.date.toISOString());	
							expect(res.body.day).to.equal(data.day);
							expect(res.body.shift).to.equal(data.shift);
							expect(res.body.food).to.equal(data.food);
							expect(res.body.alcoholicBeverages).to.equal(data.alcoholicBeverages);
							expect(res.body.roomCharges).to.equal(data.roomCharges);
							expect(res.body.guests).to.equal(data.guests);
							expect(res.body.support).to.equal(data.support);
							expect(res.body.bar).to.equal(data.bar);
							expect(res.body.servers).to.equal(data.servers);
							expect(res.body.kitchen).to.equal(data.kitchen);
							expect(res.body.netTips).to.equal(data.netTips);
							expect(res.body.hours).to.equal(data.hours);
						});
					});
			});
		});

		// describe('Shift GET endpoint', function(){});
		describe('Shift GET endpoint', function(){
			it('should return all shifts', function(){
				// strategy
				// 1. authenticate
				// 2. get back all shifts returned by Get request to /shifts
				// 3. prove res has right status
				// 4. prove the number of shifts we got back is equal to 
				// 		the number in the db
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(res){
						let _res;
						return chai.request(app)
						.get('/api/shifts')
						.set('Authorization', `Bearer ${token}`)
						.then(function(res){
							_res = res;
							expect(_res).to.have.status(200);
							expect(_res.body).to.have.lengthOf.at.least(1);

							return Shift.count();
						})
						.then(count => {
							expect(_res.body).to.have.lengthOf(count);
						});
					});	
			});
			
			//************************** BROKEN *************************************
			// it('should return shifts within the date range', function(){
			// 	// strategy
			// 	// 1. authenticate
			// 	return chai.request(app)
			// 		.get('/api/users')
			// 		.set('Authorization', `Bearer ${token}`)
			// 	// 2. create array from Shift.find();
			// 		.then(function(res){
			// 			let shiftArray = [];
			// 	// 3. pick two random dates
			// 			let beginDate = faker.date.past(1);
			// 			let endDate = faker.date.between(beginDate, new Date());
			// 			let datedShiftsArray = [];
			// 			Shift.find()
			// 			.then(shifts => {
			// 				//console.log(shifts);
			// 				shiftArray = shifts;
			// 				return shiftArray;
			// 			})
			// 			.then(function(){
			// 	// 4. remove all shifts outside that range
			// 				for(let i=0; i<shiftArray.length; i++){
			// 					if(shiftArray[i].date < endDate && shiftArray[i].date > beginDate){
			// 						//console.log('within range');
			// 						datedShiftsArray.push(shiftArray[i]);
			// 					};
			// 				};
			// 	// 5. ensure there is at least one shift available
			// 	// well crap, can I put promises in loops?  keep trying to do xyz until . . .   ?
			// 			})
			// 	// 6. make get request with dates
			// 			.then(function(){
			// 				let _res;
			// 				return chai.request(app)
			// 				.get('/api/shifts')
			// 				.set('Authorization', `Bearer ${token}`)
			// 				.query({start: beginDate, end: endDate}) 
			// 				.then(function(res){
			// 					_res = res;
			// 					console.log(_res);
			// 				})

			// 			})
			// 			// .catch(e => {
			// 			// 	console.error(e);
			// 			// 	throw e;
			// 			// })
			// 		})
			// 	// 7. prove res has correct status
			// 	// 8. prove res has correct number of shifts
			// 	// 9. prove res has correct shift._ids
			// });
			//********************************************************************/
			
		});

		// describe('Paychecks POST endpoint', function(){});
		describe('Paychecks POST endpoint', function(){
			it('should return 201 with matching data', function(){
				//let shiftDataArray = [];
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(res){
						// get the logged in user id
						let testUserID = res.body._id;
						// create a dummy check
						let data = generateCheckData(testUserID);
						// and send it. 
						return chai.request(app)
						.post('/api/paychecks')
						.set('Authorization', `Bearer ${token}`)
						.send(data)
						.then(function(res){
							expect(res).to.have.status(201);
							expect(res).to.be.json;
							expect(res.body).to.be.a('object');
							expect(res.body).to.have.keys('id', 'user_id', 'dateOfCheck', 'startDate', 
								'endDate', 'hours', 'wages', 'declaredTips', 'taxes', 'netPay');
							expect(res.body.id).to.not.be.null;					
							expect(res.body.user_id).to.not.be.null;
							expect(new Date(res.body.dateOfCheck).toISOString()).to.equal(data.dateOfCheck.toISOString());
							expect(new Date(res.body.startDate).toISOString()).to.equal(data.startDate.toISOString());
							expect(new Date(res.body.endDate).toISOString()).to.equal(data.endDate.toISOString());
							expect(res.body.hours).to.equal(data.hours);
							expect(res.body.wages).to.equal(data.wages);
							expect(res.body.declaredTips).to.equal(data.declaredTips);
							expect(res.body.taxes).to.equal(data.taxes);
							expect(res.body.netPay).to.equal(data.netPay);
						});
					});
			});
		});
		// describe('Paychecks GET endpoint', function(){});
		describe('Paychecks GET endpoint', function(){
			it('should return all paychecks', function(){
				// strategy
				// 1. authenticate
				// 2. get back all shifts returned by Get request to /shifts
				// 3. prove res has right status
				// 4. prove the number of shifts we got back is equal to 
				// 		the number in the db
				return chai.request(app)
					.get('/api/users')
					.set('Authorization', `Bearer ${token}`)
					.then(function(res){
						let _res;
						return chai.request(app)
						.get('/api/paychecks')
						.set('Authorization', `Bearer ${token}`)
						.then(function(res){
							_res = res;
							expect(_res).to.have.status(200);
							expect(_res.body).to.have.lengthOf.at.least(1);

							return Paycheck.count();
						})
						.then(count => {
							expect(_res.body).to.have.lengthOf(count);
						});
					});	
			});
		});
	});
});

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for content
// and then we insert that data into mongo

function seedShifts(testUserID){
	console.log('seeding shifts');
	const seedShiftDataArray = [];

	for (let i=0; i<10; i++){
		let data = generateShiftData(testUserID);
		seedShiftDataArray.push(data);
	};

	return Shift.insertMany(seedShiftDataArray);
};

function seedUser(){
	console.info('seeding user data');

    let seedUserData = generateUserData();
	userCredentials.email = seedUserData.email;
	userCredentials.password = seedUserData.password;

	return User.create(seedUserData);
}

function seedChecks(testUserID){
	console.log('seeding checks');
	const seedCheckDataArray = [];

	for (let i=0; i<5; i++){
		let data = generateCheckData(testUserID);
		seedCheckDataArray.push(data);
	};

	return Paycheck.insertMany(seedCheckDataArray);
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

function generateShift(){
	const shifts = ['firstOff', 'secondOff', 'closer', 'bar', 'mid', 'lateMid'];
	const shift = shifts[Math.floor(Math.random() * shifts.length)];
	return shift;		
}

/************************************
* I am saving this because I want to 
* eventurally test with multiple 
* users in the DB
*************************************
function generateUserForShift(testUserID){
	const _users = [0,1,2];
	const _user = _users[Math.floor(Math.random() * _users.length)];
	if(_user == 1){
		// I need the user id!!!!
		return testUserID;
	} else {
		return '1234asdf1234asdf';
		maybe new mongoose.Types.ObjectId()?
	};
}*/

// generates a fake check object for testing
function generateCheckData(testUserID){
	return {
		user_id: mongoose.Types.ObjectId(testUserID),
		dateOfCheck: faker.date.past(2),
		startDate: faker.date.past(2),
		endDate: faker.date.past(2),
		hours: faker.random.number({min:10, max:75}),
		wages: faker.random.number({min:300, max:1000}),
		declaredTips: faker.random.number({min:1000, max:3000}),
		taxes: faker.random.number({min:50, max:200}),
		netPay: faker.random.number({min:400, max:600}),
		};
}

// generates a fake shift object for testing
function generateShiftData(testUserID){
	return {
		user_id: mongoose.Types.ObjectId(testUserID),
		date: faker.date.past(2),
		day: faker.random.number({min:0, max:6}),
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