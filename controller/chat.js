const Chat = require("../models/chat")
const { Op } = require('sequelize');
const User = require("../models/user");

exports.chats =async (req,res,next)=>{
    console.log("req body for chats ",req.body)

    try{

        await req.user.createChat({
            message:req.body.message
        })
        res.status(200).json({
            success:true
        })
    }catch(err){
        console.log("chat.js err", err)
        res.status(500).json({
            success:false
        })
    }
}

exports.getChats = async (req,res,next)=>{
    console.log("param ",req.params)
    try{
        let getChatFromId = req.params?.id || 0

        let messages1 = await Chat.findAll({
            where: {
                id: {
                    [Op.gt]: getChatFromId
                }
            },
            attributes: [
                "id",
                "message"
            ],
            include: [
                {
                    model: User,
                    attributes: [
                        "name"
                    ]
                }
            ]
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