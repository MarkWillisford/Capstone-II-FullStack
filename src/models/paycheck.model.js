const mongoose = require('mongoose');

const PaycheckSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
		required: true,
	},
	dateOfCheck: {
		type: Date,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	hours: {
		type: Number,
		required: true,
	},
	wages: {
		type: Number,
		required: true,
	},
	declaredTips: {
		type: Number,
		required: true,
	},
	taxes: {
		type: Number,
		required: true,
	},
	netPay: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('Paycheck', PaycheckSchema);