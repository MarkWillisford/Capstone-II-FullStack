function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function checkUser() {
    const token = sessionStorage.getItem('token');
    if(!token) {    // If the user is not logged in, send them to the Login Screen
        console.log('not logged in');
        location.href = 'http://localhost:8080/login.html';
    } else {    // If the user is logged in, check to make sure its a valid token
        $.ajax({
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                $('#loader-wrapper').hide();
                const payloadData = parseJwt(token);
                $('.js_User').html(`${payloadData.username}`);
                globalUser_id = payloadData._id;
            },
            error: () => {
                console.log('bad token');
                sessionStorage.removeItem('token');
                location.href = 'http://localhost:8080/login.html';
            }
        })
    }
}