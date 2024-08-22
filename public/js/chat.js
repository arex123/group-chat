const serverURL = "http://localhost:4002";
// const button = document.getElementById("sendChat");
let token = localStorage.getItem("token");
let jwt = {
  headers: {
    Authorization: token,
  },
};
var btn = document.getElementById("messageToSend");

let verticalDot = document.querySelector(".vertical-dot-div");
let verticalDotOpt = document.querySelector(".vertical-dot-div__options");
let selectedUserForGroup = [];

verticalDot.onclick = () => {
  verticalDotOpt.classList.toggle("active");
};

window.onclick = function (e) {
  if (!e.target.matches(".vertical-dot-div")) {
    if (verticalDotOpt.classList.contains("active")) {
      verticalDotOpt.classList.remove("active");
    }
  }
};

let createGroupSectionTag = document.querySelector(".createGroupSection");

async function handleOpenGCS() {
  createGroupSectionTag.style.display = "block";

  try {
    //get all users from db
    let users = await axios.get(serverURL + "/user/findAll", {
      headers: {
        Authorization: token,
      },
    });

    console.log("users ", users);
    users.data.forEach((user) => addUserToScreen(user));
  } catch (err) {
    console.log("err while fetching users ", err);
  }
}
function closeGCS() {
  //removing checks if user selected
  document.querySelector(".createGroupSection_userlist").innerHTML = "";
  const ItemElements = document.querySelectorAll(".userItems");
  for (let i = 0; i < ItemElements.length; i++) {
    if (ItemElements[i].classList.contains("selectedUser")) {
      ItemElements[i].classList.toggle("selectedUser");
    }
  }

  createGroupSectionTag.style.display = "none";
}
function addUserToScreen(user) {
  console.log("u: ", user);

  let ItemToAdd = `<div class="groupItem userItems" id='${user.id}'>
              <div class="groupItem_profileImgDiv">
                <img
                  id="groupItem_profileImg"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIEBAIJBQAAAAAAAAABAgMEEQUhMUESUWFxEyIUIzI0QlKBkcEzYqGi0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6SAAAAAAB3AO/VYabhlrxFs8zjj8sdVlh0+HDG2PHEevcFDTDlv8AYx3n1iHqdLnr1w3/AGdEA5e0TWdrRNZ8pg7untWLRtaImJ80LPw3Dff4f1dvToClG3UafLp7RGSu2/Se0tQAAAAAAAAAAAAAAHPtG660GhjBHxMkROXt5VRuE6aLW+Pb8M7V/wCraOgMgAAAAA8ZcdctJpeu9Z7KLWaW2lybRzrbpb+HQNWow1z4ppbv0nykHODN6zjvaluU1naWAAAAAAAAAAACI36Dfoa+PV4o/u3Be4McYcNMcfhjZsAAAAAAAAAFPxfF4ctckfjjafeFeuuLV8Wk3/LaJUoAAAAAAAAAACTw377j/VGbdLf4epx2nlEWjcHRjEMgAAAAAAAAh8U+5394Ua44xfbBSne07/pCnAAAAAAAAAAAPfoAL/QZ/jaatp+1Hy290lQaDU/Rsvzc6W5W9F9ExMRMc4kGQAAAAAAQ+I6r6Pj8NP6lunp6greJZvjamfDPy0+WEUAAAAAAAAAAAAAE3Q66cH1eSZnHP+qEm6Xh2TNHiy746e3OQXNL1vWLUtExPeHpqwYMeCvhxV8Md/VtAAAABE1mtpgjau1snaN+nupMl7ZLze/O09ZW+q4bjyzNsfyXn9YlVZsOTDfw5K7eoNYAAAAAAAAAAAD1Slsl4pSszaezOLFfNkimOIm0/wCPVe6PTU01PDXnaftW8watHw+mHa+Ta+Tz7QmgAAAAAAA8ZcVM1JpkrFqz2ewFFrdDfT/PSZvTz25wiezp5jkqOIaL4W+XDG9es18gV4AAAAAAADMRNrRWI3meUQx3WXCNPvM57R05V/kEzQ6WNNj2nneftSlAAAAAAAAAAAAxMbwyAo+IaT6Pfx0jbHbpHlKG6TPirmx2x26TDnclJx5LUt1rPMHkAAAAADaZ5R1mdodJgxRiw1pHaFHw6nj1lI8vm/Z0AAAAAAAAAAAAAAACn4xh8OWmSOluU+8LhE4nj8ektPevzAogAAAAAWHBo3zZJ8qrgAAAAAAAAAAAAAAAGvNETivE9JiQBzYAAAP/2Q=="
                  alt="img"
                />
              </div>
              <p id="groupItem_profileName">${user.name}</p>
              <p id="groupItem_profilePendingMsg"></p>
            </div>`;

  let List = document.querySelector(".createGroupSection_userlist");

  List.insertAdjacentHTML("beforeend", ItemToAdd);
}

