'use strict';

let globalUser_id = '';
const fp = flatpickr(".resetDate", {
    mode: 'range',
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
}); // flatpickr
let groupDataBy = "";
let viewDataFrom = "";

function getDatedDataFuncion(callbackFn){
	let selectedDates = {};
	let start = "";
	let end = "";
	let day = "";
	let month = "";
	let year = "";
	let date = "";

	switch(viewDataFrom){
		case "thisMonth":
			month = (new Date().getMonth()) + 1; // Jan = 0, Feb = 1 etc
			year = new Date().getFullYear(); 
			date = year + "-" + month + "-01";	// create a string
			start = new Date(date);	// make a date object representing the beginning of this month
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "1month":
			day = (new Date().getDate());
			month = (new Date().getMonth()); // remove the +1 to get last month
			if(month < 0){
				month = month+12;
			};
			year = new Date().getFullYear(); 
			date = year + "-" + month + "-" + day;	// create a string
			start = new Date(date);	// make a date object representing this day, last month
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "3months":
			day = (new Date().getDate());
			month = (new Date().getMonth() - 2); // 3 months ago
			if(month < 0){
				month = month+12;
			};
			year = new Date().getFullYear(); 
			date = year + "-" + month + "-" + day;	// create a string
			start = new Date(date);	
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "6months":
			day = (new Date().getDate());
			month = (new Date().getMonth() - 5); // 6 months ago
			if(month < 0){
				month = month+12;
			};
			year = new Date().getFullYear(); 
			date = year + "-" + month + "-" + day;	// create a string
			start = new Date(date);	
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "1year":
			day = (new Date().getDate());
			month = (new Date().getMonth() + 1); 
			if(month < 0){
				month = month+12;
			};
			year = (new Date().getFullYear() - 1); 
			date = year + "-" + month + "-" + day;	// create a string
			start = new Date(date);	
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "all":
			day = (new Date().getDate());
			month = (new Date().getMonth() + 1); 
			if(month < 0){
				month = month+12;
			};
			year = (new Date().getFullYear() - 5); // sets it before the app was live
			date = year + "-" + month + "-" + day;	// create a string
			start = new Date(date);	
			end = new Date();
			end.setHours(23,59,59,999);
			break;
		case "selectRange":
			selectedDates = fp.selectedDates;	// this array holds our beginning and end dates
			start = selectedDates[0];
			end = selectedDates[1];
			end.setHours(23,59,59,999);	
			break;
	}

	const token = sessionStorage.getItem('token');
	$.ajax({
		url: '/api/shifts',
	    type: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
        	start: start,	// pass a range from the beginning to this month to now
        	end: end,
        },
	    success: (response) => {
	    	callbackFn(response, groupDataBy);
        },
	    error: function(err) { console.log(err); }
	});
};

