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

// const payPeriodPromiseCall = new Promise((resolve, reject) => {
//     setTimeout(function () {
//     resolve('in promise: ');
//   }, 1000);
// });

function inputListener(){
    $('.newPaycheckForm').on('submit', function(e){
        e.preventDefault();
        confirmationListener();
        confirmation_anotherListener();
        cancelListener();

        $(".js_confirmation").show();
        $(".confirmationSpn").show();
        $(".cancelBtn").show();
        $(".confirmationBtn").show();
        $(".confirmation_anotherBtn").show();
    });
}

function confirmationListener(){
    $('.confirmationBtn').on('click', function(e){
        ajaxCall('/home.html');
    });
};

function confirmation_anotherListener(){
    $('.confirmation_anotherBtn').on('click', function(e){
        ajaxCall('/input_paycheck.html');
    });
};

function cancelListener(){
    $('.cancelBtn').on('click', function(e){
        $(".js_confirmation").hide();
        $(".confirmationSpn").hide();
        $(".cancelBtn").hide();
        $(".confirmationBtn").hide();
        $(".confirmation_anotherBtn").hide();       
        $(".shiftSelect").focus();
    });
};

function ajaxCall(destination){
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

    $.ajax({
        url: '/api/paychecks',
        method: 'POST',
        data: dataToSend,
        success: (response) => {
            console.log('success');
            location.href = destination; 
        }
    });
};

$(function(){
	checkUser(inputListener);	
});