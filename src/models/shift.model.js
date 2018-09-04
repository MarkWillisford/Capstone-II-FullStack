const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	day: {
		type: Number,
		required: true,
	},
	shift: {
		type: String,
		enum: ['firstOff', 'secondOff', 'closer', 'bar', 'mid', 'lateMid'],
		required: true,
	},
	food: {
		type: Number,
		required: true,
	},
	alcoholicBeverages: {
		type: Number,
		required: true,
	},
	roomCharges: {
		type: Number,
		default: 0,
	},
	guests: {
		type: Number,
		required: true,
	},
	support: {
		type: Number,
		default: 0,
	},
	bar: {
		type: Number,
		default: 0,
	},
	servers: {
		type: Number,
		default: 0,
	},
	kitchen: {
		type: Number,
		default: 0,
	},
	netTips: {
		type: Number,
		required: true,
	},
	hours: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('Shift', ShiftSchema);