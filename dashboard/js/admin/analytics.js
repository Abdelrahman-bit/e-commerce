export function Analytics() {
  setTimeout(() => {
		const ctx = document.getElementById("salesChart").getContext("2d");
		new Chart(ctx, {
			type: "bar",
			data: {
				labels: ["Aug", "Sept", "Oct", "Nov", "Dec"],
				datasets: [
					{
						label: "Sales ($)",
						data: JSON.parse(localStorage.getItem("sales")) || [120, 19, 3, 5, 2, 3],
						backgroundColor: "rgba(54, 162, 235, 0.6)",
						borderColor: "rgba(54, 162, 235, 1)",
						borderWidth: 2,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					title: { display: true, text: "Monthly Sales Report" },
				},
				scales: { y: { beginAtZero: false } },
			},
		});
  }, 0);
	return `
    <h2>admin analytics</h2>
    <div class="card p-3 shadow">
      <h5 class="card-title">Sales Overview</h5>
      <canvas id="salesChart" height="300"></canvas>
    </div>
  `;
}
