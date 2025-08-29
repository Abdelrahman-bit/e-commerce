export function adminOrders() {
	const products = JSON.parse(localStorage.getItem("products")) || [];
	const orders = JSON.parse(localStorage.getItem("orders")) || [];
	const users = JSON.parse(localStorage.getItem("users")) || [];

	const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

	const html = `
  <div className="container">
      <div class="quick-actions mb-4 d-flex">
        <a href="#dashboard"><i class="fas fa-tachometer-alt"></i> </a>
        <a href="#users"><i class="fas fa-users"></i> </a>
        <a href="#admin-orders"><i class="fas fa-box"></i></a>
        <a href="#analytics"><i class="fas fa-chart-line"></i> </a>
      </div>
      <h2 class="my-3">Admin Orders</h2>
          <div class="row">
          <div class="col-12">
          <div class="card shadow-sm mb-4">
          <div class="card-header  text-dark">
            <h5 class="mb-0">Recent Orders 🛒</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover table-striped mb-0">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentOrders
						.map(
							(o) => `
                    <tr>
                      <td>${o.orderId}</td>
                      <td>${o.customerName}</td>
                      <td>$${o.total}</td>
                      <td>
                        <span class="badge ${
							o.status.toLowerCase() === "completed"
								? "bg-success"
								: o.status.toLowerCase() === "pending"
								? "bg-warning text-dark"
								: "bg-danger"
						}">${o.status}</span>
                        </td>
                      <td>
                        <button class="btn btn-sm btn-outline-danger delete-order-btn">Delete</button>
                      </td>
                    </tr>
                  `
						)
						.join("")}
                </tbody>
                </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

	setTimeout(() => {
		document.querySelectorAll(".delete-order-btn").forEach((btn) => {
			btn.addEventListener("click", function () {
				const row = this.closest("tr");
				const orderId = row.querySelector("td").textContent.trim();
				deleteOrder(orderId);
				row.remove();
			});
		});
	}, 0);

	return html;
}

function deleteOrder(orderId) {
	let orders = JSON.parse(localStorage.getItem("orders")) || [];
	orders = orders.filter((o) => o.orderId !== orderId);
	localStorage.setItem("orders", JSON.stringify(orders));
}
