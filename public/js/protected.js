function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function checkUser() {
    const token = sessionStorage.getItem('token');
    if(!token) {    // If the user is not logged in, send them to the Login Screen
        location.href = 'http://localhost:8080/login.html';
    } else {    // If the user is logged in, check to make sure its a valid token
        $.ajax({
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                console.log(response)
                $('#loader-wrapper').hide();
                const payloadData = parseJwt(token);
                $('#email').text(`Welcome back: ${payloadData.email}`)
            },
            error: () => {
                sessionStorage.removeItem('token');
                location.href = 'http://localhost:8080/login.html';
            }
        })
    }
}