const authService = require('./auth.service');

exports.signIn = (req, res) => {
    authService.signIn(req, res);
}

exports.signUp = (req, res) => {
    authService.signUp(req, res);
}

exports.signOut = (req, res) => {
    console.log('AuthController.signOut');
    authService.signOut(req, res);
}