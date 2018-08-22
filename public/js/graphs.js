'use strict';

const fp = flatpickr(".resetDate", {
    mode: 'range',
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
}); // flatpickr

function getDatedDataFuncion(callbackFn){
	let selectedDates = fp.selectedDates;
	let selectedData = [];

	for(let i=0; i<MOCK_SHIFT_DATA.shifts.length; i++){
		//let setDate = flatpickr.parseDate("2018-08-10", "Y-m-d");
		let dateToTest = flatpickr.parseDate(MOCK_SHIFT_DATA.shifts[i].date, "d-m-y");
		if(!(dateToTest < selectedDates[0]) && !(dateToTest > selectedDates[1])){
			selectedData.push(MOCK_SHIFT_DATA.shifts[i]);
		}
	}

	setTimeout(function(){ callbackFn(		selectedData		)}, 100);
};

function displayData(data){
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

	// iterate through our data to build our dataSet
	for(let i=0; i<data.length; i++){
		dataSet.dates.push(data[i].date);		
		dataSet["net tips"].push(data[i]["net tips"]);
		dataSet["tip %"].push( + // calculations and the toFixed() to make it a %
			(	
				(100 * data[i]["net tips"] / 
					(data[i]["sales"]["food and NA beverages"] +
					data[i]["sales"]["alcoholic beverages"] + 
					data[i]["sales"]["room charges"])
				).toFixed(2)
			)
		);
		dataSet["calculated hourly"].push( + // calculations and the toFixed() to make it a $
			(
				(12.5 + (data[i]["net tips"] / data[i]["hours"])
				).toFixed(2)
			) 
		);
		dataSet["net sales"].push((
			data[i]["sales"]["food and NA beverages"] +
			data[i]["sales"]["alcoholic beverages"] + 
			data[i]["sales"]["room charges"]
			));
		dataSet["alcohol sales"].push(data[i]["sales"]["alcoholic beverages"]);
		dataSet["alcohol %"].push( + // calculations and the toFixed() to make it a %
			(
				(100 * data[i]["sales"]["alcoholic beverages"] /
					(data[i]["sales"]["food and NA beverages"] + 
						data[i]["sales"]["alcoholic beverages"])
				).toFixed(0)
			)
		);
		dataSet["ppa"].push( + // calculations and the toFixed() to make it a $
			(
				((data[i]["sales"]["food and NA beverages"] + 
					data[i]["sales"]["alcoholic beverages"]) / 
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
		/*	This will set the chart Y-axis to begin at 0
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }*/
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
		/*	This will set the chart Y-axis to begin at 0
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }*/
	};
	let myChart = Chart.Line(ctx,{
		data:chartData,
	  	options:option
	});
};

// This function will also stay
function getAndDisplayDatedData(){
	getDatedDataFuncion(displayData);
};