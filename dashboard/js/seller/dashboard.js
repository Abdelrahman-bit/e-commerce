import { getCurrentUser, getOrders, getProducts } from "../../../assests/js/storage.js";

export function SellerDashboard() {
	setTimeout(() => {
		// 1. Get current seller
		const currentUser = getCurrentUser();
		if (!currentUser || !currentUser.email) {
			console.warn("No seller logged in");
			return;
		}
		// 2. Filter products by seller
		const sellerProducts = getProducts().filter((p) => p.sellerEmail === currentUser.email);

		// 3. Filter orders containing at least one item from this seller
		const allOrders = getOrders();
		const sellerOrders = allOrders.filter((order) => order.items.some((item) => item.sellerEmail === currentUser.email));

		// charts
		// best selling products chart
		const bestSelling = getBestSellingProducts(sellerOrders);
		new Chart(document.getElementById("bestSellingChart"), {
			type: "bar",
			data: {
				labels: bestSelling.labels,
				datasets: [
					{
						label: "Units Sold",
						data: bestSelling.data,
						backgroundColor: "rgba(75, 192, 192, 0.6)",
						borderColor: "rgba(75, 192, 192, 1)",
						borderWidth: 2,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					title: { display: true, text: "Top 5 Best-Selling Products" },
				},
				scales: {
					y: { beginAtZero: true },
				},
			},
		});

		// by catergory chart

		const { cateLabels, cateData } = getOrdersByCategory(sellerOrders);
		new Chart(document.getElementById("categoryChart"), {
			type: "doughnut",
			data: {
				labels: cateLabels,
				datasets: [
					{
						data: cateData,
						backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
					},
				],
				options: {
					responsive: true,
				},
			},
		});

		// 4. Calculate seller’s revenue (sum of his items only)
		const totalRevenue = sellerOrders.reduce((total, order) => {
			const sellerItems = order.items.filter((item) => item.sellerEmail === currentUser.email);
			const sellerSubtotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
			return total + sellerSubtotal;
		}, 0);

		// 5. Calculate other metrics
		const totalProducts = sellerProducts.length;
		const totalOrders = sellerOrders.length; // number of orders that included this seller
		const lowStockProducts = sellerProducts.filter((p) => p.stock <= 10).length;

		// 4. Render values in dashboard
		document.getElementById("totalProducts-Seller-DB").textContent = totalProducts;
		document.getElementById("totalRevenue-Seller-DB").textContent = `$${totalRevenue}`;
		document.getElementById("totalOrders-Seller-DB").textContent = totalOrders;
		document.getElementById("lowStockProducts-Seller-DB").textContent = lowStockProducts;
	}, 0);

	return `
    <div class="col-lg-10 col-md-9 w-100 px-md-4">
    <div class="quick-actions mb-4 d-flex">
      <a href="#dashboard"><i class="fas fa-tachometer-alt"></i></a>
      <a href="#products"><i class="fa-solid fa-box-open"></i></a>
      <a href="#sellerOrders"><i class="fas fa-box"></i></a>
    </div>
      <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 class="h2">Seller Dashboard</h1>
      </div>

      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="h6 text-xs fw-semibold text-uppercase mb-1">
                Total Products
              </div>
              <div class="h4 mb-0 fw-bolder text-gray-800" id="totalProducts-Seller-DB">0</div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="h6 text-xs text-uppercase mb-1">Total Revenue</div>
              <div class="h4 mb-0 fw-bolder text-gray-800" id="totalRevenue-Seller-DB">$0</div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="h6 text-xs text-uppercase mb-1">Total Orders</div>
              <div class="h4 mb-0 fw-bolder text-gray-800" id="totalOrders-Seller-DB">0</div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="h6 text-xs text-uppercase mb-1">Low Stock Products</div>
              <div class="h4 mb-0 fw-bolder text-gray-800" id="lowStockProducts-Seller-DB">0</div>
            </div>
          </div>
        </div>
        <!-- analytics -->
        <div class="row">
			    <div class="col-md-6">
            <h5 class="card-title">Best Selling Products</h5>
            <canvas id="bestSellingChart" height="300"></canvas>
			    </div>

			    <div class="col-md-6 text-center" style="width: 370px; height: 370px; margin: 0 auto">
				    <h5>Orders by Category</h5>
				    <canvas id="categoryChart" height="100"></canvas>
			    </div>
		    </div>

      </div>
    </div>
  `;

	function getOrdersByCategory(orders) {
		const categories = {};

		orders.forEach((order) => {
			order.items.forEach((item) => {
				categories[item.category] = (categories[item.category] || 0) + 1;
			});
		});

		return {
			cateLabels: Object.keys(categories),
			cateData: Object.values(categories),
		};
	}
	function getBestSellingProducts(orders) {
		const productSales = {};

		orders.forEach((order) => {
			order.items.forEach((item) => {
				// Count by product name (you can also use item.id if you prefer)
				productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
			});
		});

		// Convert to sorted array
		const sorted = Object.entries(productSales)
			.sort((a, b) => b[1] - a[1]) // sort by quantity desc
			.slice(0, 5); // top 5 products

		return {
			labels: sorted.map((p) => p[0]), // product names
			data: sorted.map((p) => p[1]), // quantities
		};
	}
}
