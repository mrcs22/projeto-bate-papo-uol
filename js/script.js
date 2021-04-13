function showSideMenu() {
  const sidebar = document.querySelector(".sidebar");
  const cover = document.querySelector(".cover");

  cover.classList.remove("ocult");
  sidebar.classList.add("show");
}

function hideSideMenu() {
  const sidebar = document.querySelector(".sidebar");
  const cover = document.querySelector(".cover");

  cover.classList.add("ocult");
  sidebar.classList.remove("show");
}

function selectMenuItem(item) {
  let parentElement = item.parentElement;
  let lastSelectedItem = parentElement.querySelector(".selected");

  lastSelectedItem.classList.remove("selected");
  item.classList.add("selected");
}
