const authService = require('./auth.service');

exports.signIn = (req, res) => {
    authService.signIn(req, res);
}

exports.signUp = (req, res) => {
    authService.signUp(req, res);
}