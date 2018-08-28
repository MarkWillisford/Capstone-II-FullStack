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
	    console.log('in listener function');
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
	    console.log(dataToSend);
	    $.ajax({
	        url: '/api/shifts',
	        method: 'POST',
	        data: dataToSend,
	        success: (response) => {
	            console.log('success');
	            location.href = '/index.html';
	        }
	    })	
    });
}

$(function(){
	checkUser(inputListener);	
});