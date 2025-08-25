import { SellerDashboard } from "./seller/dashboard.js";
import { Products } from "./seller/products.js";
import { Orders } from "./seller/orders.js";

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
				content.innerHTML = Products();
				break;
			case "#orders":
				content.innerHTML = Orders();
				break;
			case "#analytics":
				content.innerHTML = Analytics();
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
			case "#reports":
				content.innerHTML = Reports();
				break;
			case "#settings":
				content.innerHTML = Settings();
				break;
			default:
				content.innerHTML = AdminDashboard();
		}
	}
}
