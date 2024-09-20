function checkAdminLogin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login'); // Redirect to login if not authenticated
}

module.exports= checkAdminLogin;
