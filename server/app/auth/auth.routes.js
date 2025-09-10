const router = require('express').Router();
const authController = require('./auth.controller');

router.post('/', authController.signUp)
router.put('/', authController.signIn)
router.post('/signOut', authController.signOut)

module.exports = router;