const express = require('express')
const router = express.Router()
const userController = require('../controller/user')
const {authenticate} = require('../middleware/authentication')
router.post('/register',userController.register)
router.post('/login',userController.login)

router.get('/findAll',authenticate,userController.getAllUsers)

module.exports = router