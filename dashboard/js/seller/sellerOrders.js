export function sellerOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const sellerOrders = orders.filter(order =>
    order.items.some(item => item.sellerEmail === currentUser.email)
  );

  return `
    <div class="container-fluid p-3">
      <h2 class="my-3">Seller Orders</h2>
      <h4>Orders</h4>

      <div class="table-responsive">
        <table class="table border table-striped table-hover">
          <thead>
            <tr class="table-dark">
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Products</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            ${
              sellerOrders.length ? sellerOrders
                .map((order) => {
                  const user = users.find((u) => u.email === order.customerEmail);

                  const sellerItems = order.items.filter(item => item.sellerEmail === currentUser.email);

                  const productList = sellerItems
                    .map((item) => `${item.name} (x${item.quantity})`)
                    .join(", ");

                  const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                  return `
                    <tr>
                      <td>${order.orderId}</td>
                      <td class="text-secondary p-2">${user ? user.name : order.customerName}</td>
                      <td class="text-secondary p-2">${productList}</td>
                      <td class="text-secondary p-2">$${sellerTotal}</td>
                      <td class="p-2">
                        <span class="badge ${
                          order.status === "Completed"
                            ? "bg-secondary"
                            : order.status === "Pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }">${order.status}</span>
                      </td>
                      <td class="text-secondary p-2">${new Date(order.orderDate).toLocaleDateString()}</td>
                    </tr>
                  `;
                })
                .join("")
              : `<tr><td colspan="6" class="text-center text-muted">No orders found</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}
