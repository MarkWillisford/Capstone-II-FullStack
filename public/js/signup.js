'use strict';

$(function() {
    $('.submitButton').click(() => {
    	console.log($('.signupEmailText').text);
    	/*
        $.ajax({
            url: '/users/signup.html',
            method: 'POST',
            data: {
                email: `${'.signupEmailText'}`,
                password: 'password',
            },
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/protected.html';
            }
        })
        */
    })
})