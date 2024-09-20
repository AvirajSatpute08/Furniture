function checkLogin(req, res, next) {
    if (req.session && req.session.c_id) {
        next(); // Continue to the next middleware or route handler
    } else {
        res.redirect('/login'); // Redirect to login if the user is not logged in
    }
}