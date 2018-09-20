'use strict';

function myGetFunction(globalUser_id){
	console.log('in my get function, id is:' + globalUser_id);
	$.ajax({
		url: '/api/shifts',
	    type: 'GET',
        data: {
            user_id: globalUser_id,
        },
	    success: (response) => {
	    	console.log(response);
        },
	    error: function(err) { console.log(err); }
	});
};