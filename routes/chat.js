const express = require('express')
const { authenticate } = require('../middleware/authentication')
const { chats } = require('../controller/chat')
const router = express.Router()

router.post('/chat',authenticate,chats)

module.exports = router


