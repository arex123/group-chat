const serverURL = "http://localhost:4002"
const button = document.getElementById('sendChat')


var btn = document.getElementById('message');

btn.onkeydown = function (e) {
    var keyCode = e.keyCode || e.which;
    if(keyCode==13) {
     sendMessage()
    }
};

button.addEventListener('click',async ()=>sendMessage())

async function sendMessage(){

    try{        
        console.log("submit button clicked")
        let new_message = document.getElementById('message').value
        if(new_message.trim().length==0){
            return
        }
        document.getElementById('message').value = ""
        console.log("new message: ",new_message)
        const token = localStorage.getItem('token')
        let result  = await axios.post(serverURL+"/chat",{message:new_message},{
            headers:{
                'Authorization':token
            }
        })
        getAllChats()
        console.log("result ",result)
    }catch(err){
        console.log("error : ",err)
    }

}

document.addEventListener("DOMContentLoaded", async() => getAllChats())

async function getAllChats(){
    let token = localStorage.getItem('token')
    try{

        let result = await axios.get(serverURL+"/getChats",{
            headers:{
                Authorization:token
            }
        })

        console.log("Results",result)
        let chat_data = result.data.messages
        document.querySelector('.chat-list').innerHTML=''
        for(let i=0;i<chat_data.length;i++){
            ShowChatOnScreen(chat_data[i])
        }

    }catch(err){
        console.log("erradf ",err)
    }
}
function ShowChatOnScreen(obj){

    let chatCont = document.querySelector('.chat-list')    
    let ptag = document.createElement('p')
    ptag.textContent = obj.message
    chatCont.appendChild(ptag)

}