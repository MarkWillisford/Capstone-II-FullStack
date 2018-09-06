'use strict';

let user_Settings = { };

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function checkUser(callback) {
    const token = sessionStorage.getItem('token');
    if(!token) { // If the user is not logged in, send them to the Login Screen
        console.log('not logged in');
        location.href = '/login.html';
    } else { // If the user is logged in, check to make sure its a valid token
        $.ajax({
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                //console.log(response)
                $('#loader-wrapper').hide();
                const payloadData = response; //parseJwt(token);
                $('.js_User').html(`${payloadData.username}`);
                globalUser_id = payloadData._id;
                console.log(payloadData);
                user_Settings = {
                    "monthlyIncomeGoal": payloadData.monthlyIncomeGoal,
                    "monthlyHourlyGoal": payloadData.monthlyHourlyGoal,
                    "hourlyWage": payloadData.hourlyWage,
                };
                console.log('in protected.js checkUser() success call. res is: ');
                console.log(user_Settings);
                callback();
            },
            error: () => {
                sessionStorage.removeItem('token');
                location.href = '/login.html';
            }
        })
    }
}