let selectedGroup = "";
document.querySelector(".chatSidebar__grouplist").onclick = (e) => {
  if (e.target.closest(".groupItem")) {
    const groupItemElement = e.target.closest(".groupItem");

    if (groupItemElement.id == selectedGroup?.id) {
      return;
    }

    if (selectedGroup != "" && selectedGroup?.id != groupItemElement.id) {
      selectedGroup.classList.toggle("selectedUser");

      //
      document.querySelector(".msger-chat").innerHTML = "";
    }
    // if(selectedGroup = "")
    groupItemElement.classList.toggle("selectedUser");

    selectedGroup = groupItemElement;

    // console.log("yes" , groupItemElement.id,groupItemElement)
    // console.log("yes ",groupItemElement.querySelector('#groupItem_profileName').textContent)
    document.querySelector(".contentDefaultConversation").style.display =
      "none";
    document.querySelector(".contentConversation").style.display = "block";

    document.querySelector(".groupname").textContent =
      groupItemElement.querySelector("#groupItem_profileName").textContent;

    console.log("opening group");

    getGroupMessages(groupItemElement.id);
  } else {
    console.log("no", e.target);
  }
};

//selecting user for group
document.querySelector(".createGroupSection_userlist").onclick = (e) => {
  if (e.target.closest(".userItems")) {
    const ItemElement = e.target.closest(".userItems");

    if (ItemElement.classList.contains("selectedUser")) {
      selectedUserForGroup = selectedUserForGroup.filter(
        (id) => id != ItemElement.id
      );
    } else {
      selectedUserForGroup.push(ItemElement.id);
    }
    ItemElement.classList.toggle("selectedUser");
    console.log("yes", ItemElement.id, ItemElement, selectedUserForGroup);
  } else {
    console.log("no", e.target);
  }
};

function appendMessage(name, img, side, text) {
  if (!img) img = "https://image.flaticon.com/icons/svg/145/145867.svg";
  //   Simple solution for small apps
  const msgHTML = `
      <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
          <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          </div>

          <div class="msg-text">${text}</div>
      </div>
      </div>
  `;
  // const msgHTML = `
  //     <div class="msg ${side}-msg">
  //     <div class="msg-img" style="background-image: url(${img})"></div>

  //     <div class="msg-bubble">
  //         <div class="msg-info">
  //         <div class="msg-info-name">${name}</div>
  //         <div class="msg-info-time">date</div>
  //         </div>

  //         <div class="msg-text">${text}</div>
  //     </div>
  //     </div>
  // `;

  let msgerChat = document.querySelector(".msger-chat");
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

btn.onkeydown = function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode == 13) {
    sendMessage();
  }
};

// button.addEventListener("click", async () => sendMessage());

