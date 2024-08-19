const serverURL = "http://localhost:4002";
const button = document.getElementById("sendChat");



var btn = document.getElementById("message");

btn.onkeydown = function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode == 13) {
    sendMessage();
  }
};

button.addEventListener("click", async () => sendMessage());

async function sendMessage() {
  try {
    console.log("submit button clicked");
    let new_message = document.getElementById("message").value;
    if (new_message.trim().length == 0) {
      return;
    }
    document.getElementById("message").value = "";
    console.log("new message: ", new_message);
    const token = localStorage.getItem("token");
    let result = await axios.post(
      serverURL + "/chat",
      { message: new_message },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    getAllChats();
    console.log("result ", result);
  } catch (err) {
    console.log("error : ", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  let messageStored = JSON.parse(localStorage.getItem('prevChats'))

  if(messageStored){
    for (let i = 0; i < messageStored.length; i++) {
        ShowChatOnScreen(messageStored[i]);
      }
  }
  getAllChats();
  setInterval(()=>{
    getAllChats()
  },1500)
});

async function getAllChats() {
  let token = localStorage.getItem("token");

  let messageStored = JSON.parse(localStorage.getItem('prevChats'))

  if(!messageStored){
    messageStored = []
  }

  let lastChatId = messageStored[messageStored.length-1]?.id



  try {
    let result = await axios.get(serverURL + `/getChats/${lastChatId}`, {
      headers: {
        Authorization: token,
      },
    });

    console.log("Results", result);
    let chat_data = result.data.messages1;


    // console.log("messageStored before : ",messageStored)
    // console.log("new chat_data ",chat_data)
    if(chat_data?.length)
        messageStored = messageStored.concat(chat_data)

    // console.log("messageStored after updation: ",messageStored)

    let len = messageStored.length
    if(len>15){
        let removeFrom = len - 15
        messageStored = messageStored.slice(removeFrom)
    }
    localStorage.setItem('prevChats',JSON.stringify(messageStored))

    // document.querySelector(".chat-list").innerHTML = "";
    for (let i = 0; i < chat_data.length; i++) {
      ShowChatOnScreen(chat_data[i]);
    }
  } catch (err) {
    if(err.response.status==401){
        window.location.href = "/login"
    }
    console.log("erradf ", err);
  }
}
function ShowChatOnScreen(obj) {
    console.log("obj ",obj)
  let chatCont = document.querySelector(".chat-list");
  let messageItem = document.createElement('div')
  messageItem.className = "messageItem"
  let username = document.createElement('p')
  username.textContent = obj?.user?.name ?? "null"
  let userMessage = document.createElement("p");
  userMessage.textContent = obj.message;

  messageItem.appendChild(username)
  messageItem.appendChild(userMessage)

  chatCont.appendChild(messageItem);
  chatCont.scrollTop = chatCont.scrollHeight
}
