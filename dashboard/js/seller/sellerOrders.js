export function sellerOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  return `
    <style>
      @media (max-width: 576px) {
        .card h5, .card h6 { font-size: 0.8rem; }
        .card strong { font-size: 1rem; }
        table { font-size: 0.7rem; }
        .list-group-item{font-size: 0.7rem;}
      }
    </style>

    <div class="container-fluid p-3">
      <h2 class="my-3">Seller Dashboard</h2>
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
              orders.length ? orders
                    .map((order) => {
                      const productList = order.items
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ");

                      return `
                        <tr>
                          <td>${order.orderId}</td>
                          <td class="text-secondary p-2">${order.customerName}</td>
                          <td class="text-secondary p-2">${productList}</td>
                          <td class="text-secondary p-2">$${order.total}</td>
                          <td class="p-2">
                            <span class="badge ${
                              order.status === "Completed"
                                ? "bg-secondary"
                                : order.status === "Pending"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }">${order.status}</span>
                          </td>
                          <td class="text-secondary p-2">${new Date(
                            order.orderDate
                          ).toLocaleDateString()}</td>
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
