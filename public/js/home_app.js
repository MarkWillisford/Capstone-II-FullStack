'use strict';

// This is where we will store our setting data
let globalUser_id = '';

function getShiftData(callbackFn){
	//setTimeout(function(){ callbackFn(MOCK_SHIFT_DATA)}, 100);
    const token = sessionStorage.getItem('token');
	$.ajax({
		url: '/api/shifts',
	    type: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
	    success: (response) => {
	    	callbackFn(response);
        },
	    error: function(err) { console.log(err); }
	});
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
};

// This function will stay when we connect to real API
function displayShiftData(data){
	// lets total the data we have recieved
	console.log('data is: ');
	console.log(data);
	let dataTotals = {};

	let key = "hours";
	dataTotals[key] = sumOfObjects(data, key);
	key = "netTips";
	dataTotals[key] = sumOfObjects(data, key);

	dataTotals.sales = {
		"food and NA beverages": sumOfObjects(data, "food"),
		"alcoholic beverages": sumOfObjects(data, "alcoholicBeverages"),
		"room charges": sumOfObjects(data, "roomCharges")
	};
	dataTotals.tipouts = {
		"support": sumOfObjects(data, "support"),
		"bar": sumOfObjects(data, "bar"),
		"kitchen": sumOfObjects(data, "kitchen")
	};

	console.log(user_Settings);
	console.log(user_Settings.monthlyIncomeGoal);
	// Set HTML to display data
	$( ".js_Date" ).html(getDate());
	$( ".js_monthlyEarned" ).html(`$${dataTotals["netTips"]}`);
	$( ".js_Target_monthlyEarned" ).html(`$${user_Settings.monthlyIncomeGoal}`);
	$( ".js_monthlyEarnedPercentage" ).html(`${		
		+((100 * dataTotals["netTips"] / user_Settings.monthlyIncomeGoal).toFixed(0))
	}%`);	
	$( ".js_actualHourlyRate" ).html(`$${
		+(((dataTotals["netTips"] / dataTotals.hours) + user_Settings.hourlyWage).toFixed(2))
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

// This function will save our user settings into our setting object
function setUserSettings(data){	
    // The key is key
    // The value is obj[key]
	for(let key in data){
    	user_Settings[key] = data[key];
	}
}

// Used to cycle through an array (data) of objects and adds all the values 
// found in the passed key
function sumOfObjects(data, key){
	let total = 0;
	$.each(data, function(i, item){
		total += accessValueByKey(data[i], key);
	});
	return total;
};

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
};

function getAndDisplayShiftData(){
	getShiftData(displayShiftData);
}

$(function(){
	checkUser(getAndDisplayShiftData);

	//js_testingGETListener();
});