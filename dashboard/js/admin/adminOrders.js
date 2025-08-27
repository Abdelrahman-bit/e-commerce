export function adminOrders() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );
  const lowStock = products.filter((p) => Number(p.stock) < 5).length;

  const productSales = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        productSales[product.name] =
          (productSales[product.name] || 0) + item.quantity;
      }
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0);

  const latestUsers = [...users].slice(-5).reverse();

  const activeUsers = users
    .map((u) => ({
      ...u,
      orderCount: orders.filter((o) => o.customerEmail === u.email).length,
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);

  const html = `
    <style>
      @media (max-width: 576px) {
        .card h5, .card h6 { font-size: 0.8rem; }
        .card strong { font-size: 1rem; }
        table { font-size: 0.7rem; }
        .list-group-item{font-size: 0.7rem;}
      }
    </style>

    <div class="row g-4">
        <div class="col-lg-12 col-12">
          <div class="card p-3 shadow-sm">
            <h5>Recent Orders 🛒</h5>
            <div class="table-responsive">
              <table class="table table-sm table-hover">
                <thead>
                  <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  ${recentOrders
                    .map(
                      (o) => `
                    <tr>
                      <td>${o.orderId}</td>
                      <td>${o.customerName}</td>
                      <td>$${o.total}</td>
                      <td><span class="badge bg-danger text-light shadow-sm">${o.status}</span></td>
                      <td><button class="btn btn-link text-danger p-0 delete-order-btn">Delete</button></td>
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
