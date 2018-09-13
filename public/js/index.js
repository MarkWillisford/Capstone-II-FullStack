'use strict';

function loginListener(){
	$('.loginLink').on('click', function(){
		// alert('click!');
		// animateIt('fadeOutDown', '.toFade');
	});
};

function animateIt(x, div) {
    $(div).removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

    });
  };

$(function(){
	loginListener();
});