'use strict';

let globalUser_id = '';
let dataToSend = { };
let dataToCompare = { };

const fpDate = flatpickr(".dateOfCheck", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
}); // flatpickr

const fpPayPeriod = flatpickr(".payperiod", {
    mode: 'range',
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
}); // flatpickr

const payPeriodPromiseCall = new Promise((resolve, reject) => {
    setTimeout(function () {
    resolve('in promise: ');
  }, 1000);
});

function inputListener(){
    $('.newPaycheckForm').on('submit', function(e){
	    e.preventDefault();
    	// get the form data and put it in the newShift object
		let dateOfCheckArray = fpDate.selectedDates;
        let payPeriodArray = fpPayPeriod.selectedDates;

		dataToSend = {
            user_id: `${globalUser_id}`,
            dateOfCheck: `${dateOfCheckArray[0]}`,
            startDate: `${payPeriodArray[0]}`,
            endDate: `${payPeriodArray[1]}`,
            hours: `${$('.newPaycheckHours').val()}`,
            wages: `${$('.newPaycheckWages').val()}`,
            declaredTips: `${$('.newPaycheckTips').val()}`,
            taxes: `${$('.newPaycheckTaxes').val()}`,
            netPay: `${$('.newPaycheckNetPay').val()}`,
        };

        console.log('in listener: ');
            console.log(dataToSend);
        dataToCompare = { };
        payPeriodPromiseCall.then(msg => {
            console.log('in then: ');
            console.log(msg);
        });
        // we need an ajax call to compare our check to. It needs to be in a promise so we 
        // wait before attempting the compare . . .   



/*

	    $.ajax({
	        url: '/api/paychecks',
	        method: 'POST',
	        data: dataToSend,
	        success: (response) => {
	            console.log('success');
	            location.href = '/index.html';
	        }
	    })	

*/



    });
}

$(function(){
	checkUser(inputListener);	
});