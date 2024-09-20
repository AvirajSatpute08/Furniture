const jwt = require('jsonwebtoken');
const jwtSecret = "thisismynewtoken";  // Replace with your secret key

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.cookies.token;  // Retrieve token from cookie

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);  // Verify token
        req.user = decoded;  // Add user data to request object
        next();  // Continue to the next middleware/route
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = verifyToken;
