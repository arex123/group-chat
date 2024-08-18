
console.log("singup page")
document.querySelector('.loginbtn').onclick = ()=>{
  window.location.href = "/user/showLogin"
}

document.querySelector('#registerForm').addEventListener('submit',handleSubmit)

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

  axios
    .post("http://localhost:4002/user/register", data)
    .then((result) => {
      console.log(result);
    //   if(result.data?.error){
    //     messageTag.textContent = result.data?.error
    //     messageTag.id = "failed"
    //   }else{
    //     messageTag.textContent = "Account created succesfully"
    //     messageTag.id = "success"
    //   }

    //   signupbuttontag.parentElement.appendChild(messageTag)

    //   let time = setTimeout(()=>{
    //     messageTag.remove()
    //   },3000)
    })
    .catch(err => {
      console.log("errr : ",err)
    //   messageTag.textContent = "Something went wrong"
    //   messageTag.id = "failed"
    //   signupbuttontag.parentElement.appendChild(messageTag)

      
    //   let time = setTimeout(()=>{
    //     messageTag.remove()
    //   },3000)
    });
}
