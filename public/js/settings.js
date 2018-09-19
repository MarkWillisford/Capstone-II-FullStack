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
        // $('.disabled').attr("disabled", false);
        // $('.disabled').removeClass("disabled");
        $('.settingsForm').show();
        $('.incomeGoalText').focus();



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

        // set up our object to store it
        let newSettings = {};

    	/**************************************************
    	* I'm not really happy with this architecture. 
    	* Maybe Michal can suggest something cleaner
    	* I think there is an example of something similar 
    	* in Thinkful's authentication section 
    	**************************************************/
        // a few flags 
        let changed = false;
        let error = false;
    	// check for empty strings, non numbers and below zero values.
        if(hourlyWage != ""){
            // there is input, check it
            if(!($.isNumeric( hourlyWage ) && hourlyWage > 0)){  
                // there is input but its bad
                $('.hourlyWageError').html('please enter valid data; your wage must be a number above 0');
                $('.hourlyWageText').val("");
                $('.hourlyWageText').focus();  
                error = true;
            } else {
                // new input is good, save it and set the changed tag to true
                newSettings.hourlyWage = $('.hourlyWageText').val();
                changed = true;
            }
        } else {
            // there is no new input, use old input
            newSettings.hourlyWage = settings.hourlyWage;
        }
        if(calHourlyWageGoal != ""){    // same story different variable and input
            if(!($.isNumeric( calHourlyWageGoal ) && calHourlyWageGoal > 0)){
                $('.calHourlyWageGoalError').html('please enter valid data; your hourly goal must be a number above 0');
                $('.calHourlyWageGoalText').val("");
                $('.calHourlyWageGoalText').focus();  
                error = true;
            } else {
                newSettings.monthlyHourlyGoal = $('.calHourlyWageGoalText').val();
                changed = true;
            }
        } else {
            // there is no new input, use old input
            newSettings.monthlyHourlyGoal = settings.monthlyHourlyGoal;
        }
    	if(incomeGoal != ""){
    		if(!($.isNumeric( incomeGoal ) && incomeGoal > 0)){
    			$('.incomeGoalError').html('please enter valid data; your income goal must be a number above 0');
                $('.incomeGoalText').val("");
                $('.incomeGoalText').focus();
                error = true;
    		} else {
                newSettings.monthlyIncomeGoal = $('.incomeGoalText').val();
                changed = true;
            }
    	} else {
            // there is no new input, use old input
            newSettings.monthlyIncomeGoal = settings.monthlyIncomeGoal;
        }

        // if there is an error, return out without sending
        if(error){
            return;
        }

        // If changed, Ajax call with new object
        if(changed){
            const token = sessionStorage.getItem('token');
            // add the id to the newSettings
            newSettings.id = globalUser_id;
            // lets see what we are about to send
            console.log('sending: ');
            console.log(newSettings);

            $.ajax({
                url: '/api/users',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: newSettings,
                success: (response) => {
                    location.href = '/home.html';
                }
            });         
        }

    });
}

function runApp(){
    editSettingsBtnListener();
    submitListener();    
    displayUserSettings();
}

$(function(){
	checkUser(runApp);
});