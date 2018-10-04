'use strict';

// This is where we will store our setting data
let globalUser_id = '';

function getMonthlyShiftData(callbackFn){
	//setTimeout(function(){ callbackFn(MOCK_SHIFT_DATA)}, 100);
	// first I need the current month and year
	let month = (new Date().getMonth()) ;//+ 1; // Jan = 0, Feb = 1 etc				TEMP
	let year = new Date().getFullYear(); 
	let date = year + "-" + month + "-01";	// create a string

	let start = new Date(date);	// make a date object representing the beginning of this month
	let end = new Date();	// make a date object representing now

    const token = sessionStorage.getItem('token');
	$.ajax({
		url: '/api/summery',
	    type: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
        	start: start,	// pass a range from the beginning to this month to now
        	end: end,
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

function tipsListener(){
	$('input[type=radio][name=tips]').on('change', function() {
	    switch($(this).val()) {
	        case 'gross':           
        		$(".gross").show();
        		$(".walk").hide();
        		$(".tipout").hide();
        		$(".tipPercentagesSpanWrapper").css("transform", "translateY(50%)");
        		$(".tipPercentagesSpanWrapper").css("text-align", "center");
	            break;
	        case 'walk':
        		$(".gross").hide();
        		$(".walk").show();
        		$(".tipout").hide();
        		$(".tipPercentagesSpanWrapper").css("transform", "translateY(50%)");
        		$(".tipPercentagesSpanWrapper").css("text-align", "center");
	            break;
	        case 'tipout':
        		$(".gross").hide();
        		$(".walk").hide();
        		$(".tipout").show();
        		$(".tipout").css("font weight","normal");
        		$(".tipPercentagesSpanWrapper").css("transform", "none");
        		$(".tipPercentagesSpanWrapper").css("text-align", "left");
	            break;
	    }
	});
};

// This function will stay when we connect to real API
function displayShiftData(data){
	// lets total the data we have recieved
	let shiftTotals = {};

	let key = "hours";
	shiftTotals[key] = sumOfObjects(data.shifts, key);
	key = "netTips";
	shiftTotals[key] = sumOfObjects(data.shifts, key);
	key = "netPay";
	shiftTotals[key] = sumOfObjects(data.paychecks, key);

	shiftTotals.sales = {
		"food and NA beverages": sumOfObjects(data.shifts, "food"),
		"alcoholic beverages": sumOfObjects(data.shifts, "alcoholicBeverages"),
		"room charges": sumOfObjects(data.shifts, "roomCharges")
	};
	shiftTotals.tipouts = {
		"support": sumOfObjects(data.shifts, "support"),
		"bar": sumOfObjects(data.shifts, "bar"),
		"kitchen": sumOfObjects(data.shifts, "kitchen")
	};

	// Set HTML to display data
	$( ".js_Date" ).html(getDate());
	$( ".js_Target_monthlyEarned" ).html(`$${user_Settings.monthlyIncomeGoal}`);
	$( ".js_monthlyEarnedPercentage" ).html(`${		
		+((100 * shiftTotals["netTips"] / user_Settings.monthlyIncomeGoal).toFixed(0))
	}%`);	
	$( ".js_actualHourlyRate" ).html(`$${
		naNProtection(+(((shiftTotals["netTips"] / shiftTotals.hours) + user_Settings.hourlyWage).toFixed(2)))
	}/hr`);
	$( ".js_alcoholSalesPercentage" ).html(`${
		+((100 * shiftTotals.sales["alcoholic beverages"] / 
						( shiftTotals.sales["alcoholic beverages"] + shiftTotals.sales["food and NA beverages"] )).toFixed(0))
	}%`);

	$(".walk").html(`${
		naNProtection(
			+((100 * shiftTotals.netTips / ( shiftTotals.sales["alcoholic beverages"]
				+ shiftTotals.sales["food and NA beverages"] + shiftTotals.sales["room charges"])).toFixed(1))
		)
	}%`);
	$(".gross").html(`${
		naNProtection(
			+((100 * (shiftTotals.netTips
					+ shiftTotals.tipouts.bar
					+ shiftTotals.tipouts.kitchen
					+ shiftTotals.tipouts.support) /  
				( shiftTotals.sales["alcoholic beverages"]
				+ shiftTotals.sales["food and NA beverages"] + shiftTotals.sales["room charges"])).toFixed(1))
		)
	}%`);
	$(".tipoutBar").html(`Bar: ${
		naNProtection(
			+((100 * shiftTotals.tipouts["bar"] / shiftTotals.sales["alcoholic beverages"]).toFixed(1))
		)
	}%`)
	$(".tipoutSupport").html(`Support: ${
		naNProtection(
			+((100 * shiftTotals.tipouts["support"] / shiftTotals.sales["food and NA beverages"]).toFixed(1))
		)
	}%`);


	let fourPercent = shiftTotals.sales["food and NA beverages"]*.04;
	let diff = (shiftTotals.tipouts["support"] - fourPercent).toFixed(2);
	let OverUnder = "";
	if(diff > 0){
		OverUnder = "over"
	} else {		
		OverUnder = "under"
	}
	$(".js_supportDifference" ).html(`${OverUnder} by $${diff}`);

	// calculate the total earnings
	/*****************************************************************
	*	I've taken this out temporarily, I would like to perhaps add
	* 	a toggle between types of displaying, I like to know how much
	*	I've earned, even if I haven't received it yet, others prefer
	*	to wait until they receive the check
	*****************************************************************/
	// let wages = shiftTotals.hours * user_Settings.hourlyWage;
	// let totalEarned = shiftTotals["netTips"] + wages;
	let totalEarned = shiftTotals["netTips"] + shiftTotals["netPay"];
	// if total earnings is over the target, activate the arrow
	if(totalEarned > user_Settings.monthlyIncomeGoal){
		$(".overageArrowCard").show();
		$(".js_Target_MonthlyEarned_Overage").html(`+$${(totalEarned - user_Settings.monthlyIncomeGoal).toFixed(2)}`);
	};

	$( ".js_monthlyEarned" ).html(`$${naNProtection(totalEarned.toFixed(2))}`);
    let monthlyEarnedPercentage = (+((totalEarned) / user_Settings.monthlyIncomeGoal).toFixed(2));
    if(!(monthlyEarnedPercentage < 1)){
    	monthlyEarnedPercentage = 1;
    };
	    $('#incomeCircle').circleProgress({
	      value: monthlyEarnedPercentage
	    }).on('circle-animation-progress', function(event, progress, stepValue) {
    		let plus = false;
	    	let percentage = (stepValue * 100).toFixed(0);
	    	if(stepValue == 1){ plus = true; }
	      $(this).find('strong').html(plus ? String.fromCodePoint('0x1F60D') : naNProtection(percentage) + '<i>%</i>');
	    });

    let alcoholSalesPercentage = (+(shiftTotals.sales["alcoholic beverages"] / 
		( shiftTotals.sales["alcoholic beverages"] + shiftTotals.sales["food and NA beverages"] )).toFixed(2));
	    $('#alcCircle').circleProgress({
	      value: alcoholSalesPercentage
	    }).on('circle-animation-progress', function(event, progress, stepValue) {
	      $(this).find('strong').html(naNProtection(100 * (stepValue.toFixed(2).substr(1))) + '<i>%</i>');
	    });
};

/***************************************************
*	
*	To ask Michal, ln 169 and 175 above	
*
***************************************************/
function isOver100(data){
	if(data > 1){
		return "";
	} else {
		return data;
	}
}

function naNProtection(data){
	if(isNaN(data)){
		return 0;
	} else {
		return data;
	}
}

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
	getMonthlyShiftData(displayShiftData);
}

$(function(){
	checkUser(getAndDisplayShiftData);
	tipsListener();
});