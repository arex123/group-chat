const Chat = require("../models/chat")

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
    try{

        let messages = await Chat.findAll()

        res.status(200).json({
            success:true,
            messages
        })
        
    }catch(err){
        console.log("err while getting chats: ",err)
        res.status(500).json({
            success:false
        })
    }
}