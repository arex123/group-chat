
console.log("singup page")
document.querySelector('.loginbtn').onclick = ()=>{
  window.location.href = "/user/showLogin"
}
function handleSubmit(event) {
  event.preventDefault();
  const data = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };

  let signupbuttontag = document.querySelector('.signupbutton')
  let messageTag = document.createElement('p')

  axios
    .post("http://localhost:3002/user/signup", data)
    .then((result) => {
      console.log(result);
      if(result.data?.error){
        messageTag.textContent = result.data?.error
        messageTag.id = "failed"
      }else{
        messageTag.textContent = "Account created succesfully"
        messageTag.id = "success"
      }

      signupbuttontag.parentElement.appendChild(messageTag)

      let time = setTimeout(()=>{
        messageTag.remove()
      },3000)
    })
    .catch(err => {
      
      messageTag.textContent = "Something went wrong"
      messageTag.id = "failed"
      signupbuttontag.parentElement.appendChild(messageTag)

      
      let time = setTimeout(()=>{
        messageTag.remove()
      },3000)
    });
}
