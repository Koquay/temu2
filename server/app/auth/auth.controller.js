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

exports.getVerificationCode = (req, res) => {
    console.log('AuthController.getVerificationCode');
    authService.getVerificationCode(req, res);
}

exports.changePassword = (req, res) => {
    console.log('AuthController.changePassword');
    authService.changePassword(req, res);
}