export function Analytics() {
	setTimeout(() => {
		const orders = JSON.parse(localStorage.getItem("orders")) || [];

		const revenue = getRevenueOverTime(orders);

		new Chart(document.getElementById("revenueChart"), {
			type: "line",
			data: {
				labels: revenue.labels, // e.g. ["2025-08-25", "2025-08-26", "2025-08-27"]
				datasets: [
					{
						label: "Daily Revenue ($)",
						data: revenue.data,
						fill: true,
						borderColor: "rgba(75, 192, 192, 1)",
						backgroundColor: "rgba(75, 192, 192, 0.2)",
						tension: 0.3, // smooth curves
						borderWidth: 2,
						pointBackgroundColor: "rgba(75, 192, 192, 1)",
						pointRadius: 5,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					title: { display: true, text: "Revenue by Day" },
				},
				scales: {
					x: {
						ticks: { autoSkip: true, maxRotation: 45, minRotation: 45 }, // avoid overlapping
					},
					y: { beginAtZero: true },
				},
			},
		});


		// by catergory chart

		const { cateLabels, cateData } = getOrdersByCategory(orders);
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

		// best selling products chart
		const bestSelling = getBestSellingProducts(orders);
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
	}, 0);
	return `
		<div class="quick-actions mb-4 d-flex">
        <a href="#dashboard"><i class="fas fa-tachometer-alt"></i> </a>
        <a href="#users"><i class="fas fa-users"></i> </a>
        <a href="#admin-orders"><i class="fas fa-box"></i></a>
        <a href="#admin-products"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
        <a href="#analytics"><i class="fas fa-chart-line"></i> </a>
      </div>
		<h2>admin analytics</h2>
		<div class="row">
			<div class="col-md-6">
				<h5>Sales Over Time</h5>
				<canvas id="revenueChart"></canvas>
			</div>

			<div class="col-md-6 text-center" style="width: 370px; height: 370px; margin: 0 auto">
				<h5>Orders by Category</h5>
				<canvas id="categoryChart" height="100"></canvas>
			</div>
		</div>

		<div class="row mt-4">
			<div class="card p-3 shadow mt-4">
  				<h5 class="card-title">Best Selling Products</h5>
  				<canvas id="bestSellingChart" height="300"></canvas>
			</div>
		</div>
  `;
}

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

function getRevenueOverTime(orders) {
	const revenueByDay = {};

	orders.forEach((order) => {
		const date = new Date(order.orderDate);
		const day = date.toISOString().split("T")[0]; // YYYY-MM-DD
		revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
	});

	// Sort days chronologically
	const sortedDays = Object.keys(revenueByDay).sort((a, b) => new Date(a) - new Date(b));

	return {
		labels: sortedDays,
		data: sortedDays.map((day) => revenueByDay[day]),
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
