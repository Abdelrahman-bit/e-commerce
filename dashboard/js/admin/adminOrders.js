export function adminOrders() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const html = `
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm mb-4">
          <div class="card-header text-dark">
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
                    .map((o) => {
                      // Find the user by email
                      const user = users.find((u) => u.email === o.customerEmail);
                      const customerName = user ? user.name : "Unknown";

                      return `
                        <tr data-id="${o.orderId}">
                          <td>${o.orderId}</td>
                          <td>${customerName}</td>
                          <td>$${o.total}</td>
                          <td>
                            <select class="form-select form-select-sm order-status">
                              <option value="pending" ${
                                o.status.toLowerCase() === "pending" ? "selected" : ""
                              }>Pending</option>
                              <option value="completed" ${
                                o.status.toLowerCase() === "completed" ? "selected" : ""
                              }>Completed</option>
                              <option value="delivered" ${
                                o.status.toLowerCase() === "delivered" ? "selected" : ""
                              }>Delivered</option>
                            </select>
                          </td>
                          <td>
                            <button class="btn btn-sm btn-outline-danger delete-order-btn">Delete</button>
                          </td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Delete order
    document.querySelectorAll(".delete-order-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const row = this.closest("tr");
        const orderId = row.dataset.id;
        deleteOrder(orderId);
        row.remove();
      });
    });

    // Handle status change
    document.querySelectorAll(".order-status").forEach((select) => {
      updateStatusColor(select); // initial color
      select.addEventListener("change", function () {
        const row = this.closest("tr");
        const orderId = row.dataset.id;
        updateOrderStatus(orderId, this.value);
        updateStatusColor(this);
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

function updateOrderStatus(orderId, newStatus) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index !== -1) {
    orders[index].status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}

// Change dropdown color dynamically
function updateStatusColor(select) {
  select.classList.remove("bg-success", "bg-warning", "bg-danger", "bg-primary", "text-dark");

  if (select.value === "pending") {
    select.classList.add("bg-warning", "text-dark");
  } else if (select.value === "completed") {
    select.classList.add("bg-primary");
  } else if (select.value === "delivered") {
    select.classList.add("bg-success");
  } else {
    select.classList.add("bg-danger");
  }
}
