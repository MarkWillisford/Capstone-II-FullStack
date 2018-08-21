'use strict';

// "MOCK" objects are fake data
let MOCK_SHIFT_DATA = {
	"shifts": [
		{
			"id": 11111,
			"date": "09Aug2018",
			"day": "Thursday",
			"shift": "close",
			"sales": {
				"food and NA beverages": 875,
				"alcoholic beverages": 300,
				"room charges": 0
			},
			"tipouts": {
				"support": 33,
				"bar": 0,
				"servers": [				],
				"kitchen": 0
			},
			"net tips": 196,
			"hours": 8
		},
		{
			"id": 11112,
			"date": "10Aug2018",
			"day": "Friday",
			"shift": "close",
			"sales": {
				"food and NA beverages": 1000,
				"alcoholic beverages": 375,
				"room charges": 400
			},
			"tipouts": {
				"support": 46,
				"bar": 13,
				"servers": [				],
				"kitchen": 0
			},
			"net tips": 280,
			"hours": 7.29
		},
		{
			"id": 11113,
			"date": "11Aug2018",
			"day": "Saturday",
			"shift": "mid",
			"sales": {
				"food and NA beverages": 975,
				"alcoholic beverages": 600,
				"room charges": 250 
			},
			"tipouts": {
				"support": 39,
				"bar": 10,
				"servers": [				],
				"kitchen": 0
			},
			"net tips": 295,
			"hours": 9.04
		},
	]
};

let MOCK_USER_SETTINGS = {
	"monthlyIncomeGoal": 4000,
	"monthlyHourlyGoal": 40,
	"hourlyWage": 12.5
};