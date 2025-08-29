import { loadPage } from "./router.js";
import { getCurrentUser } from "../../assests/js/storage.js";


function renderSidebar(role) {
  const sidebar = document.getElementById("sidebar-desktop");
  const sidebarM = document.getElementById("sidebar-mobile");

  let menu = `<ul class="nav flex-column">`;

  if (role === "seller") {
    menu += `
      <li class="nav-item">
        <a href="#dashboard" class="nav-link text-dark px-3 py-2 rounded">Dashboard</a>
      </li>
      <li class="nav-item">
        <a href="#products" class="nav-link text-dark px-3 py-2 rounded">Products</a>
      </li>
      <li class="nav-item">
        <a href="#sellerOrders" class="nav-link text-dark px-3 py-2 rounded">Orders</a>
      </li>
    `;
  }

  if (role === "admin") {
    menu += `
      <li class="nav-item">
        <a href="#dashboard" class="nav-link text-dark px-3 py-2 rounded">Admin Dashboard</a>
      </li>
      <li class="nav-item">
        <a href="#users" class="nav-link text-dark px-3 py-2 rounded">Manage Users</a>
      </li>
      <li class="nav-item">
        <a href="#admin-orders" class="nav-link text-dark px-3 py-2 rounded">Orders</a>
      </li>
      <li class="nav-item">
        <a href="#admin-products" class="nav-link text-dark px-3 py-2 rounded">Products</a>
      </li>
      <li class="nav-item">
        <a href="#analytics" class="nav-link text-dark px-3 py-2 rounded">Analytics</a>
      </li>

    `;
  }

  menu += `</ul>`;
  sidebar.innerHTML = menu;
  // تحديد الـ active link
  setActiveLink(location.hash || "#dashboard");
}
function setActiveLink(hash) {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.classList.add(
        "active",
        "bg-secondary-subtle",
        "text-primary",
        "fw-semibold"
      );
    } else {
      link.classList.remove(
        "active",
        "bg-secondary-subtle",
        "text-primary",
        "fw-semibold"
      );
    }
  });
}

// Init
window.addEventListener("load", () => {
  const user = getCurrentUser();
  if (user) {
    renderSidebar(user.role);
    loadPage(location.hash || "#dashboard");
  }
});

window.addEventListener("hashchange", () => {
  loadPage(location.hash);
  setActiveLink(location.hash);
});
