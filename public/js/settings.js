'use strict';

let globalUser_id = '';
let settings = {};

// This function will save our user settings into our setting object
function displayUserSettings(){	
	$('.js_incomeGoalSpan').html(user_Settings.monthlyIncomeGoal);
	$('.js_calHourlyWageGoalSpan').html(user_Settings.monthlyHourlyGoal);
	$('.js_hourlyWageSpan').html(user_Settings.hourlyWage);
	settings.monthlyIncomeGoal = user_Settings.monthlyIncomeGoal;
	settings.monthlyHourlyGoal = user_Settings.monthlyHourlyGoal;
	settings.hourlyWage = user_Settings.hourlyWage;
}

function editSettingsBtnListener(){
	$('.changeSettingsBtn').click(function(e){
        e.preventDefault();
        // enable the edit form
        $('.disabled').attr("disabled", false);
        $('.disabled').removeClass("disabled");
    });
}

function submitListener(){
	$('.settingsForm').submit(function(e){
        e.preventDefault();
        // varify input
        	// first capture it
        	let incomeGoal = $('.incomeGoalText').val();
        	let calHourlyWageGoal = $('.calHourlyWageGoalText').val();
        	let hourlyWage = $('.hourlyWageText').val();

        	/**************************************************
        	* I'm not really happy with this architecture. 
        	* Maybe Michal can suggest something cleaner
        	* I think there is an example of something similar 
        	* in Thinkful's authentication section 
        	**************************************************/

        	// check for empty strings, non numbers and below zero values.
        	if(incomeGoal != ""){
        		if(!($.isNumeric( incomeGoal ) && incomeGoal > 0)){
        			alert('please enter valid data');        		
        		}
        	}
        	if(calHourlyWageGoal != ""){
        		if(!($.isNumeric( calHourlyWageGoal ) && calHourlyWageGoal > 0)){
        			alert('please enter valid data');        		
        		}
        	}
        	if(hourlyWage != ""){
        		if(!($.isNumeric( hourlyWage ) && hourlyWage > 0)){
        			alert('please enter valid data');        		
        		}
        	}
        // create new settings object

        // Ajax call with new object
    });
}

function runApp(){
    editSettingsBtnListener();
    submitListener();    
}

$(function(){
	checkUser(runApp);
});