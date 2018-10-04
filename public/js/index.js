'use strict';

function demoListener(){ 
	// 	// 6. load a custom welcome screen that walks the demo user through what has happened and where they can go next

	// });
    $('.demoLoginLink').on('click', function(){
         $.ajax({
            url: '/api/demo',
            method: 'POST',
            data: {
                email: 'demo@email.com',
                password: 'password',
            },
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/home.html';
            },
            error: (err) => {
                const errorMessage = JSON.parse(err.responseText);
                alert(errorMessage.generalMessage);
            }
        });
    })
};

$(function(){
	demoListener();
});