const { where, Op, Model } = require("sequelize");
const Group = require("../models/group");
const User = require("../models/user");
const UserGroup = require("../models/usergroup");
const Chat = require("../models/chat");
const sequelize = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  console.log(
    "req body : ",
    req.body,
    req.user.id,
    req.user.name,
    req.body.selectedUserForGroup
  );

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
        role: "member",
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

// exports.addUserToGroup = async (req, res, next) => {
//   console.log("add user to group method");

//   let { userToAdd, groupId } = req.body;

//   try {
//     let isAdmin = await UserGroup.findOne({
//       where: {
//         userId: req.user.id,
//         role: "admin",
//         groupId: groupId,
//       },
//     });
//     if (!isAdmin) {
//       res.status(403).json({
//         error: "You do not have permission to add users to this group",
//       });
//     }

//     await UserGroup.create({ userId: userToAdd, groupId: groupId });
//     res.status(200).json({ message: "User added to group successfully" });
//   } catch (err) {
//     console.error("err while adding new user to group", err);
//     res.status(500).json({ error: "Failed to add user to group" });
//   }
// };

exports.getUserGroups = async (req, res, next) => {
  console.log("getting user group");

  try {
    let groups = await req.user.getGroups({
      attributes: ["id", "groupName", "groupOwnerId"],
      joinTableAttributes: [], // Exclude all attributes from the join table (UserGroup)
    });

    res.json(groups);
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

    console.log("gp id ", groupId);

    //check if user is part of group
    let isMemberorAdmin = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
      },
    });
    if (!isMemberorAdmin) {
      res.status(403).json({ error: "User not part of group" });
    } else {
      let messages = await Chat.findAll({
        where: {
          groupid: groupId,
        },
        attributes: ["id", "message", "messageOwner", "userId"],
      });

      res.status(200).json({ messages, currUser: req.user.id });
    }
  } catch (err) {
    console.error("error while getting group messages ", err);
    res.status(500).json({ error: "Failed to load group messages" });
  }
};

exports.groupInfo = async (req, res, next) => {
  try {
    let groupId = req.params.id;

    let groupDetail = await Group.findOne({
      where: {
        id: groupId,
      },
      attributes: ["id", "groupName", "groupDescription", "createdAt"],
      include: [
        {
          model: User,
          where: {
            id: {
              [Op.not]: req.user.id,
            },
          },
          attributes: ["id", "name", "phone", "email"],
          through: { attributes: ["role"] },
        },
      ],
      order: [[User, UserGroup, "role", "ASC"]],
    });

    let currUserCreatorCheck = await Group.findOne({
      where: {
        id: groupId,
        groupOwnerId: req.user.id,
      },
    });
    let isCreator = true;
    if (!currUserCreatorCheck) {
      isCreator = false;
    }

    let currUserAdminCheck = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
        role: "admin",
      },
    });

    let isAdmin = true;
    if (!currUserAdminCheck) {
      isAdmin = false;
    }

    res.json({
      groupDetail,
      isCreator,
      isAdmin,
      currUser: req.user,
    });
  } catch (err) {
    console.error("Error while getting users of current group ", err);
    res
      .status(500)
      .json({ error: "Error while getting users of current group" });
  }
};

