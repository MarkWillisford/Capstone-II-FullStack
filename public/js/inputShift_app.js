'use strict';

let globalUser_id = '';
const fp = flatpickr(".resetDate", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
}); // flatpickr

function inputListener(){
    $('.newShiftForm').on('submit', function(e){
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
};

function confirmationListener(){
    $('.confirmationBtn').on('click', function(e){
        ajaxCall('/index.html');
    });
};

function confirmation_anotherListener(){
    $('.confirmation_anotherBtn').on('click', function(e){
        ajaxCall('/input_shift.html');
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
}

function ajaxCall(destination){
// get the form data and put it in the newShift object
    let selectedDate = fp.selectedDates;

    let dataToSend = {
        user_id: `${globalUser_id}`,
        date: `${selectedDate[0]}`,
        day: `${selectedDate[0].getDay()}`,
        shift: `${$('.shiftSelect').val()}`,
        food: `${$('.newShiftFoodSales').val()}`,
        alcoholicBeverages: `${$('.newShiftAlcSales').val()}`,
        roomCharges: `${$('.newShiftRoomSales').val()}`,
        guests: `${$('.newShiftGuestCount').val()}`,
        support: `${$('.newShiftSupportTips').val()}`,
        bar: `${$('.newShiftBarTips').val()}`,
        servers: `${$('.newShiftServerTips').val()}`,
        kitchen: `${$('.newShiftKitchenTips').val()}`,
        netTips: `${$('.newShiftNetTips').val()}`,
        hours: `${$('.newShiftHours').val()}`,
    };
    
    $.ajax({
        url: '/api/shifts',
        method: 'POST',
        data: dataToSend,
        success: (response) => {
            console.log('success');
            location.href = destination; 
        }
    })
}

$(function(){
	checkUser(inputListener);	
});