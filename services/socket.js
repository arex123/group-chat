const socket = require("socket.io");
const {socketAuthenticate} = require('../middleware/authentication')
const {chats} = require('../controller/chat')

exports.socketConnect = (server) => {
  try {
    const io = require("socket.io")(server);

    io.on("connection", (socket) => {
      console.log("new User connected id:: ", socket.id);

      //join room
      socket.on('join-room',room=>{
        console.log("joined room success ",room)
        socket.join(room)
      })
      
      //send message
      socket.on('new-message',async(message,room,token,callback)=>{

        //check if user is authenticated

        let isAuthenticated =await socketAuthenticate(token)

        if(isAuthenticated.success==false){
            callback({status:false})
        }
        console.log("is aut ",isAuthenticated)



        //save message
        let reqobj = {
            body:{
                message:message,
                groupId:room
            },
            user:isAuthenticated.user
        }
        let isSaved = await chats(reqobj)
        if(isSaved){
                    callback({status:true,name:isAuthenticated.user.name})
                    socket.to(room).emit("received-message",message,isAuthenticated.user.name)
        }else{
            callback({status:"not saved"})
        }


      })

      
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

    });



  } catch (err) {
    console.error("err at socket ", err);
  }
};