exports.updateGroupNameOrDesc = async (req, res, next) => {
  try {
    //check if user is admin
    let isEligible = await isUserAdmin(req.user.id, req.body.groupId);
    if (!isEligible) {
      throw new Error("Members can't update group name");
    }

    let filedToUpdate = "";
    let newText = "";
    if (req.body.groupName) {
      filedToUpdate = "groupName";
      newText = req.body.groupName;
    } else {
      filedToUpdate = "groupDescription";
      newText = req.body.groupDescription;
    }

    let [affectedRows] = await Group.update(
      {
        [filedToUpdate]: newText,
      },
      {
        where: {
          id: req.body.groupId,
        },
      }
    );

    if (affectedRows > 0) {
      res.json({ success: true });
    } else {
      throw new Error("Group not found or something else went wrong");
    }
  } catch (error) {
    console.log("err while updating group name or desc ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    console.log("req,bo dy ",req.body)
    //check if user is admin
    let isEligible = await isUserAdmin(req.user.id, req.body.groupId);
    console.info("iseligible ", isEligible);

    if (!isEligible) {
      throw new Error("Members can't make admin");
    }

    let [affectedRows] = await UserGroup.update(
      { role: "admin" },
      {
        where: {
          userId: req.body.userId,
          groupId: req.body.groupId,
        },
      }
    );

    console.log("afeecte ", affectedRows);

    if (affectedRows > 0) {
      res.json({ success: true });
    } else {
      throw new Error("User not found in the group or could not be made admin");
    }
  } catch (error) {
    console.log("err while creating new admin ", error);
    res.status(500).json({ error: error.message });
  }
};

async function isUserAdmin(uid, gid) {
  try {
    let result = await UserGroup.findOne({
      where: {
        userId: uid,
        groupId: gid,
        role: "admin",
      },
    });

    if (result) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

exports.removeMember = async (req, res, next) => {
  try {
    //check if user is admin
    let isEligible = await isUserAdmin(req.user.id, req.body.groupId);
    console.info("iseligible ", isEligible,req.body);

    if (!isEligible) {
      throw new Error("Members can't remove members");
    }

    let affectedRows = await UserGroup.destroy({
      where: {
        userId: req.body.userId,
        groupId: req.body.groupId,
      },
    });

    console.log("afeecte ", affectedRows);

    if (affectedRows > 0) {
      res.json({ success: true });
    } else {
      throw new Error("User not found in the group or could not be removed");
    }
  } catch (error) {
    console.log("err while removing user from group ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.usersOutsideGroup = async (req, res, next) => {
  try {
    let groupId = req.params.groupId;

    const usersNotInGroup = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone'],
      include: [
        {
          model: Group,
          attributes: [],
          where: { id: groupId },
          through: { attributes: [] },
          required: false, // LEFT JOIN
        }
      ],
      where: {
        '$Groups.id$': {
          [Op.is]: null // Users not in the specified group
        }
      }
    });

    res.json(usersNotInGroup);
  } catch (error) {
    console.error("error while getting users outside current group");
    res.status(500).json({ error: error.message });
  }
};


exports.deleteGroup = async(req,res,next)=>{
  const t = await sequelize.transaction()
  try {
    let groupId = req.params.groupId
    //check if user is admin
    let isEligible = await isUserAdmin(req.user.id,groupId);
    console.info("iseligible ", isEligible);

    if (!isEligible) {
      throw new Error("Members can't delete group");
    }



    let delGrp = await Group.destroy({
      where: {
        id:groupId
      },
      transaction:t
    });

    console.log("delGrp ", delGrp);

    if(delGrp==0){
      throw new Error("Group not found")
    }

    await UserGroup.destroy({
      where:{
        groupId:groupId
      },
      transaction:t
    })

    await t.commit()
    res.json({ success: true });
    
  } catch (error) {
    await t.rollback()
    console.log("err while deleting the group ", error);
    res.status(500).json({ error: error.message });
  }
}

exports.leaveGroup = async (req,res,next)=>{
  try{
    //check if user is admin and only admin

    let groupId = req.body.groupId
    let userId = req.user.id

    let isAdmin = await UserGroup.findOne({
      where:{
        userId,
        groupId,
        role:'admin'
      }
    })

    console.log("checking is admin ",isAdmin)

    if(isAdmin){
      //check if he is only admin
      let adminCounts = await UserGroup.count({
        where:{
          groupId,
          role:'admin' 
        }
      })

      console.log("total number of admin ",adminCounts)

      if(adminCounts==1){
        throw new Error("Please Delete the group before leaving")
      }

    }
    
    await UserGroup.destroy({
      where:{
        userId,
        groupId
      }
    })

    res.json({success:true})


  }catch(error){
    res.status(500).json({error:error.message})
  }
}