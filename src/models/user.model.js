const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
		min: 7,
		max: 72, // due to bcrypt truncating
	}, 
	role: {
		type: String,
		enum: ['user','admin'],
		default: 'user',
	},	
});

// This function hashes the password prior to 
// saving on either a modified PW or new user
UserSchema.pre('save', function userPreSave(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        return bcrypt.hash(user.password, 10)
            .then((hash) => {
                user.password = hash;
                return next();
            })
            .catch(err => next(err));
    }
    return next();
});

// Still working on this. Makes sure the user is unique?  
UserSchema.plugin(uniqueValidator);

// Our comparison method using bcrypt
UserSchema.methods.comparePassword = function userComparePassword(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);