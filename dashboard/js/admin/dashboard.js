export function AdminDashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );
  const lowStock = products.filter((p) => Number(p.stock) < 10).length;

  // ---- Top Products ----
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

  // ---- Recent Orders ----
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  // ---- User Activity ----
  const latestUsers = [...users].slice(-5).reverse();
  
  const activeUsers = users
    .map((u) => ({
      ...u,
      orderCount: orders.filter((o) => o.customerEmail === u.email).length,
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);

  return `
    <style>
  @media (max-width: 576px) {
        .card h5, .card h6 { font-size: 0.8rem; }
        .card strong { font-size: 1rem; }
        table { font-size: 0.7rem; }
        .list-group-item{font-size: 0.7rem;}
        .quick-actions span { display: none; } /* يخفي النصوص */
        
  .nav-item {
    display: block; 
  }
 
      }
        
      .quick-actions a {
        margin-right: 10px;
        text-decoration: none;
        color: #333;
        font-size: 0.9rem;
        display:block;
        transition: transform 0.2s;

      }
         .quick-actions a:hover{
    transform: scale(1.4);
 }
        @media(min-width:576px){
                         .quick-actions a{
display:none !important;
background-color:red;
         }

  }


    </style>

    <div class="container-fluid">
      <h2 class="my-3">Admin Dashboard</h2>
      <div class="quick-actions mb-4 d-flex">
        <a href="#dashboard"><i class="fas fa-tachometer-alt"></i> </a>
        <a href="#users"><i class="fas fa-users"></i> </a>
        <a href="#admin-orders"><i class="fas fa-box"></i></a>
        <a href="#analytics"><i class="fas fa-chart-line"></i> </a>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-md-3">
          <div class="card p-3 text-center shadow-sm">
            <h6>Total Products</h6>
            <strong>${products.length}</strong>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="card p-3 text-center shadow-sm">
            <h6>Total Revenue</h6>
            <strong>$${totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="card p-3 text-center shadow-sm">
            <h6>Total Orders</h6>
            <strong>${orders.length}</strong>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="card p-3 text-center shadow-sm">
            <h6>Low Stock</h6>
            <strong>${lowStock}</strong>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6 col-12">
          <div class="card p-3 shadow-sm">
            <h5>Recent Orders 🛒</h5>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr>
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
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-12">
          <div class="card p-3 shadow-sm">
            <h5>Top Products ⭐</h5>
            <ul class="list-group">
              ${topProducts
                .map(
                  ([name, qty]) => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  ${name}
                  <span class="badge bg-primary rounded-pill">${qty}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- User Activity Section -->
      <div class="card p-3 my-4">
        <h5>User Activity 👤</h5>
        <div class="row">
          <!-- Latest Registered Users -->
          <div class="col-lg-6 col-12 mb-3">
            <h6>🆕 Latest Registered Users</h6>
            <div class="table-responsive">
              <table class="table table-sm table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    latestUsers.length
                      ? latestUsers
                          .map((u) => {
                            let badgeClass =
                              u.role === "admin"
                                ? "danger"
                                : u.role === "seller"
                                ? "info"
                                : "success";
                            return `
                            <tr>
                              <td>${u.name}</td>
                              <td>${u.email}</td>
                              <td><span class="badge bg-${badgeClass}">${
                              u.role || "user"
                            }</span></td>
                            </tr>`;
                          })
                          .join("")
                      : `<tr><td colspan="3" class="text-center">No users found</td></tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Most Active Users -->
          <div class="col-lg-6 col-12">
            <h6>🔥 Most Active Users</h6>
            <div class="table-responsive">
              <table class="table table-sm table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Orders</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    activeUsers.length
                      ? activeUsers
                          .map((u) => {
                            let badgeClass =
                              u.role === "admin"
                                ? "danger"
                                : u.role === "seller"
                                ? "info"
                                : "success";
                            return `
                            <tr>
                              <td>${u.name}</td>
                              <td>${u.orderCount}</td>
                              <td><span class="badge bg-${badgeClass}">${
                              u.role || "user"
                            }</span></td>
                            </tr>`;
                          })
                          .join("")
                      : `<tr><td colspan="3" class="text-center">No active users</td></tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
