require('dotenv').config();

module.exports = {
    ENV: process.env.NODE_ENV || 'production',
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 
		'mongodb://localhost/test-restaurantIncomeDb',
	PORT: process.env.PORT || 8080,
	SECRET: "SOME_SECRET_STRING",    
	CONCURRENCY: process.env.WEB_CONCURRENCY,
    DATABASE_URL: process.env.DATABASE_URL || 
		'mongodb://localhost/restaurantIncomeDb',
    EXPIRATION: 864000,
};