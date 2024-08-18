const serverURL = "http://localhost:4002"
const button = document.getElementById('sendChat')
button.addEventListener('click',async ()=>{

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
        console.log("result ",result)
    }catch(err){
        console.log("error : ",err)
    }
    
})