function displayData(ungrouped_data, groupDataBy){
	// a set of data arrays for easy access
	let dataSet = {
		"dates": [],
		"net tips": [],
		"tip %": [],	// calc
		"calculated hourly": [],	// calc
		"net sales": [],	// calc
		"alcohol sales": [],
		"alcohol %": [],
		"ppa": [], // calc
	}

	// first lets sort our data by date
	ungrouped_data.sort(function(a,b){
		var c = new Date(a.date);
		var d = new Date(b.date);
		return c-d;
	});

	// now group the data into a new array "data"
	let data = [];
	let compareFunction = "";
	if(groupDataBy == "weekly"){
		compareFunction = compareWeek;
	} else if(groupDataBy == "monthly"){
		compareFunction = compareMonth;
	};

	if(groupDataBy != "daily"){	
		for(let i=0; i<ungrouped_data.length; i++){
			if(i==0){
				data.push(ungrouped_data[i]);
			} else {
				if(compareFunction(ungrouped_data[i].date, data[data.length-1].date)){
				// this is our compare function, if it returns true we loop through every key and combine values
					data[data.length-1].alcoholicBeverages += ungrouped_data[i].alcoholicBeverages;
					data[data.length-1].bar += ungrouped_data[i].bar;
					data[data.length-1].food += ungrouped_data[i].food;
					data[data.length-1].guests += ungrouped_data[i].guests;
					data[data.length-1].hours += ungrouped_data[i].hours;
					data[data.length-1].kitchen += ungrouped_data[i].kitchen;
					data[data.length-1].netTips += ungrouped_data[i].netTips;
					data[data.length-1].roomCharges += ungrouped_data[i].roomCharges;
					data[data.length-1].servers += ungrouped_data[i].servers;
					data[data.length-1].support += ungrouped_data[i].support;
				} else {
				// if it returns false we push a new entry. 
					data.push(ungrouped_data[i]);
				}
			};
		};
	} else {
		// its already grouped by date
		data = ungrouped_data;
	};

	// iterate through our data to build our dataSet
	for(let i=0; i<data.length; i++){
		// I should format the dates as they go into the dataSet array
		// options: weekday: "narrow", "short", "long"
		// year:  "numeric", "2-digit"
		// month: "numeric", "2-digit", "narrow", "short", "long"
		// day: "numeric", "2-digit"
		let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
		let dateToFormat  = data[i].date;

		dataSet.dates.push(new Date(dateToFormat).toLocaleDateString("en-US", options));		
		dataSet["net tips"].push(data[i]["netTips"]);
		dataSet["tip %"].push( + // calculations and the toFixed() to make it a %
			(	
				(100 * data[i]["netTips"] / 
					(data[i]["food"] +
					data[i]["alcoholicBeverages"] + 
					data[i]["roomCharges"])
				).toFixed(2)
			)
		);
		dataSet["calculated hourly"].push( + // calculations and the toFixed() to make it a $
			(
				(12.5 + (data[i]["netTips"] / data[i]["hours"])
				).toFixed(2)
			) 
		);
		dataSet["net sales"].push((
			data[i]["food"] +
			data[i]["alcoholicBeverages"] + 
			data[i]["roomCharges"]
			));
		dataSet["alcohol sales"].push(data[i]["alcoholicBeverages"]);
		dataSet["alcohol %"].push( + // calculations and the toFixed() to make it a %
			(
				(100 * data[i]["alcoholicBeverages"] /
					(data[i]["food"] + 
						data[i]["alcoholicBeverages"])
				).toFixed(0)
			)
		);
		dataSet["ppa"].push( + // calculations and the toFixed() to make it a $
			(
				((data[i]["food"] + 
					data[i]["alcoholicBeverages"]) / 
					data[i]["guests"]
				).toFixed(2)
			)
		);
	}

	/***************************
	*	myNetTipsChart
	***************************/
	displayChart("#myNetTipsChart", dataSet["dates"], "Tips", dataSet["net tips"]);

	/***************************
	*	myTipsPercentageChart
	***************************/
	displayChart("#myTipsPercentageChart", dataSet["dates"], "Tip %", dataSet["tip %"]);

	/***************************
	*	myCalculatedHourlyChart
	***************************/
	displayChart("#myCalculatedHourlyChart", dataSet["dates"], "Hourly", dataSet["calculated hourly"]);

	/***************************
	*	mySalesChart
	***************************/
	displayDoubleChart("#mySalesChart", dataSet["dates"], "Sales", dataSet["net sales"], "Alcohol Sales", dataSet["alcohol sales"] );

	/***************************
	*	myAlcoholSalesChart
	***************************/
	displayChart("#myAlcoholSalesChart", dataSet["dates"], "Alcohol %", dataSet["alcohol %"]);

	/***************************
	*	myPPASalesChart
	***************************/
	displayChart("#myPPASalesChart", dataSet["dates"], "PPA", dataSet["ppa"]);
};

