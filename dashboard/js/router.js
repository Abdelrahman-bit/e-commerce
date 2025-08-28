import { SellerDashboard } from "./seller/dashboard.js";
import { products } from "./seller/products.js";
import { sellerOrders } from "./seller/sellerOrders.js";

import { adminProducts } from "./admin/adminProducts.js";
import { adminOrders } from "./admin/adminOrders.js";
import { AdminDashboard } from "./admin/dashboard.js";
import { Users } from "./admin/users.js";
import { Analytics } from "./admin/analytics.js";

import { getCurrentUser } from "../../assests/js/storage.js";

export function loadPage(route) {

  const content = document.getElementById("app-content");
  const user = getCurrentUser();
  
  if (!user) {
    content.innerHTML = "<p>Please login first</p>";
    return;
  }

	if (user.role === "seller") {
		switch (route) {
			case "#dashboard":
				content.innerHTML = SellerDashboard();
				break;
			case "#products":
				content.innerHTML = products();
				break;
			case "#seller-orders":
				content.innerHTML = sellerOrders();
				break;
			default:
				content.innerHTML = SellerDashboard();
		}
	}

	if (user.role === "admin") {
		switch (route) {
			case "#dashboard":
				content.innerHTML = AdminDashboard();
				break;
			case "#users":
				content.innerHTML = Users();
				break;
			case "#admin-orders":
				content.innerHTML = adminOrders();
				break;
			case "#analytics":
				content.innerHTML = Analytics();
        break;
			case "#admin-products":
				content.innerHTML = adminProducts();
				break;
			default:
				content.innerHTML = AdminDashboard();
		}
	}

}
