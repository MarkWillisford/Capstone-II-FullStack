'use strict';

let globalUser_id = '';
let settings = {};

/*
// This function will save our user settings into our setting object
function displayUserSettings(){	
	$('.js_incomeGoalSpan').html(user_Settings.monthlyIncomeGoal);
	$('.js_calHourlyWageGoalSpan').html(user_Settings.monthlyHourlyGoal);
	$('.js_hourlyWageSpan').html(user_Settings.hourlyWage);
	settings.monthlyIncomeGoal = user_Settings.monthlyIncomeGoal;
	settings.monthlyHourlyGoal = user_Settings.monthlyHourlyGoal;
	settings.hourlyWage = user_Settings.hourlyWage;
}
*/

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
        // turn off error messages (just in case)
        $('.incomeGoalError').html("");
        $('.calHourlyWageGoalText').html("");
        $('.hourlyWageText').html("");

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
        let error = false;
    	// check for empty strings, non numbers and below zero values.
        if(hourlyWage != ""){
            if(!($.isNumeric( hourlyWage ) && hourlyWage > 0)){  
                $('.hourlyWageError').html('please enter valid data; your wage must be a number above 0');
                $('.hourlyWageText').val("");
                $('.hourlyWageText').focus();  
                error = true;
            }
        }
        if(calHourlyWageGoal != ""){
            if(!($.isNumeric( calHourlyWageGoal ) && calHourlyWageGoal > 0)){
                $('.calHourlyWageGoalError').html('please enter valid data; your hourly goal must be a number above 0');
                $('.calHourlyWageGoalText').val("");
                $('.calHourlyWageGoalText').focus();  
                error = true;
            }
        }
    	if(incomeGoal != ""){
    		if(!($.isNumeric( incomeGoal ) && incomeGoal > 0)){
    			$('.incomeGoalError').html('please enter valid data; your income goal must be a number above 0');
                $('.incomeGoalText').val("");
                $('.incomeGoalText').focus();
                error = true;
    		}
    	}
        if(error){
            return;
        }

        // create new settings object
        let newSettings = {};
        newSettings.monthlyIncomeGoal = $('.incomeGoalText').val();
        newSettings.monthlyHourlyGoal = $('.calHourlyWageGoalText').val();
        newSettings.hourlyWage = $('.hourlyWageText').val();

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