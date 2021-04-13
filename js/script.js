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
}
