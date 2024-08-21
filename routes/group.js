const express = require('express')
const { authenticate } = require('../middleware/authentication')

const router = express.Router()
const groupController = require('../controller/group')
//create group
//delete group
//add users
//remove users

router.post('/createGroup',authenticate, groupController.createGroup)

router.post('/addUserToGroup',authenticate,groupController.addUserToGroup)

router.get('/getUserGroups',authenticate,groupController.getUserGroups)

router.get('/getGroupMessages/:id',authenticate,groupController.getGroupMessages)

router.get('/groupInfo/:id',groupController.groupInfo)




module.exports = router