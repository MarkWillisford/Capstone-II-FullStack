'use strict';

function buttonListener(){
	$('#loginButton').on('click', function(){
        $('.loginForm').show();
        $('#loginButton').css("background-color","#800000");
        $('.signupForm').hide();
        $('#signupButton').css("background-color","#400000");
	});

	$('#signupButton').on('click', function(){
        $('.loginForm').hide();
        $('#loginButton').css("background-color","#400000");
        $('.signupForm').show();
        $('#signupButton').css("background-color","#800000");
	});
};

$(function(){
	buttonListener();
});