import { loadPage } from "./router.js";
import { getCurrentUser } from "../../assests/js/storage.js";

function renderSidebar(role) {
	const sidebar = document.getElementById("sidebar");

	if (role === "seller") {
		sidebar.innerHTML = `
      <ul class="nav flex-column">
        <li><a href="#dashboard" class="nav-link">Dashboard</a></li>
        <li><a href="#products" class="nav-link">Products</a></li>
        <li><a href="#orders" class="nav-link">Orders</a></li>
      </ul>
    `;
	}

	if (role === "admin") {
		sidebar.innerHTML = `
      <ul class="nav flex-column">
        <li><a href="#dashboard" class="nav-link">Admin Dashboard</a></li>
        <li><a href="#users" class="nav-link">Manage Users</a></li>
        <li><a href="#orders" class="nav-link">Orders</a></li>
        <li><a href="#analytics" class="nav-link">Analytics</a></li>
      </ul>
    `;
	}

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
});
