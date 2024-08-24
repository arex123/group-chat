const socket = require("socket.io");
const { socketAuthenticate } = require("../middleware/authentication");
const { chats } = require("../controller/chat");
const { uploadToS3 } = require("../services/s3Service");
exports.socketConnect = (server) => {
  try {
    const io = require("socket.io")(server);

    io.on("connection", (socket) => {
      console.log("new User connected id:: ", socket.id);

      //join room
      socket.on("join-room", (room) => {
        console.log("joined room success ", room);
        socket.join(room);
      });

      //send message
      socket.on("new-message", async (message, room, token, callback) => {
        //check if user is authenticated

        let isAuthenticated = await socketAuthenticate(token);

        if (isAuthenticated.success == false) {
          callback({ status: false });
        }
        console.log("is aut ", isAuthenticated);

        //save message
        let reqobj = {
          body: {
            message: message,
            groupId: room,
            isImage:false
          },
          user: isAuthenticated.user,
        };
        let isSaved = await chats(reqobj);
        if (isSaved) {
          callback({ status: true, name: isAuthenticated.user.name });
          socket
            .to(room)
            .emit("received-message", message, isAuthenticated.user.name,false);
        } else {
          callback({ status: "not saved" });
        }
      });

      //send img message
      socket.on(
        "new-img-message",
        async (file, fileName, room, token, callback) => {
          //check if user is authenticated

          console.log("5666 ", file);

          let isAuthenticated = await socketAuthenticate(token);

          if (isAuthenticated.success == false) {
            callback({ status: false });
          }
          console.log("is aut ", isAuthenticated);

          console.log("fie file: ", file);

          //save img file to s3 get url and send it to group users
          let newfilename = `group-${room}-${new Date()}-${fileName}`;
          console.log("name of file: ", newfilename);
          try {
            const fileUrl = await uploadToS3(newfilename, file);
            console.log("fileurl ;;  ", fileUrl);
            //save message
            let reqobj = {
              body: {
                message: fileUrl,
                groupId: room,
                isImage:true
              },
              user: isAuthenticated.user,
            };
            let isSaved = await chats(reqobj);
            if (isSaved) {
              callback({ status: true, name: isAuthenticated.user.name,fileUrl });
              socket
                .to(room)
                .emit("received-message", fileUrl, isAuthenticated.user.name,true);
            } else {
              callback({ status: "not saved" });
            }
          } catch (err) {
            callback({ status: "not saved" });
            console.log("err ", err);
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    console.error("err at socket ", err);
  }
};
