start();

function start() {
  let onlineUsers = getOnlineUsers();
  renderOnlineUsers(onlineUsers);
}

function getOnlineUsers() {
  return ["João", "Maria"];
}

function renderOnlineUsers(onlineUsers) {
  usersList = document.querySelector(".users ul");

  onlineUsers.forEach((user) => {
    let li = document.createElement("li");
    li.setAttribute("onclick", "selectMenuItem(this)");

    let icon = document.createElement("ion-icon");
    icon.setAttribute("name", "person-circle-sharp");

    let span = document.createElement("span");
    span.innerHTML = user;

    let checkMark = document.createElement("img");
    checkMark.setAttribute("src", "./img/check.svg");

    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(checkMark);

    usersList.appendChild(li);
  });
}

function showSideMenu() {
  const sidebar = document.querySelector(".sidebar");
  const cover = document.querySelector(".cover");

  cover.classList.remove("ocult");
  sidebar.classList.add("show");
}

function hideSideMenu() {
  const sidebar = document.querySelector(".sidebar");
  const cover = document.querySelector(".cover");

  sidebar.classList.remove("show");
  setTimeout(() => {
    cover.classList.add("ocult");
  }, 400);
}

function selectMenuItem(item) {
  let parentElement = item.parentElement;
  let lastSelectedItem = parentElement.querySelector(".selected");

  lastSelectedItem.classList.remove("selected");
  item.classList.add("selected");

  renderMessageParameters(item, parentElement.classList.value);
}

function renderMessageParameters(item, itemType) {
  let itemParameter = item.querySelector("span").innerHTML;
  let parameterHolder = null;

  if (itemType === "onlineUsers") {
    parameterHolder = document.querySelector(".footer div p span:first-child");
  } else {
    parameterHolder = document.querySelector(".footer div p span:last-child");
  }

  parameterHolder.innerHTML = itemParameter;
}
