const Chat = require("../models/chat")
const { Op } = require('sequelize');
const User = require("../models/user");

exports.chats =async (req,res,next)=>{
    
    try{
        console.log("req body for chats ",req.body)
        await req.user.createChat({
            message:req.body.message,
            messageOwner:req.user.name,
            groupId:req.body.groupId
        })
        // res.status(200).json({
        //     success:true
        // })
        return true
    }catch(err){
        console.log("chat.js err", err)
        // res.status(500).json({
            //     success:false
            // })
        return false
    }
}

exports.getChats = async (req,res,next)=>{
    console.log("param ",req.params)
    try{
        let getChatFromId = req.params.id 
        let groupId = req.params.groupId

        console.log("getChatFromId12 : ",getChatFromId)
        let messages1 = await Chat.findAll({
            where: {
                id: {
                    [Op.gt]: getChatFromId
                },
                groupId:groupId
            },
            attributes: [
                "id",
                "message",
                "messageOwner"
            ],
            // include: [
            //     {
            //         model: User,
            //         attributes: [
            //             "name"
            //         ]
            //     }
            // ]
        });

        res.status(200).json({
            success:true,
            messages1
        })
        
    }catch(err){
        console.log("err while getting chats: ",err)
        res.status(500).json({
            success:false
        })
    }
}