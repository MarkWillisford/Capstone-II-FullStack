'use strict';

function loginListener() {
    $('.loginForm').submit(function(e){
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: {
                email: $('.loginEmailText').val().trim(),
                password: $('.loginPasswordText').val().trim(),
            },
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/home.html';
            },
            error: (err) => {
                const errorMessage = JSON.parse(err.responseText);
                alert(errorMessage.generalMessage);
            }
        })
    });    
  };

function signupListener(){
    $('.signupBtn').on('click', function(){
        console.log('within singup link function');
        window.location = "http://www.google.com/";    
    });
}

$(function(){
    $('.loginEmailText').focus();
    loginListener();
});