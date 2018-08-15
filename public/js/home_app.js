'use strict';

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

function getShiftData(callbackFn){
	setTimeout(function(){ callbackFn(MOCK_SHIFT_DATA)}, 100);
};

// Date function
function getDate(){	
	let currentDate = new Date();
	let months = ["January", "February", "March", "April", "May", "June", 
		"July", "August", "September", "October", "November", "December"];
	let day = currentDate.getDate();
	let monthString = months[currentDate.getMonth()];
	let year = currentDate.getFullYear()

	let dateString = day + " " + monthString + " " + year;
	return dateString;
}

// This function will stay when we connect to real API
function displayShiftData(data){
	// lets total the data we have recieved
	let dataTotals = {};

	let key = "hours";
	dataTotals[key] = sumOfObjects(data, key);
	key = "net tips";
	dataTotals[key] = sumOfObjects(data, key);

	dataTotals.sales = {
		"food and NA beverages": sumOfObjects(data, "sales.food and NA beverages"),
		"alcoholic beverages": sumOfObjects(data, "sales.alcoholic beverages"),
		"room charges": sumOfObjects(data, "sales.room charges")
	};
	dataTotals.tipouts = {
		"support": sumOfObjects(data, "tipouts.support"),
		"bar": sumOfObjects(data, "tipouts.bar"),
		"kitchen": sumOfObjects(data, "tipouts.kitchen")
	};

	// Set HTML to display data
	$( ".js_Date" ).html(getDate());
	$( ".js_monthlyEarned" ).html(`$${dataTotals["net tips"]}`);
	$( ".js_Target_monthlyEarned" ).html(`$${monthlyIncomeGoal}`);
	$( ".js_monthlyEarnedPercentage" ).html(`${		
		+((100 * dataTotals["net tips"] / monthlyIncomeGoal).toFixed(0))
	}%`);	
	$( ".js_actualHourlyRate" ).html(`$${
		+(((dataTotals["net tips"] / dataTotals.hours) + hourlyWage).toFixed(2))
	}`);
	$( ".js_alcoholSalesPercentage" ).html(`${
		+((100 * dataTotals.sales["alcoholic beverages"] / 
						( dataTotals.sales["alcoholic beverages"] + dataTotals.sales["food and NA beverages"] )).toFixed(0))
	}%`);
	$( ".js_supportTipoutPercentage" ).html(`${
		+((100 * dataTotals.tipouts["support"] / dataTotals.sales["food and NA beverages"]).toFixed(1))
	}%`);
	
	let fourPercent = dataTotals.sales["food and NA beverages"]*.04;
	let diff = dataTotals.tipouts["support"] - fourPercent;
	let OverUnder = "";
	if(diff > 0){
		OverUnder = "over"
	} else {		
		OverUnder = "under"
	}
	$(".js_supportDifference" ).html(`${OverUnder} by $${diff}`);

};

// Used to cycle through an array (data) of objects and adds all the values 
// found in the passed key
function sumOfObjects(data, key){
	let total = 0;
	$.each(data.shifts, function(i, item){
		total += accessValueByKey(data.shifts[i], key);
	});
	return total;
}

// This function will return the value found in the passed 
// object and key, burrowing as far as needed
function accessValueByKey(data, key){
	if(key.indexOf('.') === -1){
		// there are no child keys
		return data[key];
	} else {
		// there are child keys
		// break the string up to the first "."
		const [ head, ...tail ] = key.split('.');
		// recall this function with the new string as the key
		return accessValueByKey(data[head], tail.join('.'))
	}
}

// This function will also stay
function getAndDisplayShiftData(){
	getShiftData(displayShiftData);
};

$(function(){
	getAndDisplayShiftData();
});