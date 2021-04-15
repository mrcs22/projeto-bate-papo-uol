let whoami = null;

start();

function start() {
  renderLoginPage();
}

function renderLoginPage() {
  const body = document.querySelector("body");
  const loginPageContainer = document.createElement("div");
  loginPageContainer.classList.add("login");

  const div = document.createElement("div");

  const logo = document.createElement("img");
  logo.setAttribute("src", "./img/logo.svg");
  logo.setAttribute("alt", "Bate papo uol");

  const innerDiv = document.createElement("innerDiv");
  innerDiv.classList.add("innerDiv");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "userName");
  input.setAttribute("placeholder", "Digite seu nome");

  const button = document.createElement("input");
  button.setAttribute("type", "button");
  button.setAttribute("value", "Entrar");
  button.setAttribute("onclick", `tryLogin(this.previousSibling.value)`);

  div.appendChild(logo);

  innerDiv.appendChild(input);
  innerDiv.appendChild(button);

  loginPageContainer.appendChild(div);
  loginPageContainer.appendChild(innerDiv);

  body.appendChild(loginPageContainer);
}

function tryLogin(userName) {
  whoami = userName;

  const user = {
    name: userName,
  };

  const response = axios.post(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants ",
    user
  );

  response.then(() => {
    const loginPage = document.querySelector(".login");
    loginPage.classList.add("ocult");
    whoami = userName;
    openChat();
  });
}

function openChat() {
  renderChat();

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

  const messages = response.data.slice(80, 99);

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

  response.then(() => {
    input.value = "";
  });

  response.catch((err) => window.location.reload());
}

function scrollPage() {
  const contentDiv = document.querySelector(".content");

  contentDiv.scrollTo(0, contentDiv.scrollHeight);
}

function renderChat() {
  const body = document.querySelector("body");

  const htmlElements = [makeHeader(), makeContent(), makeFooter(), makeCover()];

  htmlElements.forEach((element) => body.appendChild(element));
}

function makeHeader() {
  const div = document.createElement("div");
  div.classList.add("header");

  const logo = document.createElement("img");
  logo.setAttribute("src", "./img/logo.svg");
  logo.setAttribute("alt", "Bate papo uol");

  const headerIcon = document.createElement("ion-icon");
  headerIcon.setAttribute("name", "people");
  headerIcon.setAttribute("onclick", "showSideMenu()");

  div.appendChild(logo);
  div.appendChild(headerIcon);

  return div;
}

function makeContent() {
  const div = document.createElement("div");
  div.classList.add("content");

  const ul = document.createElement("ul");

  div.appendChild(ul);

  return div;
}

function makeFooter() {
  const footer = document.createElement("div");
  footer.classList.add("footer");

  const div = document.createElement("div");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Escreva aqui...");

  const p = document.createElement("p");
  p.innerHTML = "Enviando para <span>Todos</span> (<span>Público</span>)";

  const footerIcon = document.createElement("ion-icon");
  footerIcon.setAttribute("name", "paper-plane-outline");
  footerIcon.setAttribute("onclick", "sendMessage()");

  div.appendChild(input);
  div.appendChild(p);

  footer.appendChild(div);
  footer.appendChild(footerIcon);

  return footer;
}

function makeCover() {
  const cover = document.createElement("div");
  cover.classList.add("cover", "ocult");
  cover.setAttribute("onclick", "hideSideMenu()");

  return cover;
}

function messagesLive() {
  const interval = setInterval(async () => {
    await renderMessages();
  }, 3000);
}

function usersListLive() {
  const interval = setInterval(async () => {
    await renderOnlineUsers();
  }, 10000);
}

function sayImOnline() {
  const interval = setInterval(async () => {
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