function displayDoubleChart(htmlElement, label, datasetLabel, dataArray, datasetLabel2, dataArray2){
	let ctx = $(htmlElement);	//"#myTipsPercentageChart"
	let chartData = {
	    labels: label,	//"dates"
	    datasets: [
		    {label: datasetLabel,
		    fill: false,
		    lineTension: 0.1,
		    backgroundColor: "rgba(75,192,192,0.4)",
		    borderColor: "rgba(75,192,192,1)",
		    borderCapStyle: 'butt',
		    borderDash: [],
		    borderDashOffset: 0.0,
		    borderJoinStyle: 'miter',
		    pointBorderColor: "rgba(75,192,192,1)",
		    pointBackgroundColor: "#fff",
		    pointBorderWidth: 1,
		    pointHoverRadius: 5,
		    pointHoverBackgroundColor: "rgba(75,192,192,1)",
		    pointHoverBorderColor: "rgba(220,220,220,1)",
		    pointHoverBorderWidth: 2,
		    pointRadius: 5,
		    pointHitRadius: 10,
		    data: dataArray},

		    {label: datasetLabel2,
		    fill: false,
		    lineTension: 0.1,
		    backgroundColor: "rgba(75,192,192,0.4)",
		    borderColor: "rgba(75,192,192,1)",
		    borderCapStyle: 'butt',
		    borderDash: [],
		    borderDashOffset: 0.0,
		    borderJoinStyle: 'miter',
		    pointBorderColor: "rgba(75,192,192,1)",
		    pointBackgroundColor: "#fff",
		    pointBorderWidth: 1,
		    pointHoverRadius: 5,
		    pointHoverBackgroundColor: "rgba(75,192,192,1)",
		    pointHoverBorderColor: "rgba(220,220,220,1)",
		    pointHoverBorderWidth: 2,
		    pointRadius: 5,
		    pointHitRadius: 10,
		    data: dataArray2},	  
	    ]
	};

	let option = {
		showLines: true,
	};
	let myChart = Chart.Line(ctx,{
		data:chartData,
	  	options:option
	});
};	

function displayChart(htmlElement, label, datasetLabel, dataArray){
	let ctx = $(htmlElement);	//"#myTipsPercentageChart"
	let chartData = {
	    labels: label,	//"dates"
	    datasets: [	    {
		    label: datasetLabel,
		    fill: false,
		    lineTension: 0.1,
		    backgroundColor: "rgba(75,192,192,0.4)",
		    borderColor: "rgba(75,192,192,1)",
		    borderCapStyle: 'butt',
		    borderDash: [],
		    borderDashOffset: 0.0,
		    borderJoinStyle: 'miter',
		    pointBorderColor: "rgba(75,192,192,1)",
		    pointBackgroundColor: "#fff",
		    pointBorderWidth: 1,
		    pointHoverRadius: 5,
		    pointHoverBackgroundColor: "rgba(75,192,192,1)",
		    pointHoverBorderColor: "rgba(220,220,220,1)",
		    pointHoverBorderWidth: 2,
		    pointRadius: 5,
		    pointHitRadius: 10,
		    data: dataArray
			}
	    ]
	};

	let option = {
		showLines: true,
	};
	let myChart = Chart.Line(ctx,{
		data:chartData,
	  	options:option
	});
};

// Adding this for getting and comparing week numbers
Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

function compareWeek(date1, date2){
	if(new Date(date1).getWeekNumber() == new Date(date2).getWeekNumber()){
		return true;
	} else {
		return false;
	};
};

function compareMonth(date1, date2){
	if(new Date(date1).getMonth() == new Date(date2).getMonth()){
		return true;
	} else {
		return false;
	};
};

function submitListener(){
    $('.viewDataFromSel').on("change", function(e){
    	e.preventDefault();
		viewDataFrom = $('.viewDataFromSel option:selected').val();
    	if(viewDataFrom == "selectRange"){
    		$('.resetDate').show();
    	} else {		
    		$('.resetDate').hide();
    	};
    });
    $('.groupDataBySel').on("change", function(e){
    	e.preventDefault();
    	groupDataBy = $('.groupDataBySel option:selected').val();
    });

    $('.js_ViewGraphsBtn').on('click', function(e){
    	e.preventDefault();
    	let quit = false;
    	if(!groupDataBy || groupDataBy == 0){
    		alert("Please enter how you want your data grouped");
    		quit = true;
    	};
    	if(!viewDataFrom || viewDataFrom == 0){
    		alert("Please enter a time span for your data request");
    		quit = true;
    	}
    	if(!quit){
    		getAndDisplayDatedData();
    	}
    });
};

// This function will also stay
function getAndDisplayDatedData(){
	getDatedDataFuncion(displayData);
};

$(function(){
	checkUser(submitListener);
});