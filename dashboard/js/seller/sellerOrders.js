// Seller Orders Management Module - Avoiding ES6 module syntax
const SellerOrders = {
  currentUser: null,
  orders: [],
  filteredOrders: [],
  
  init() {
    console.log('SellerOrders.init() called');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loadOrders();
    this.render();
  },
  
  loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter orders that contain products from this seller
    this.orders = allOrders.filter(order => {
      const orderItems = order.items || order.cart || [];
      return Array.isArray(orderItems) && 
             orderItems.some(item => item && item.sellerEmail === this.currentUser.email);
    }).map(order => {
      // Calculate seller-specific revenue for each order
      const orderItems = order.items || order.cart || [];
      let sellerRevenue = 0;
      let sellerItems = [];
      
      if (Array.isArray(orderItems)) {
        orderItems.forEach(item => {
          if (item && item.sellerEmail === this.currentUser.email) {
            sellerRevenue += (item.price * item.quantity);
            sellerItems.push(item);
          }
        });
      }
      
      return {
        ...order,
        sellerRevenue: sellerRevenue,
        sellerItems: sellerItems,
        sellerItemCount: sellerItems.length
      };
    });
    
    // Sort orders by date (newest first)
    this.orders.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.orderDate || 0);
      const dateB = new Date(b.date || b.createdAt || b.orderDate || 0);
      return dateB - dateA;
    });
    
    this.filteredOrders = [...this.orders];
    console.log('Loaded orders for seller:', this.orders.length);
  },
  
  render() {
    const ordersContent = document.getElementById('orders-content');
    if (!ordersContent) {
      console.error('Orders content container not found');
      return;
    }
    
    ordersContent.innerHTML = this.getOrdersHTML();
    this.attachEventListeners();
  },
  
  getOrdersHTML() {
    return `
      <div class="orders-management">
        <!-- Orders Summary Cards -->
        <div class="row mb-4">
          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">Total Orders</h6>
                    <h4 class="mb-0 text-primary">${this.orders.length}</h4>
                  </div>
                  <div class="text-primary">
                    <i class="fas fa-shopping-cart fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">Total Revenue</h6>
                    <h4 class="mb-0 text-success">$${this.getTotalRevenue().toLocaleString()}</h4>
                  </div>
                  <div class="text-success">
                    <i class="fas fa-dollar-sign fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">Items Sold</h6>
                    <h4 class="mb-0 text-info">${this.getTotalItemsSold()}</h4>
                  </div>
                  <div class="text-info">
                    <i class="fas fa-box fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="text-muted mb-0">Avg Order Value</h6>
                    <h4 class="mb-0 text-warning">$${this.getAverageOrderValue().toFixed(2)}</h4>
                  </div>
                  <div class="text-warning">
                    <i class="fas fa-chart-line fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Filters and Search -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row align-items-end">
              <div class="col-lg-4 col-md-6 mb-2">
                <label for="orderSearch" class="form-label">Search Orders</label>
                <input type="text" class="form-control" id="orderSearch" placeholder="Search by customer, order ID...">
              </div>
              <div class="col-lg-2 col-md-3 col-6 mb-2">
                <label for="statusFilter" class="form-label">Status</label>
                <select class="form-select" id="statusFilter">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="col-lg-2 col-md-3 col-6 mb-2">
                <label for="dateFilter" class="form-label">Date</label>
                <select class="form-select" id="dateFilter">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div class="col-lg-2 col-md-6 col-12 mb-2">
                <button class="btn btn-primary w-100" onclick="SellerOrders.refresh()">
                  <i class="fas fa-refresh me-2"></i>
                  <span class="d-none d-sm-inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Orders Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>Orders List
              <span class="badge bg-primary ms-2">${this.filteredOrders.length}</span>
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.getOrdersTableHTML()}
          </div>
        </div>
      </div>
    `;
  },
  
  getOrdersTableHTML() {
    if (this.filteredOrders.length === 0) {
      return `
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No orders found</h5>
          <p class="text-muted">Orders containing your products will appear here.</p>
        </div>
      `;
    }
    
    // Mobile-first responsive table
    return `
      <!-- Desktop Table -->
      <div class="d-none d-lg-block">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Your Items</th>
                <th>Your Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredOrders.map(order => this.getOrderRowHTML(order)).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Mobile Cards -->
      <div class="d-lg-none">
        ${this.filteredOrders.map(order => this.getMobileOrderCardHTML(order)).join('')}
      </div>
    `;
  },
  
  getOrderRowHTML(order) {
    const orderDate = new Date(order.date || order.createdAt || order.orderDate || Date.now());
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const statusClass = this.getStatusClass(order.status);
    
    return `
      <tr>
        <td>
          <strong>#${order.orderId || order.id || 'N/A'}</strong>
        </td>
        <td>
          <div>
            <strong>${order.customerName || 'Unknown Customer'}</strong>
            <br>
            <small class="text-muted">${order.customerEmail || ''}</small>
          </div>
        </td>
        <td>${formattedDate}</td>
        <td>
          <span class="badge bg-info">${order.sellerItemCount} items</span>
          <br>
          <small class="text-muted">Qty: ${this.getTotalQuantity(order.sellerItems)}</small>
        </td>
        <td>
          <strong class="text-success">$${order.sellerRevenue.toLocaleString()}</strong>
        </td>
        <td>
          <span class="badge bg-${statusClass}">${order.status || 'pending'}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="SellerOrders.viewOrderDetails('${order.orderId || order.id}')">
            <i class="fas fa-eye"></i> View
          </button>
        </td>
      </tr>
    `;
  },
  
  getMobileOrderCardHTML(order) {
    const orderDate = new Date(order.date || order.createdAt || order.orderDate || Date.now());
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const statusClass = this.getStatusClass(order.status);
    
    return `
      <div class="card mb-3 mx-2">
        <div class="card-body p-3">
          <div class="row">
            <div class="col-12 mb-2">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">#${order.orderId || order.id || 'N/A'}</h6>
                  <span class="badge bg-${statusClass}">${order.status || 'pending'}</span>
                </div>
                <small class="text-muted">${formattedDate}</small>
              </div>
            </div>
            
            <div class="col-12 mb-2">
              <strong class="text-dark">${order.customerName || 'Unknown Customer'}</strong>
              <br>
              <small class="text-muted">${order.customerEmail || ''}</small>
            </div>
            
            <div class="col-6">
              <small class="text-muted">Items:</small>
              <div>
                <span class="badge bg-info">${order.sellerItemCount}</span>
                <small class="text-muted ms-1">Qty: ${this.getTotalQuantity(order.sellerItems)}</small>
              </div>
            </div>
            
            <div class="col-6 text-end">
              <small class="text-muted">Revenue:</small>
              <div>
                <strong class="text-success">$${order.sellerRevenue.toLocaleString()}</strong>
              </div>
            </div>
            
            <div class="col-12 mt-2">
              <button class="btn btn-sm btn-outline-primary w-100" onclick="SellerOrders.viewOrderDetails('${order.orderId || order.id}')">
                <i class="fas fa-eye me-1"></i> View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  getStatusClass(status) {
    const statusClasses = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return statusClasses[status?.toLowerCase()] || 'secondary';
  },
  
  getTotalRevenue() {
    return this.orders.reduce((total, order) => total + order.sellerRevenue, 0);
  },
  
  getTotalItemsSold() {
    return this.orders.reduce((total, order) => {
      return total + order.sellerItems.reduce((itemTotal, item) => itemTotal + (item.quantity || 0), 0);
    }, 0);
  },
  
  getAverageOrderValue() {
    if (this.orders.length === 0) return 0;
    return this.getTotalRevenue() / this.orders.length;
  },
  
  getTotalQuantity(items) {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  },
  
  attachEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterOrders());
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.filterOrders());
    }
    
    // Date filter
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
      dateFilter.addEventListener('change', () => this.filterOrders());
    }
  },
  
  filterOrders() {
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    this.filteredOrders = this.orders.filter(order => {
      // Search filter
      const matchesSearch = !searchTerm || 
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm)) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm)) ||
        (order.orderId && order.orderId.toString().toLowerCase().includes(searchTerm));
      
      // Status filter
      const matchesStatus = !statusFilter || 
        (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (dateFilter) {
        const orderDate = new Date(order.date || order.createdAt || order.orderDate || 0);
        const today = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            matchesDate = orderDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Re-render the table
    const ordersContent = document.getElementById('orders-content');
    if (ordersContent) {
      const tableContainer = ordersContent.querySelector('.card-body');
      if (tableContainer) {
        tableContainer.innerHTML = this.getOrdersTableHTML();
      }
    }
  },
  
  viewOrderDetails(orderId) {
    const order = this.orders.find(o => (o.orderId || o.id) == orderId);
    if (!order) return;
    
    // Create modal for order details
    const modalHTML = `
      <div class="modal fade" id="orderDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-receipt me-2"></i>
                <span class="d-none d-sm-inline">Order Details - #${order.orderId || order.id}</span>
                <span class="d-sm-none">#${order.orderId || order.id}</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6 mb-2">
                  <div class="card bg-light">
                    <div class="card-body p-3">
                      <h6 class="card-title mb-2">Customer Information</h6>
                      <p class="mb-1"><strong>Name:</strong> ${order.customerName || 'N/A'}</p>
                      <p class="mb-1"><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
                      <p class="mb-0"><strong>Status:</strong> <span class="badge bg-${this.getStatusClass(order.status)}">${order.status || 'pending'}</span></p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="card bg-light">
                    <div class="card-body p-3">
                      <h6 class="card-title mb-2">Order Summary</h6>
                      <p class="mb-1"><strong>Date:</strong> ${new Date(order.date || order.createdAt || order.orderDate || Date.now()).toLocaleDateString()}</p>
                      <p class="mb-1"><strong>Your Revenue:</strong> <span class="text-success fw-bold">$${order.sellerRevenue.toLocaleString()}</span></p>
                      <p class="mb-0"><strong>Items:</strong> ${order.sellerItemCount} products</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h6 class="mb-3">Your Items in this Order:</h6>
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <thead class="table-dark">
                    <tr>
                      <th>Product</th>
                      <th class="text-center">Price</th>
                      <th class="text-center">Qty</th>
                      <th class="text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.sellerItems.map(item => `
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded">` : ''}
                            <div>
                              <div class="fw-bold">${item.name}</div>
                              ${item.category ? `<small class="text-muted">${item.category}</small>` : ''}
                            </div>
                          </div>
                        </td>
                        <td class="text-center">$${item.price}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-center text-success fw-bold">$${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot class="table-dark">
                    <tr>
                      <th colspan="3" class="text-end">Total Revenue:</th>
                      <th class="text-center text-success">$${order.sellerRevenue.toFixed(2)}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('orderDetailsModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
  },
  
  refresh() {
    console.log('Refreshing orders...');
    this.loadOrders();
    this.render();
    
    // Show refresh feedback
    const btn = document.querySelector('[onclick*="SellerOrders.refresh"]');
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-spin');
        setTimeout(() => icon.classList.remove('fa-spin'), 1000);
      }
    }
  }
};

// Make SellerOrders available globally
window.SellerOrders = SellerOrders;
window.sellerOrders = SellerOrders;
