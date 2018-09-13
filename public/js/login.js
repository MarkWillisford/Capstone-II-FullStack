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
                // do cool html stuff
            }
        })
    });
    
    /*
    let data = {
            email: $('.loginEmailText').val(),
            password: $('.loginPasswordText').val(),
        };

    if(JSON.stringify(data) === JSON.stringify(user)){
            sessionStorage.setItem('token', response.token);
            location.href = '/home.html';        
    } else {
        alert("Please enter a valid user and password");
    }   */
  };

function signupListener(){
    $('.signupBtn').on('click', function(){
        console.log('within singup link function');
        window.location = "http://www.google.com/";    
    });
}

$(function(){
    loginListener();
    signupListener();
});