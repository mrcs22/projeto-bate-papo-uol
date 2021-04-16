let whoami = null;
let selectedUser = "Todos";
let selectedType = "Público";

start();

function start() {
  const nameInput = document.querySelector(".innerDiv input:first-child");
  const loginButton = document.querySelector(".innerDiv input:last-child");

  nameInput.addEventListener("keydown", (event) => {
    console.log(event);
    if (event.key === "Enter") {
      tryLogin(nameInput.value);
    }
  });

  loginButton.addEventListener("click", () => tryLogin(nameInput.value));
}

function tryLogin(userName) {
  loadingAnimation("start");

  whoami = userName;

  const user = {
    name: userName,
  };

  const response = axios.post(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",
    user
  );

  response.then(() => {
    const loginPage = document.querySelector(".login");
    const chatPage = document.querySelector(".chat");
    loginPage.classList.add("ocult");
    chatPage.classList.remove("ocult");

    startChat();
  });

  response.catch(() => {
    const warningMessage = document.querySelector(".warning");
    loadingAnimation("stop");

    warningMessage.classList.remove("ocult");
  });
}

function loadingAnimation(action) {
  const inputsDiv = document.querySelector(".innerDiv");
  const spinner = document.querySelector(".spinner");

  if (action === "start") {
    inputsDiv.classList.add("ocult");
    spinner.classList.remove("ocult");
  }

  if (action === "stop") {
    inputsDiv.classList.remove("ocult");
    spinner.classList.add("ocult");
  }
}

function startChat() {
  renderMessages();
  renderOnlineUsers();

  const input = document.querySelector(".footer div input");
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  messagesLive();
  usersListLive();
  sayImOnline();
}

async function renderOnlineUsers() {
  const response = await axios.get(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants "
  );

  const referenceToAllUsers = { name: "Todos" };
  const users = [referenceToAllUsers, ...response.data];

  const finalUsersList = limitateUserNamesLength(users);

  populateUsersList(finalUsersList);
}

function limitateUserNamesLength(usersList) {
  const mapedUserList = usersList.map((user) => {
    let name = user.name;
    if (name.length > 15) {
      name = name.substring(0, 16);
      name += "...";

      return { name: name };
    } else {
      return user;
    }
  });
  return mapedUserList;
}

function populateUsersList(onlineUsers) {
  usersList = document.querySelector(".users ul");

  usersList.innerHTML = "";

  onlineUsers.forEach((user) => {
    let li = document.createElement("li");
    li.setAttribute("onclick", "selectMenuItem(this)");

    if (user.name === selectedUser) {
      li.classList.add("selected");
    }

    let icon = document.createElement("ion-icon");
    icon.setAttribute("name", "person-circle-sharp");

    let span = document.createElement("span");
    span.innerHTML = user.name;

    let checkMark = document.createElement("img");
    checkMark.setAttribute("src", "./img/check.svg");

    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(checkMark);

    usersList.appendChild(li);
  });
}

async function renderMessages() {
  const response = await axios.get(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages"
  );

  const messages = filterMessages(response.data);

  populateChat(messages);
  scrollPage();
}

function filterMessages(messages) {
  const filteredMessages = messages.filter((message) => {
    const isItFromMe = message.from === whoami;
    const isItToMe = message.to === whoami;
    const isItToAll = message.to === "Todos";

    if (message.type === "private_message") {
      return isItFromMe || isItToMe || isItToAll;
    } else {
      return true;
    }
  });

  return filteredMessages;
}

function populateChat(messages) {
  let content = document.querySelector(".content");
  let messageHtml = null;

  content.innerHTML = "";

  messages.forEach((message) => {
    if (message.type === "status") {
      messageHtml = makeStatusMessage(message);
    } else {
      messageHtml = makeUserMessage(message);
    }

    content.innerHTML += messageHtml;
  });
}

function makeStatusMessage(message) {
  const statusMessage = `<li class=${message.type}>
          <p>
            <span> (${message.time}) </span>
            <span>
              <strong>${message.from}</strong>
            </span>
            ${message.text}
          </p>
        </li>`;

  return statusMessage;
}

function makeUserMessage(message) {
  let messageType = "";

  if (message.type === "private_message") {
    messageType = "reservadamente";
  }

  const userMessage = `<li class=${message.type}>
          <p>
            <span> (${message.time}) </span>
            <span>
              <strong>${message.from}</strong> ${messageType} para <strong>${message.to}</strong>:
            </span>
            ${message.text}
          </p>
        </li>`;

  return userMessage;
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

  if (parentElement.classList.value === "onlineUsers") {
    selectedUser = item.querySelector("span").innerHTML;
  }

  if (lastSelectedItem !== null) {
    lastSelectedItem.classList.remove("selected");
  }

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

function sendMessage() {
  const input = document.querySelector(".footer div input");
  const recipient = document.querySelector(".footer div p span:first-child");
  const type = document.querySelector(".footer div p span:last-child");
  let status = type.innerHTML;

  if (input.value == "") {
    return;
  }

  if (status === "Reservadamente") {
    status = "private_message";
  }
  if (status === "Público") {
    status = "message";
  }

  const message = {
    from: whoami,
    to: recipient.innerHTML,
    type: status,
    text: input.value,
  };

  const response = axios.post(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages",
    message
  );
  input.value = "";
  response.then(() => {
    renderMessages();
  });

  response.catch(() => window.location.reload());
}

function scrollPage() {
  const contentDiv = document.querySelector(".content");

  contentDiv.scrollTo(0, contentDiv.scrollHeight);
}

function messagesLive() {
  setInterval(async () => {
    await renderMessages();
  }, 3000);
}

function usersListLive() {
  setInterval(async () => {
    await renderOnlineUsers();
  }, 10000);
}

function sayImOnline() {
  setInterval(async () => {
    const user = {
      name: whoami,
    };

    const response = axios.post(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status",
      user
    );

    response.catch(() => {
      window.location.reload();
    });

    response.then(() => {});
  }, 5000);
}
