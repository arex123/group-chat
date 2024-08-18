
const serverURL = "http://localhost:4002"
let register = document.querySelector('#registerForm')
if(register)
register.addEventListener('submit',handleSubmit)

let login = document.querySelector('#signinForm')
if(login)
login.addEventListener('submit',handleLoginSubmit)

function handleSubmit(event) {
    console.log("submitting")
  event.preventDefault();
  const data = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: event.target.password.value,
    phone:event.target.phone.value
  };

  let signupbuttontag = document.querySelector('.signupbutton')
  let messageTag = document.createElement('p')
    console.log(data)
  axios
    .post(serverURL+"/user/register", data)
    .then((result) => {
      console.log(result);
      if(result.data?.success==false){
        messageTag.textContent = result.data?.message
        messageTag.id = "failed"
      }else{
        messageTag.textContent = result.data?.message
        messageTag.id = "success"
      }

      signupbuttontag.parentElement.appendChild(messageTag)

      let time = setTimeout(()=>{
        messageTag.remove()
      },3000)
    })
    .catch(err => {
      console.log("errr : ",err,err.response.data.message)
      messageTag.textContent = err.response.data.message
      messageTag.id = "failed"
      signupbuttontag.parentElement.appendChild(messageTag)

      
      let time = setTimeout(()=>{
        messageTag.remove()
      },3000)
    });
}

function handleLoginSubmit(event){
  event.preventDefault();
  console.log("handle subitting")
  const data = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  let loginbuttontag = document.querySelector(".loginbutton");
  let messageTag = document.createElement("p");

  console.log("d",data)
  axios
    .post(serverURL+"/user/login", data)
    .then((result) => {
      console.log(result);
      if (result.data?.error) {
        messageTag.textContent = result.data?.error;
        messageTag.id = "failed";
        loginbuttontag.parentElement.appendChild(messageTag);

        let time = setTimeout(() => {
          messageTag.remove();
        }, 3000);
      } else {
        localStorage.setItem("token", result.data.token);
        window.location.href = serverURL+"/chat-screen";
      }
    })
    .catch((err) => {
      console.log("err ", err);

      messageTag.textContent = err?.response?.data?.message;
      if(!messageTag.textContent){
        messageTag.textContent = "something went wrong";
      }

      messageTag.id = "failed";
      loginbuttontag.parentElement.appendChild(messageTag);

      let time = setTimeout(() => {
        messageTag.remove();
      }, 3000);
    });

}

