let whoami = null;

function tryLogin(userName) {
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

    whoami = userName;
    openChat();
  });
}

function openChat() {
  renderOnlineUsers();

  renderMessages();

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

  const todos = { name: "Todos" };
  const users = [todos, ...response.data];

  populateUsersList(users);
}

function populateUsersList(onlineUsers) {
  usersList = document.querySelector(".users ul");

  usersList.innerHTML = "";
  onlineUsers.forEach((user) => {
    let li = document.createElement("li");
    li.setAttribute("onclick", "selectMenuItem(this)");
    if (user.name === "Todos") {
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

  const messages = response.data.slice(80, 100);

  populateChat(messages);
  scrollPage();
}

function populateChat(messages) {
  let content = document.querySelector(".content");
  let messageHtml = null;

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

function sendMessage() {
  const input = document.querySelector(".footer div input");
  const recipient = document.querySelector(".footer div p span:first-child");
  const type = document.querySelector(".footer div p span:last-child");
  let status = type.innerHTML;

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
