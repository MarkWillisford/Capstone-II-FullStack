'use strict';

function myFunction(e){
    e.preventDefault();
    $.ajax({
        url: '/api/users',
        method: 'POST',
        data: {
            email: `${$('.signupEmailText').val()}`,
            username: `${$('.signupUserNameText').val()}`,
            password: `${$('.signupPasswordText').val()}`,
        },
        success: (response) => {
            console.log('success');
            sessionStorage.setItem('token', response.token);
            location.href = '/index.html';
        }
    })
};

$(function(){
    $('.signupForm').submit(myFunction);
});