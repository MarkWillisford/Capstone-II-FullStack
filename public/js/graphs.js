'use strict';

/*$(".resetDate").flatpickr({
    mode: 'range',
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    wrap: true,
    weekNumbers: true,
});*/

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
	let selectedData = {};

	for(let i=0; i<MOCK_SHIFT_DATA.shifts.length; i++){
		//let setDate = flatpickr.parseDate("2018-08-10", "Y-m-d");
		let dateToTest = flatpickr.parseDate(MOCK_SHIFT_DATA.shifts[i].date, "d-m-y");
		if(!(dateToTest < selectedDates[0]) && !(dateToTest > selectedDates[1])){
			console.log('in range');
		} else {
			console.log('out of range');
		}
	}




	setTimeout(function(){ callbackFn(
		MOCK_SHIFT_DATA

		)}, 100);
};

function displayData(){

};

// This function will also stay
function getAndDisplayDatedData(){
	getDatedDataFuncion(displayData);
};