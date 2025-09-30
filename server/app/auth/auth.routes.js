const router = require('express').Router();
const authController = require('./auth.controller');

router.post('/', authController.signUp)
router.put('/', authController.signIn)
router.post('/signOut', authController.signOut)
router.get('/verification-code', authController.getVerificationCode)
router.put('/change-password', authController.changePassword)

module.exports = router;