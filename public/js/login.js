'use strict';
/*
let user = {
    "email": "someemail@somewhere.com",
    "password": "password",
}*/


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
                debugger;
                sessionStorage.setItem('token', response.token);
                location.href = '/index.html';
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
    // ASK MICHAL!!!!!!
    //$('.signupBtn').click(function() {
        //console.log('within singup link function');
        // location.href = 'http://localhost:8080/signup.html'; <-- not working, goes back to login
        // window.open('http://localhost:8080/signup.html'); <--- works in a new tab . . .   
        // window.location = 'http://localhost:8080/signup.html'; <--- Also not working
    //});
    $('.signupBtn').on('click', function(){
        console.log('within singup link function');
        window.location = "http://www.google.com/";    
    });
}

$(function(){
    loginListener();
    signupListener();
});