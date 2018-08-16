'use strict';


function myFunction() {
    alert($('.signupEmailText').val());
    $.ajax({
        url: '/users/signup.html',
        method: 'POST',
        data: {
            email: `${$('.signupEmailText').val()}`,
            username: `${$('.signupUserNameText').val()}`,
            password: `${$('.signupPasswordText').val()}`,
        },
        success: (response) => {
            sessionStorage.setItem('token', response.token);
            location.href = '/home.html';
        }
    })
};


/*
$(function myfunction() {
    //$('.submitButton').click(() => {
    	console.log($('.signupEmailText').text);
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
    //})
})*/