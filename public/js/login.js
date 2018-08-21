'use strict';
let user = {
    "email": "someemail@somewhere.com",
    "password": "password",
}


function myLoginFunction() {
    /*
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
        }
    })
    */
    let data = {
            email: $('.loginEmailText').val(),
            password: $('.loginPasswordText').val(),
        };

    if(JSON.stringify(data) === JSON.stringify(user)){
            sessionStorage.setItem('token', response.token);
            location.href = '/home.html';        
    } else {
        alert("Please enter a valid user and password");
    }
  };
