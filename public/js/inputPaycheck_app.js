'use strict';

let globalUser_id = '';
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

function inputListener(){
    $('.newPaycheckForm').on('submit', function(e){
	    e.preventDefault();
	    console.log('in listener function');
    	// get the form data and put it in the newShift object
		let dateOfCheckArray = fpDate.selectedDates;
        let payPeriodArray = fpPayPeriod.selectedDates;

		let dataToSend = {
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
	    console.log(dataToSend);
	    $.ajax({
	        url: '/api/paychecks',
	        method: 'POST',
	        data: dataToSend,
	        success: (response) => {
	            console.log('success');
	            //sessionStorage.setItem('token', response.token);			// <-- this isn't working. 
	            location.href = '/index.html';
	        }
	    })	
    });
}

$(function(){
	checkUser();
	inputListener();
});