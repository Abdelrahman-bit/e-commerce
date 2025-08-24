let sideMenuItems = document.querySelectorAll(".dashboard-SideMenuItem");
sideMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    sideMenuItems.forEach((item) => {
      item.classList.remove("dashboard-SideMenuItemActive");
    });
    item.classList.add("dashboard-SideMenuItemActive");
  });
});
