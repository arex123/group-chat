const { where } = require("sequelize");
const Group = require("../models/group");
const User = require("../models/user");
const UserGroup = require("../models/usergroup");
const Chat = require("../models/chat");

exports.createGroup = async (req, res, next) => {

  console.log("req body : ", req.body, req.user.id, req.user.name,req.body.selectedUserForGroup);

  try {
    const newGroup = await Group.create({
      groupName: req.body.name,
      groupOwnerId: req.user.id,
      groupOwnerName: req.user.name,
    });
    
    await UserGroup.create({
      userId: req.user.id,
      groupId: newGroup.id,
      role: "admin",
    });

    //create rest of users as member

    for (let id of req.body.selectedUserForGroup) {
      await UserGroup.create({
        userId: id,
        groupId: newGroup.id,
        role: 'member',
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Group created successfully", newGroup });
  } catch (err) {
    console.error("erro while creating group", err);
    res.status(500).json({ error: "Failed to create group" });
  }
};

exports.addUserToGroup = async (req, res, next) => {
  console.log("add user to group method");

  let { userToAdd, groupId } = req.body;

  try {
    let isAdmin = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        role: "admin",
        groupId: groupId,
      },
    });
    if (!isAdmin) {
      res.status(403).json({
        error: "You do not have permission to add users to this group",
      });
    }

    await UserGroup.create({ userId: userToAdd, groupId: groupId });
    res.status(200).json({ message: "User added to group successfully" });
  } catch (err) {
    console.error("err while adding new user to group", err);
    res.status(500).json({ error: "Failed to add user to group" });
  }
};

exports.getUserGroups = async (req, res, next) => {
  console.log("getting user group");

  try {
   
    let groups = await req.user.getGroups({
        
        attributes:[
            'id',
            'groupName',
            'groupOwnerId'
        ],
        joinTableAttributes: []     // Exclude all attributes from the join table (UserGroup)

    })

    res.json(groups)
  } catch (err) {
    console.error("error while getting user groups:", err);
    res.status(500).json({
      error: "error while getting user groups",
    });
  }
};

exports.getGroupMessages = async (req, res, next) => {
  try {
    // let getChatFromId = req.params.id;
    let groupId = req.params.id;

    console.log("gp id ",groupId)

    //check if user is part of group
    let isMemberorAdmin = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
      },
    });
    if (!isMemberorAdmin) {
      res.status(403).json({ error: "User not part of group" });
    }else{

      
      let messages = await Chat.findAll({
        where: {
          groupid: groupId,
        },
        attributes: [
          "id",
          "message",
          "messageOwner",
          'userId'
      ],
      });
      
      res.status(200).json({messages,currUser:req.user.id});
    }
  } catch (err) {
    console.error("error while getting group messages ", err);
    res.status(500).json({ error: "Failed to load group messages" });
  }
};
