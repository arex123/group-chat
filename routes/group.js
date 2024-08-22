const express = require('express')
const { authenticate } = require('../middleware/authentication')

const router = express.Router()
const groupController = require('../controller/group')
//create group
//delete group
//add users
//remove users

router.post('/createGroup',authenticate, groupController.createGroup)

// router.post('/addUserToGroup',authenticate,groupController.addUserToGroup)

router.get('/getUserGroups',authenticate,groupController.getUserGroups)

router.get('/getGroupMessages/:id',authenticate,groupController.getGroupMessages)

router.get('/groupInfo/:id',authenticate,groupController.groupInfo)

router.post('/updateGroupNameOrDesc',authenticate,groupController.updateGroupNameOrDesc)

router.post('/makeAdmin',authenticate,groupController.makeAdmin)

router.post('/removeMember',authenticate,groupController.removeMember)

router.get('/:groupId/usersOutsideGroup',authenticate,groupController.usersOutsideGroup)

router.delete('/deleteGroup/:groupId',authenticate,groupController.deleteGroup)

router.post('/leaveGroup',authenticate,groupController.leaveGroup)

module.exports = router