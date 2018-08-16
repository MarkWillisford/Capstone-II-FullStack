// takes all the field strings and combines them into an array
module.exports = (...fields) => (req, res, next) => {
    // loops through that array
    for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        // makes sure it is in the array
        if (!(field in req.body)) {
            const message = `There is missing ${field} in your request body`;
            return res.status(400).json({
                generalMessage: 'Validation Error',
                messages: [message],
            });
        }
    }
    return next();
};