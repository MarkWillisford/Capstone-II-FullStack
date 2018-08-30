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


// Get all for this month
// Get all for three months
	// Get all for a given day
// Get all for the year
	// Get all for a given day
// Get all for a range
