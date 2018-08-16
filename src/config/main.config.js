require('dotenv').config();

module.exports = {
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/jwt-auth-demo',
	PORT: process.env.PORT || 8080,
	SECRET: SOME_SECRET_STRING,
};