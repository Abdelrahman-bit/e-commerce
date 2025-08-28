import {
  getCurrentUser,
  getOrders,
  getProducts,
} from "../../../assests/js/storage.js";

export function SellerDashboard() {
  setTimeout(() => {
    let totalProducts = getProducts().length;
    let totalRevenue = getOrders().reduce(
      (total, order) => total + order.total,
      0
    );
    let totalOrders = getOrders().length;
    let lowStockProducts = getProducts().filter((p) => p.stock <= 10).length;

    let totalProductsElement = document.getElementById(
      "totalProducts-Seller-DB"
    );
    let totalOrdersElement = document.getElementById("totalOrders-Seller-DB");
    let lowStockProductsElement = document.getElementById(
      "lowStockProducts-Seller-DB"
    );
    let totalRevenueElement = document.getElementById("totalRevenue-Seller-DB");

    totalProductsElement.textContent = totalProducts;
    totalRevenueElement.textContent = totalRevenue;
    totalOrdersElement.textContent = totalOrders;
    lowStockProductsElement.textContent = lowStockProducts;
  }, 0);
  return `
  <div class="col-lg-10 col-md-9 w-100 px-md-4s">
          <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom eeeeee"
          >
            <h1 class="h2">Seller Dashboard</h1>
            <div class="quick-actions mb-4 d-flex">
              <a href="#dashboard"><i class="fas fa-tachometer-alt"></i></a>
              <a href="#products"><i class="fa-solid fa-box-open"></i></a>
              <a href="#sellerOrders"><i class="fas fa-box"></i></a>
            </div>
          </div>
          <div
            class="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between flex-wrap flex-md-nowrap align-items-center py-2 my-4 eeeeee"
          >
            <h5 class="mb-3">Overview</h5>

            <!-- <div
              class="btn-group d-md-none"
              id="selectDashboardCategory"
              role="group"
              aria-label="Dashboard filter"
            >
              <input
                type="radio"
                class="btn-check"
                name="dashboard-filter"
                id="btnradio1"
                autocomplete="off"
                checked
              />
              <label class="btn btn-outline-dark btn-sm p-2" for="btnradio1"
                ><i class="fa-solid fa-house"></i> <span>Dashboard</span>
              </label>

              <input
                type="radio"
                class="btn-check"
                name="dashboard-filter"
                id="btnradio2"
                autocomplete="off"
              />
              <label class="btn btn-outline-dark btn-sm p-2" for="btnradio2"
                ><i class="fa-solid fa-boxes-stacked"></i>
                <span>Products</span></label
              >

              <input
                type="radio"
                class="btn-check"
                name="dashboard-filter"
                id="btnradio3"
                autocomplete="off"
              />
              <label class="btn btn-outline-dark btn-sm p-2" for="btnradio3"
                ><i class="fa-solid fa-receipt"></i> <span>Orders</span></label
              >

              <input
                type="radio"
                class="btn-check"
                name="dashboard-filter"
                id="btnradio4"
                autocomplete="off"
              />
              <label class="btn btn-outline-dark btn-sm p-2" for="btnradio4"
                ><i class="fa-solid fa-chart-line"></i>
                <span>Analytics</span></label
              >
            </div> -->
          </div>

          <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="h6 text-xs fw-semibold text-uppercase mb-1">
                        Total Products
                      </div>
                      <div
                        class="h4 mb-0 fw-bolder text-gray-800"
                        id="totalProducts-Seller-DB"
                      >
                        20
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="h6 text-xs text-uppercase mb-1">
                        total revenue
                      </div>
                      <div
                        id="totalRevenue-Seller-DB"
                        class="h4 mb-0 fw-bolder text-gray-800"
                      >
                        $215,000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="h6 text-xs text-uppercase mb-1">
                        total orders
                      </div>
                      <div
                        class="h4 mb-0 fw-bolder text-gray-800"
                        id="totalOrders-Seller-DB"
                      >
                        120
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="h6 text-xs text-uppercase mb-1">
                        low stock products
                      </div>
                      <div
                        class="h4 mb-0 fw-bolder text-gray-800"
                        id="lowStockProducts-Seller-DB"
                      >
                        4
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
`;
}
