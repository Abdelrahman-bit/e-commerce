// Seller Dashboard Module - Global object to avoid ES6 module issues
const SellerDashboard = {
  charts: {},
  
  init() {
    console.log('SellerDashboard.init() called');
    setTimeout(() => {
      this.loadAnalyticsData();
      this.initializeCharts();
    }, 100);
  },

  loadAnalyticsData() {
    console.log('Loading analytics data...');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const sellerProducts = products.filter(p => p.sellerEmail === currentUser.email);
    const sellerOrders = orders.filter(o => {
      // Handle both old format (cart) and new format (items)
      const orderItems = o.items || o.cart || [];
      return Array.isArray(orderItems) && 
              orderItems.some(item => item && item.sellerEmail === currentUser.email);
    });
    
    // Update KPI cards
    const totalProducts = sellerProducts.length;
    
    // Calculate revenue from actual orders
    let totalRevenue = 0;
    sellerOrders.forEach(order => {
      // Handle both old format (cart) and new format (items)
      const orderItems = order.items || order.cart || [];
      if (Array.isArray(orderItems)) {
        orderItems.forEach(item => {
          if (item && item.sellerEmail === currentUser.email) {
            totalRevenue += (item.price * item.quantity);
          }
        });
      }
    });
    
    const totalOrders = sellerOrders.length;
    const lowStockCount = sellerProducts.filter(p => p.stock < 10 && p.stock > 0).length;
    
    // Update DOM elements
    const totalProductsEl = document.getElementById('totalProducts');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalOrdersEl = document.getElementById('totalOrders');
    const lowStockEl = document.getElementById('lowStock');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toLocaleString();
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (lowStockEl) lowStockEl.textContent = lowStockCount;
    
    console.log('Analytics data loaded:', { totalProducts, totalRevenue, totalOrders, lowStockCount });
  },
  
  initializeCharts() {
    console.log('Initializing charts...');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const sellerProducts = products.filter(p => p.sellerEmail === currentUser.email);
    
    this.initSalesChart();
    this.initCategoryChart(sellerProducts);
    this.initTopProductsChart(sellerProducts);
    this.initStockChart(sellerProducts);
  },
  
  initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) {
      console.log('Sales chart canvas not found');
      return;
    }
    
    // Get current user and orders for real sales data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate sales data by date (last 7 days)
    const today = new Date();
    const salesData = {};
    const orderCounts = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesData[dateStr] = 0;
      orderCounts[dateStr] = 0;
    }
    
    // Process actual orders for this seller
    orders.forEach(order => {
      const orderDate = new Date(order.date || order.createdAt || Date.now());
      const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (salesData.hasOwnProperty(dateStr)) {
        const orderItems = order.items || order.cart || [];
        let orderRevenue = 0;
        let hasSellerItems = false;
        
        if (Array.isArray(orderItems)) {
          orderItems.forEach(item => {
            if (item && item.sellerEmail === currentUser.email) {
              orderRevenue += (item.price * item.quantity);
              hasSellerItems = true;
            }
          });
        }
        
        if (hasSellerItems) {
          salesData[dateStr] += orderRevenue;
          orderCounts[dateStr] += 1;
        }
      }
    });
    
    const labels = Object.keys(salesData);
    const revenueData = Object.values(salesData);
    const orderData = Object.values(orderCounts);
    
    this.charts.sales = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue ($)',
          data: revenueData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Orders',
          data: orderData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        onResize: (chart, size) => {
          chart.resize();
        },
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue ($)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Orders'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });
  },
      
  initCategoryChart(products) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) {
      console.log('Category chart canvas not found');
      return;
    }
    
    const categoryData = {};
    products.forEach(p => {
      categoryData[p.category] = (categoryData[p.category] || 0) + 1;
    });
    
    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        onResize: (chart, size) => {
          chart.resize();
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },
      
  initTopProductsChart(products) {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) {
      console.log('Top products chart canvas not found');
      return;
    }
    
    // Get current user and orders to calculate actual sales
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate actual sales from orders
    const productSales = {};
    orders.forEach(order => {
      const orderItems = order.items || order.cart || [];
      if (Array.isArray(orderItems)) {
        orderItems.forEach(item => {
          if (item && item.sellerEmail === currentUser.email) {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
          }
        });
      }
    });
    
    // Get top 5 products by sales
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // If no sales data, show placeholder
    const chartData = topProducts.length > 0 ? {
      labels: topProducts.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
      datasets: [{
        label: 'Units Sold',
        data: topProducts.map(([, quantity]) => quantity),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    } : {
      labels: ['No sales data'],
      datasets: [{
        label: 'Units Sold',
        data: [0],
        backgroundColor: 'rgba(200, 200, 200, 0.6)',
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1
      }]
    };
    
    this.charts.topProducts = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        onResize: (chart, size) => {
          chart.resize();
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Units Sold'
            }
          }
        }
      }
    });
  },
      
  initStockChart(products) {
    const ctx = document.getElementById('stockChart');
    if (!ctx) {
      console.log('Stock chart canvas not found');
      return;
    }
    
    // Filter products to only include current seller's products
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const sellerProducts = products.filter(p => p.sellerEmail === currentUser.email);
    
    const stockData = {
      'High Stock (>20)': sellerProducts.filter(p => p.stock > 20).length,
      'Medium Stock (10-20)': sellerProducts.filter(p => p.stock >= 10 && p.stock <= 20).length,
      'Low Stock (<10)': sellerProducts.filter(p => p.stock < 10 && p.stock > 0).length,
      'Out of Stock': sellerProducts.filter(p => p.stock === 0).length
    };
    
    this.charts.stock = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(stockData),
        datasets: [{
          label: 'Products',
          data: Object.values(stockData),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        onResize: (chart, size) => {
          chart.resize();
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Products'
            }
          }
        }
      }
    });
  },

  // Refresh dashboard data and charts
  refresh() {
    console.log('Refreshing seller dashboard...');
    this.destroyExistingCharts();
    requestAnimationFrame(() => {
      this.loadAnalyticsData();
      this.initializeCharts();
    });
  },

  refreshAnalytics() {
    this.loadAnalyticsData();
    // Destroy existing charts and recreate
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
    this.initializeCharts();
    
    // Show refresh feedback
    const btn = document.querySelector('[onclick="refreshAnalytics()"]');
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-spin');
        setTimeout(() => icon.classList.remove('fa-spin'), 1000);
      }
    }
  }
};

// Make SellerDashboard available globally
window.SellerDashboard = SellerDashboard;

// Global refresh function
window.refreshAnalytics = function() {
  SellerDashboard.refreshAnalytics();
};