async function sendMessage() {
  try {
    console.log("submit button clicked");
    let new_message = document.getElementById("messageToSend").value;
    if (new_message.trim().length == 0) {
      return;
    }
    document.getElementById("messageToSend").value = "";
    console.log("new message: ", new_message);
    const token = localStorage.getItem("token");
    let result = await axios.post(
      serverURL + "/chat",
      { message: new_message, groupId: selectedGroup.id },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    // getAllChats();
    getGroupMessages(selectedGroup.id);
    console.log("result ", result);
  } catch (err) {
    console.log("error : ", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  getUserGroupNames();
  // let messageStored = JSON.parse(localStorage.getItem('prevChats'))

  // if(messageStored){
  //   for (let i = 0; i < messageStored.length; i++) {
  //       ShowChatOnScreen(messageStored[i]);
  //     }
  // }
  // getAllChats();
  // setInterval(()=>{
  //   getAllChats()
  // },1500)
});

async function getAllChats() {
  let token = localStorage.getItem("token");

  let messageStored = JSON.parse(localStorage.getItem("prevChats"));

  if (!messageStored) {
    messageStored = [];
  }

  let lastChatId = messageStored[messageStored.length - 1]?.id;

  if (lastChatId == undefined) lastChatId = 0;

  try {
    let result = await axios.get(
      serverURL + `/getChats/${lastChatId}/${selectedGroup.id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // console.log("Results", result);
    let chat_data = result.data.messages1;

    // console.log("messageStored before : ",messageStored)
    // console.log("new chat_data ",chat_data)
    if (chat_data?.length) messageStored = messageStored.concat(chat_data);

    // console.log("messageStored after updation: ",messageStored)

    let len = messageStored.length;
    if (len > 15) {
      let removeFrom = len - 15;
      messageStored = messageStored.slice(removeFrom);
    }
    localStorage.setItem("prevChats", JSON.stringify(messageStored));

    // document.querySelector(".chat-list").innerHTML = "";
    for (let i = 0; i < chat_data.length; i++) {
      ShowChatOnScreen(chat_data[i]);
    }
  } catch (err) {
    if (err?.response?.status == 401) {
      window.location.href = "/login";
      localStorage.clear();
    }
    console.log("erradf ", err);
  }
}
// function ShowChatOnScreen(obj) {
//   console.log("obj ",obj)
//   let chatCont = document.querySelector(".chat-list");
//   let messageItem = document.createElement("div");
//   messageItem.className = "messageItem";
//   let username = document.createElement("p");
//   username.textContent = obj.messageOwner;
//   let userMessage = document.createElement("p");
//   userMessage.textContent = obj.message;

//   messageItem.appendChild(username);
//   messageItem.appendChild(userMessage);

//   chatCont.appendChild(messageItem);
//   chatCont.scrollTop = chatCont.scrollHeight;
// }

async function getUserGroupNames() {
  try {
    let groupNameRes = await axios.get(serverURL + "/group/getUserGroups", {
      headers: {
        Authorization: token,
      },
    });

    document.querySelector('.chatSidebar__grouplist').innerHTML=''
    groupNameRes.data.forEach((gdata) => showGroups(gdata));
  } catch (err) {
    console.log("ee ", err);
    if (err.response?.status == 401) {
      window.location.href = "/login";
      localStorage.clear();
    }
    console.log(err);
  }
}

function showGroups(obj) {
  console.log(obj);

  let groupItemToAdd = `<div class="groupItem" id='${obj.id}' ukey='${obj.groupOwnerId}'>
              <div class="groupItem_profileImgDiv">
                <img
                  id="groupItem_profileImg"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIEBAIJBQAAAAAAAAABAgMEEQUhMUESUWFxEyIUIzI0QlKBkcEzYqGi0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6SAAAAAAB3AO/VYabhlrxFs8zjj8sdVlh0+HDG2PHEevcFDTDlv8AYx3n1iHqdLnr1w3/AGdEA5e0TWdrRNZ8pg7untWLRtaImJ80LPw3Dff4f1dvToClG3UafLp7RGSu2/Se0tQAAAAAAAAAAAAAAHPtG660GhjBHxMkROXt5VRuE6aLW+Pb8M7V/wCraOgMgAAAAA8ZcdctJpeu9Z7KLWaW2lybRzrbpb+HQNWow1z4ppbv0nykHODN6zjvaluU1naWAAAAAAAAAAACI36Dfoa+PV4o/u3Be4McYcNMcfhjZsAAAAAAAAAFPxfF4ctckfjjafeFeuuLV8Wk3/LaJUoAAAAAAAAAACTw377j/VGbdLf4epx2nlEWjcHRjEMgAAAAAAAAh8U+5394Ua44xfbBSne07/pCnAAAAAAAAAAAPfoAL/QZ/jaatp+1Hy290lQaDU/Rsvzc6W5W9F9ExMRMc4kGQAAAAAAQ+I6r6Pj8NP6lunp6greJZvjamfDPy0+WEUAAAAAAAAAAAAAE3Q66cH1eSZnHP+qEm6Xh2TNHiy746e3OQXNL1vWLUtExPeHpqwYMeCvhxV8Md/VtAAAABE1mtpgjau1snaN+nupMl7ZLze/O09ZW+q4bjyzNsfyXn9YlVZsOTDfw5K7eoNYAAAAAAAAAAAD1Slsl4pSszaezOLFfNkimOIm0/wCPVe6PTU01PDXnaftW8watHw+mHa+Ta+Tz7QmgAAAAAAA8ZcVM1JpkrFqz2ewFFrdDfT/PSZvTz25wiezp5jkqOIaL4W+XDG9es18gV4AAAAAAADMRNrRWI3meUQx3WXCNPvM57R05V/kEzQ6WNNj2nneftSlAAAAAAAAAAAAxMbwyAo+IaT6Pfx0jbHbpHlKG6TPirmx2x26TDnclJx5LUt1rPMHkAAAAADaZ5R1mdodJgxRiw1pHaFHw6nj1lI8vm/Z0AAAAAAAAAAAAAAACn4xh8OWmSOluU+8LhE4nj8ektPevzAogAAAAAWHBo3zZJ8qrgAAAAAAAAAAAAAAAGvNETivE9JiQBzYAAAP/2Q=="
                  alt="img"
                />
              </div>
              <p id="groupItem_profileName">${obj.groupName}</p>
              <p id="groupItem_profilePendingMsg"></p>
            </div>`;

  let groupList = document.querySelector(".chatSidebar__grouplist");

  groupList.insertAdjacentHTML("beforeend", groupItemToAdd);
  groupList.scrollTop += 500;
}

async function getGroupMessages(id) {
  try {
    let messages = await axios.get(
      serverURL + `/group/getGroupMessages/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("msf ", messages);
    // let groupsOwnerId = selectedGroup.getAttribute('ukey')
    // document.querySelector('.msger-chat').innerHTML=''
    messages.data.messages.forEach((msg) =>
      appendMessage(
        msg.messageOwner,
        null,
        messages.data.currUser == msg.userId ? "right" : "left",
        msg.message
      )
    );
  } catch (err) {
    console.log("err while geting grp msg : ", err);
  }
}

async function handleCreateGroup() {
  // alert(event)
  // e.preventDefault()

  let groupName = document.getElementById("newGroupName").value;
  console.log("Creating group", groupName, selectedUserForGroup);

  try {
    console.log("toe ", token);

    let result = await axios.post(
      serverURL + `/group/createGroup`,
      {
        name: groupName,
        selectedUserForGroup,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("ress ", result);

    if (result.data.success) {
      alert("Group created");
      document.getElementById("newGroupName").value = "";
      selectedUserForGroup = [];
      console.log("sele ", selectedUserForGroup);
      closeGCS();
      getUserGroupNames();
    }
  } catch (err) {
    if (err.response.status == 401) {
      window.location.href = "/login";
      localStorage.clear();
    }
    console.log("err while creating group: ", err);
    alert("Something went Wrong, Retry Again after some time");
    // modal.style.display = "none";
  }
}

function handleLogOut() {
  localStorage.clear();
  window.location.href = "/login";
}

async function handleToggleGroupSetting() {
  console.log("fdfs");
  let gss = document.querySelector(".groupSettingsSection");

  if (gss.classList.contains("groupSettingsSection_open") == false) {
    //get groups users from backend

    try {
      console.log("selectedGroup.id", selectedGroup.id);

      let result = await axios.get(
        serverURL + `/group/groupInfo/${selectedGroup.id}`,
        jwt
      );

      let { currUser, groupDetail, isAdmin, isCreator } = result.data;
      let { groupDescription, groupName, createdAt, users } = groupDetail;

      console.log("res", result);

      groupDescription = groupDescription ?? "des";

      document.querySelector(".groupSettingsSection_newname").textContent =
        groupName;
      document.querySelector(".groupSettingsSection_newgname").textContent =
        groupDescription;

        if(!isAdmin){
          //disable name and desc editing
          document.querySelector('.fa-pen-gname-edit').style.display='none'
          document.querySelector('.fa-pen-gdesc-edit').style.display='none'
          document.querySelector('.groupSettingsSection_userList').style.display='none'
        }

        document.querySelector(".groupSettingsSection_userList_users").innerHTML=''
      addUserToGroupListScreen(
        currUser.id,
        "You",
        currUser.phone,
        isAdmin == true ? "admin" : "member"
      );
      let isCurrAdmin = isAdmin;
      users.forEach((user) =>
        addUserToGroupListScreen(
          user.id,
          user.name,
          user.phone,
          user.UserGroup.role,
          isCurrAdmin
        )
      );
      // addUserToGroupListScreen(tempuser)
    } catch (err) {
      console.log("error while fetching grp det", err);
    }
  }
  gss.classList.toggle("groupSettingsSection_open");
}

function allowChangeGpSetting(type) {
  if (type == "name") {
    document.querySelector(".fa-pen-gname-edit").style.display = "none";
    document.querySelector(".fa-check-gname-ok").style.display = "block";

    document.querySelector(
      ".groupSettingsSection_newname"
    ).contentEditable = true;
    document
      .querySelector(".groupSettingsSection_newname")
      .classList.toggle("makeeditable");
  } else if (type == "desc") {
    document.querySelector(".fa-pen-gdesc-edit").style.display = "none";
    document.querySelector(".fa-check-gdesc-ok").style.display = "block";

    document.querySelector(
      ".groupSettingsSection_newgname"
    ).contentEditable = true;
    document
      .querySelector(".groupSettingsSection_newgname")
      .classList.toggle("makeeditable");
  }
}
async function submitChangeGpSetting(type) {
  if (type == "name") {
    //call backend to update group name


    console.log("new gname",document.querySelector('.groupSettingsSection_newname').textContent)


    let result = await axios.post(serverURL+"/group/updateGroupNameOrDesc",{
      groupId:selectedGroup.id,
      groupName:document.querySelector('.groupSettingsSection_newname').textContent
    },
  jwt)

  console.log("result ",result)



    document.querySelector(".fa-pen-gname-edit").style.display = "block";
    document.querySelector(".fa-check-gname-ok").style.display = "none";
    document.querySelector(
      ".groupSettingsSection_newname"
    ).contentEditable = false;
    document
      .querySelector(".groupSettingsSection_newname")
      .classList.toggle("makeeditable");
  } else if (type == "desc") {


    console.log("new gname",document.querySelector('.groupSettingsSection_newgname').textContent)


    let result = await axios.post(serverURL+"/group/updateGroupNameOrDesc",{
      groupId:selectedGroup.id,
      groupDescription:document.querySelector('.groupSettingsSection_newgname').textContent
    },
  jwt)

  console.log("result ",result)


    document.querySelector(".fa-pen-gdesc-edit").style.display = "block";
    document.querySelector(".fa-check-gdesc-ok").style.display = "none";

    document.querySelector(
      ".groupSettingsSection_newgname"
    ).contentEditable = false;
    document
      .querySelector(".groupSettingsSection_newgname")
      .classList.toggle("makeeditable");
  }
}

async function makeAdmin(userId, groupId) {
  try {
    console.log("ids: ",userId,groupId)
    let res = await axios.post(
      serverURL + "/group/makeAdmin",
      {
        userId,
        groupId,
      },
      jwt
    );

    console.log("resss ", res);

    if(res.data.success){
      let selTag = document.querySelector(`.vertical-dot-div__options_gs${userId}`)
      selTag.innerHTML='<p onclick="handleLogOut()">Remove User</p>'

      document.querySelector(`.groupSettingsSection_userListrole${userId}`).innerHTML = 'admin'

    }

  } catch (err) {
    console.log("error ", err);
  }
}

async function removeUser(userId) {

  try{
    let res = await axios.post(serverURL+"/group/removeMember",{
      userId,
      groupId:selectedGroup.id
    },jwt)

    console.log("res",res)
    if(res.data.success){
      document.querySelector(`#userItemsList${userId}`).remove()
    }
  }catch(err){
    alert("something went wrong",err.message)
    console.log(err)
  }
  
}


function addUserToGroupListScreen(id, name, phone, role, isCurrAdmin) {
  // console.log("u: ", user);
  // let userId = user.id
  // let name = user.name
  // let phone = user.phone
  // let role = user.UserGroup.role

  
  let OptionContent = "";

  console.log("isCurrAdmin ",isCurrAdmin)
  if (isCurrAdmin) {
    if (role == "member") {
      OptionContent = `  <div class='vertical-dot-div_gs${id}' onclick="handleOpenGCS2(${id})">
                <i class="fa-solid fa-ellipsis-vertical"></i>
                <div class='vertical-dot-div__options_gs${id}'>
                  <p class="openGCS" onclick="makeAdmin(${id},${selectedGroup.id})" >Make Admin</p>
                  <p onclick="removeUser(${id})">Remove User</p>
                </div>
              </div>`;
    } else if (role == "admin") {
      OptionContent = `  <div class='vertical-dot-div_gs${id}' onclick="handleOpenGCS2(${id})">
                <i class="fa-solid fa-ellipsis-vertical"></i>
                <div class='vertical-dot-div__options_gs${id}'>
                  <p onclick="removeUser(${id})">Remove User</p>
                </div>
              </div>`;
    }
  }

  let ItemToAdd = `<div class="groupItem1 userItems" id='userItemsList${id}'>
              <div class="groupItem_profileImgDiv">
                <img
                  id="groupItem_profileImg"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIEBAIJBQAAAAAAAAABAgMEEQUhMUESUWFxEyIUIzI0QlKBkcEzYqGi0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6SAAAAAAB3AO/VYabhlrxFs8zjj8sdVlh0+HDG2PHEevcFDTDlv8AYx3n1iHqdLnr1w3/AGdEA5e0TWdrRNZ8pg7untWLRtaImJ80LPw3Dff4f1dvToClG3UafLp7RGSu2/Se0tQAAAAAAAAAAAAAAHPtG660GhjBHxMkROXt5VRuE6aLW+Pb8M7V/wCraOgMgAAAAA8ZcdctJpeu9Z7KLWaW2lybRzrbpb+HQNWow1z4ppbv0nykHODN6zjvaluU1naWAAAAAAAAAAACI36Dfoa+PV4o/u3Be4McYcNMcfhjZsAAAAAAAAAFPxfF4ctckfjjafeFeuuLV8Wk3/LaJUoAAAAAAAAAACTw377j/VGbdLf4epx2nlEWjcHRjEMgAAAAAAAAh8U+5394Ua44xfbBSne07/pCnAAAAAAAAAAAPfoAL/QZ/jaatp+1Hy290lQaDU/Rsvzc6W5W9F9ExMRMc4kGQAAAAAAQ+I6r6Pj8NP6lunp6greJZvjamfDPy0+WEUAAAAAAAAAAAAAE3Q66cH1eSZnHP+qEm6Xh2TNHiy746e3OQXNL1vWLUtExPeHpqwYMeCvhxV8Md/VtAAAABE1mtpgjau1snaN+nupMl7ZLze/O09ZW+q4bjyzNsfyXn9YlVZsOTDfw5K7eoNYAAAAAAAAAAAD1Slsl4pSszaezOLFfNkimOIm0/wCPVe6PTU01PDXnaftW8watHw+mHa+Ta+Tz7QmgAAAAAAA8ZcVM1JpkrFqz2ewFFrdDfT/PSZvTz25wiezp5jkqOIaL4W+XDG9es18gV4AAAAAAADMRNrRWI3meUQx3WXCNPvM57R05V/kEzQ6WNNj2nneftSlAAAAAAAAAAAAxMbwyAo+IaT6Pfx0jbHbpHlKG6TPirmx2x26TDnclJx5LUt1rPMHkAAAAADaZ5R1mdodJgxRiw1pHaFHw6nj1lI8vm/Z0AAAAAAAAAAAAAAACn4xh8OWmSOluU+8LhE4nj8ektPevzAogAAAAAWHBo3zZJ8qrgAAAAAAAAAAAAAAAGvNETivE9JiQBzYAAAP/2Q=="
                  alt="img"
                />
              </div>
              <p id="groupItem_profileName">${name}</p>
              <p class="groupSettingsSection_userListrole${id}">${role}</p>
              
              ${OptionContent}
            
            </div>
            `;

  let List = document.querySelector(".groupSettingsSection_userList_users");

  List.insertAdjacentHTML("beforeend", ItemToAdd);
}

async function handleOpenGCS2(id) {
  console.log("507");

  document
    .querySelector(`.vertical-dot-div__options_gs${id}`)
    .classList.toggle("active");
}
function closeGCS2() {
  //removing checks if user selected
  document.querySelector(".createGroupSection_userlist").innerHTML = "";
  const ItemElements = document.querySelectorAll(".userItems");
  for (let i = 0; i < ItemElements.length; i++) {
    if (ItemElements[i].classList.contains("selectedUser")) {
      ItemElements[i].classList.toggle("selectedUser");
    }
  }

  createGroupSectionTag.style.display = "none";
}

// function handleShowModal(){

//   document.getElementById('id01').style.display='block'
// }

// function handlehideModal(){
// console.log("re mo",document.getElementById('id01').style.display='none')
//   document.getElementById('id01').style.display='none'
// }

async function handleExit(){
  try{

    let res = await axios.post(serverURL+"/group/leaveGroup",{groupId:selectedGroup.id},jwt)
    
    console.log(res)

  }catch(err){
    alert("semething went wrong ",err.message)
    console.log("ee ",err)
  }
}

async function handleAddMember() {

  document.getElementById('id01').style.display='block'

  try{
    let res = await axios.get(serverURL+`/group/${selectedGroup.id}/usersOutsideGroup`,jwt)

    let users = res.data

    let tempData = [...users]


    document.querySelector(".modal_users").innerHTML='';

    tempData.forEach(user=>addUserToModalScreen(user))


    console.log("res ",res)
  }catch(err){
    console.log("err",err)
  }
  
}

function addUserToModalScreen(user) {
  console.log("u: ", user);

  let ItemToAdd = `<div class="groupItem userItems modelUser" id='${user.id}'>
              <div class="groupItem_profileImgDiv modelUserImg">
                <img
                  id="groupItem_profileImg"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIEBAIJBQAAAAAAAAABAgMEEQUhMUESUWFxEyIUIzI0QlKBkcEzYqGi0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6SAAAAAAB3AO/VYabhlrxFs8zjj8sdVlh0+HDG2PHEevcFDTDlv8AYx3n1iHqdLnr1w3/AGdEA5e0TWdrRNZ8pg7untWLRtaImJ80LPw3Dff4f1dvToClG3UafLp7RGSu2/Se0tQAAAAAAAAAAAAAAHPtG660GhjBHxMkROXt5VRuE6aLW+Pb8M7V/wCraOgMgAAAAA8ZcdctJpeu9Z7KLWaW2lybRzrbpb+HQNWow1z4ppbv0nykHODN6zjvaluU1naWAAAAAAAAAAACI36Dfoa+PV4o/u3Be4McYcNMcfhjZsAAAAAAAAAFPxfF4ctckfjjafeFeuuLV8Wk3/LaJUoAAAAAAAAAACTw377j/VGbdLf4epx2nlEWjcHRjEMgAAAAAAAAh8U+5394Ua44xfbBSne07/pCnAAAAAAAAAAAPfoAL/QZ/jaatp+1Hy290lQaDU/Rsvzc6W5W9F9ExMRMc4kGQAAAAAAQ+I6r6Pj8NP6lunp6greJZvjamfDPy0+WEUAAAAAAAAAAAAAE3Q66cH1eSZnHP+qEm6Xh2TNHiy746e3OQXNL1vWLUtExPeHpqwYMeCvhxV8Md/VtAAAABE1mtpgjau1snaN+nupMl7ZLze/O09ZW+q4bjyzNsfyXn9YlVZsOTDfw5K7eoNYAAAAAAAAAAAD1Slsl4pSszaezOLFfNkimOIm0/wCPVe6PTU01PDXnaftW8watHw+mHa+Ta+Tz7QmgAAAAAAA8ZcVM1JpkrFqz2ewFFrdDfT/PSZvTz25wiezp5jkqOIaL4W+XDG9es18gV4AAAAAAADMRNrRWI3meUQx3WXCNPvM57R05V/kEzQ6WNNj2nneftSlAAAAAAAAAAAAxMbwyAo+IaT6Pfx0jbHbpHlKG6TPirmx2x26TDnclJx5LUt1rPMHkAAAAADaZ5R1mdodJgxRiw1pHaFHw6nj1lI8vm/Z0AAAAAAAAAAAAAAACn4xh8OWmSOluU+8LhE4nj8ektPevzAogAAAAAWHBo3zZJ8qrgAAAAAAAAAAAAAAAGvNETivE9JiQBzYAAAP/2Q=="
                  alt="img"
                />
              </div>
              <p id="groupItem_profileName">${user.name}</p>
              <div class="modelUser-info">
              <p>${user.email}</p>
              <p>${user.phone}</p>
              </div>

              
            </div>`;

  let List = document.querySelector(".modal_users");

  List.insertAdjacentHTML("beforeend", ItemToAdd);
}

function handleNewUserSearch(val){

  console.log("val ",val)

}