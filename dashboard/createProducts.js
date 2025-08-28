// products.js

// ======================
// Categories Data
// ======================
const categories = [
	{ id: 1, name: "Phones", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681676/iphone_tsbejx.jpg" },
	{ id: 2, name: "Computers", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681675/laptop_ksseyu.jpg" },
	{ id: 3, name: "SmartWatch", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681884/smartwatch_mi1bhk.png" },
	{ id: 4, name: "Tablets", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681675/tablet_vfmlus.jpg" },
	{ id: 5, name: "HeadPhones", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681675/headphone_qmavwj.jpg" },
	{ id: 6, name: "Gaming", image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681675/laptop_ksseyu.jpg" },
];

// ======================
// Factory Function
// ======================
export function createProducts() {
	return {
		currentProducts: [],

		init() {
			this.renderHTML();
			this.loadCategories();
			this.loadProducts();
			this.updateStats();
			this.setupEventListeners();
		},

		renderHTML() {
			const container = document.getElementById("products-content");
			if (!container) return;

			container.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 class="page-title">
          <i class="fas fa-box me-2"></i>
          <span class="d-none d-sm-inline">Product Management</span>
          <span class="d-sm-none">Products</span>
        </h1>
        <button class="btn text-white btn-sm bg-dark" onclick="window.Products.showAddProductModal()">
          <i class="fas fa-plus me-2"></i>
          <span class="d-none d-sm-inline ">Add New Product</span>
          <span class="d-sm-none">Add</span>
        </button>
      </div>
      
      <!-- Statistics Cards -->
      <div class="row g-3 mb-4" id="productStats">
        <div class="col-md-3 col-6">
          <div class="card bg-primary text-white">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Total Products</h6>
                  <h4 class="mb-0" id="productsTotalProducts">0</h4>
                </div>
                <i class="fas fa-boxes fa-lg opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card bg-success text-white">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Total Revenue</h6>
                  <h4 class="mb-0" id="productsTotalRevenue">$0</h4>
                </div>
                <i class="fas fa-dollar-sign fa-lg opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card bg-info text-white">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">In Stock</h6>
                  <h4 class="mb-0" id="productsInStockProducts">0</h4>
                </div>
                <i class="fas fa-check-circle fa-lg opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card bg-warning text-white">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Low Stock</h6>
                  <h4 class="mb-0" id="productsLowStockProducts">0</h4>
                </div>
                <i class="fas fa-exclamation-triangle fa-lg opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="row mb-3">
        <div class="col-lg-6 col-md-12 mb-2">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input type="text" class="form-control" placeholder="Search products..." id="searchProducts">
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-6 mb-2">
          <select class="form-select" id="filterCategory">
            <option value="all">All Categories</option>
          </select>
        </div>
        <div class="col-lg-3 col-md-6 col-6 mb-2">
          <select class="form-select" id="filterStock">
            <option value="all">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock (&lt;10)</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Products Table/Cards -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Your Products</h5>
        </div>
        <div class="card-body p-0">
          <!-- Desktop Table -->
          <div class="d-none d-lg-block">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="productsTableBody">
                  <!-- Products will be loaded here -->
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Mobile Cards -->
          <div class="d-lg-none" id="productsMobileCards">
            <!-- Mobile product cards will be loaded here -->
          </div>
        </div>
      </div>

      <!-- Add/Edit Product Modal -->
      <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Add New Product</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="productForm">
                <input type="hidden" id="productId">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="productName" class="form-label">Product Name *</label>
                    <input type="text" class="form-control" id="productName" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productCategory" class="form-label">Category *</label>
                    <select class="form-select" id="productCategory" required>
                      <option value="">Select Category</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="productPrice" class="form-label">Price ($) *</label>
                    <input type="number" class="form-control" id="productPrice" min="0" step="0.01" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productStock" class="form-label">Stock Quantity *</label>
                    <input type="number" class="form-control" id="productStock" min="0" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="productDescription" class="form-label">Description *</label>
                  <textarea class="form-control" id="productDescription" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="productImage" class="form-label">Product Image *</label>
                  <div class="d-flex flex-column flex-sm-row gap-2">
                    <input type="url" class="form-control" id="productImage" required 
                            placeholder="Enter image URL or use upload button">
                    <button type="button" class="btn btn-outline-secondary" onclick="window.Products.openCloudinaryWidget()">
                      <i class="fas fa-cloud-upload-alt me-1"></i>
                      <span class="d-none d-sm-inline">Upload</span>
                    </button>
                  </div>
                  <div class="form-text">
                    <small>Enter image URL directly, or try the upload button (requires Cloudinary configuration)</small><br>
                    <small>You can use free image hosting services like <a href="https://imgur.com" target="_blank">Imgur</a> or <a href="https://postimg.cc" target="_blank">PostImg</a></small>
                  </div>
                  <div id="imagePreview" class="mt-2" style="display: none;">
                    <img id="previewImg" src="" alt="Preview" style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px;">
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer flex-column flex-sm-row">
              <button type="button" class="btn btn-secondary w-100 w-sm-auto mb-2 mb-sm-0" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary w-100 w-sm-auto" onclick="window.Products.saveProduct()">Save Product</button>
            </div>
          </div>
        </div>
      </div>
    `;
		},

		// Refresh products data and display
		refresh() {
			console.log("Refreshing products data...");
			this.loadProducts();
			this.updateStats();
		},

		loadCategories() {
			const categorySelects = [document.getElementById("filterCategory"), document.getElementById("productCategory")];

			categorySelects.forEach((select) => {
				if (!select) return;

				if (select.id === "productCategory") {
					select.innerHTML = '<option value="">Select Category</option>';
				}

				categories.forEach((cat) => {
					const option = document.createElement("option");
					option.value = cat.name.toLowerCase();
					option.textContent = cat.name;
					select.appendChild(option);
				});
			});
		},

		loadProducts() {
			const currentUser = JSON.parse(localStorage.getItem("currentUser"));
			if (!currentUser) return;

			const allProducts = JSON.parse(localStorage.getItem("products")) || [];
			this.currentProducts = allProducts.filter((p) => p.sellerEmail === currentUser.email);

			this.renderProducts(this.currentProducts);
			this.updateStats();
		},

		renderProducts(products) {
			const tbody = document.getElementById("productsTableBody");
			const mobileCards = document.getElementById("productsMobileCards");

			if (products.length === 0) {
				if (tbody) {
					tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">No products found</td></tr>';
				}
				if (mobileCards) {
					mobileCards.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-box fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No products found</h5>
            <p class="text-muted">Add products to start managing your inventory.</p>
          </div>
        `;
				}
				return;
			}

			// Render desktop table
			if (tbody) {
				tbody.innerHTML = products
					.map(
						(product) => `
        <tr>
          <td>
            <img src="${product.image}" alt="${product.name}" 
                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
          </td>
          <td>
            <div class="fw-semibold">${product.name}</div>
            <small class="text-muted">${product.description.substring(0, 50)}...</small>
          </td>
          <td><span class="badge bg-secondary">${product.category}</span></td>
          <td class="fw-semibold">$${product.price}</td>
          <td>
            <span class="badge ${product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger"}">
              ${product.stock} units
            </span>
          </td>
          <td>
            <span class="badge ${product.stock > 0 ? "bg-success" : "bg-danger"}">
              ${product.stock > 0 ? "Available" : "Out of Stock"}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="window.Products.editProduct(${product.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.Products.deleteProductConfirm(${product.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `
					)
					.join("");
			}

			// Render mobile cards
			if (mobileCards) {
				mobileCards.innerHTML = products.map((product) => this.getMobileProductCardHTML(product)).join("");
			}
		},

		getMobileProductCardHTML(product) {
			return `
      <div class="card mb-3 mx-2">
        <div class="card-body p-3">
          <div class="row">
            <div class="col-3">
              <img src="${product.image}" alt="${product.name}" 
                   class="img-fluid rounded" style="width: 60px; height: 60px; object-fit: cover;">
            </div>
            <div class="col-9">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="mb-1 fw-bold">${product.name}</h6>
                  <span class="badge bg-secondary">${product.category}</span>
                </div>
                <h5 class="mb-0 text-primary">$${product.price}</h5>
              </div>
              
              <p class="text-muted mb-2 small">${product.description.substring(0, 80)}...</p>
              
              <div class="row align-items-center">
                <div class="col-6">
                  <small class="text-muted">Stock:</small>
                  <div>
                    <span class="badge ${product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger"}">
                      ${product.stock} units
                    </span>
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted">Status:</small>
                  <div>
                    <span class="badge ${product.stock > 0 ? "bg-success" : "bg-danger"}">
                      ${product.stock > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="d-flex gap-2 mt-3">
                <button class="btn btn-sm btn-outline-primary flex-fill" onclick="window.Products.editProduct(${product.id})">
                  <i class="fas fa-edit me-1"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger flex-fill" onclick="window.Products.deleteProductConfirm(${
					product.id
				})">
                  <i class="fas fa-trash me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
		},

		updateStats() {
			const currentUser = JSON.parse(localStorage.getItem("currentUser"));
			const totalProducts = this.currentProducts.length;

			// Calculate revenue from actual orders
			const orders = JSON.parse(localStorage.getItem("orders")) || [];
			let totalRevenue = 0;

			orders.forEach((order) => {
				if (order.items && Array.isArray(order.items)) {
					order.items.forEach((item) => {
						if (item.sellerEmail === currentUser.email) {
							totalRevenue += item.price * item.quantity;
						}
					});
				}
			});

			const inStockProducts = this.currentProducts.filter((p) => p.stock > 0).length;
			const lowStockProducts = this.currentProducts.filter((p) => p.stock > 0 && p.stock < 10).length;

			const totalProductsEl = document.getElementById("productsTotalProducts");
			const totalRevenueEl = document.getElementById("productsTotalRevenue");
			const inStockProductsEl = document.getElementById("productsInStockProducts");
			const lowStockProductsEl = document.getElementById("productsLowStockProducts");

			if (totalProductsEl) totalProductsEl.textContent = totalProducts;
			if (totalRevenueEl) totalRevenueEl.textContent = "$" + totalRevenue.toLocaleString();
			if (inStockProductsEl) inStockProductsEl.textContent = inStockProducts;
			if (lowStockProductsEl) lowStockProductsEl.textContent = lowStockProducts;
		},

		setupEventListeners() {
			const searchInput = document.getElementById("searchProducts");
			const categoryFilter = document.getElementById("filterCategory");
			const stockFilter = document.getElementById("filterStock");
			const imageInput = document.getElementById("productImage");

			if (searchInput) searchInput.addEventListener("input", () => this.filterProducts());
			if (categoryFilter) categoryFilter.addEventListener("change", () => this.filterProducts());
			if (stockFilter) stockFilter.addEventListener("change", () => this.filterProducts());
			if (imageInput) imageInput.addEventListener("input", (e) => this.showImagePreview(e.target.value));
		},

		filterProducts() {
			const searchTerm = document.getElementById("searchProducts")?.value.toLowerCase() || "";
			const categoryFilter = document.getElementById("filterCategory")?.value || "all";
			const stockFilter = document.getElementById("filterStock")?.value || "all";

			let filtered = this.currentProducts.filter((product) => {
				const matchesSearch =
					product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
				const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter;

				let matchesStock = true;
				if (stockFilter === "instock") matchesStock = product.stock > 10;
				else if (stockFilter === "lowstock") matchesStock = product.stock > 0 && product.stock <= 10;
				else if (stockFilter === "outofstock") matchesStock = product.stock === 0;

				return matchesSearch && matchesCategory && matchesStock;
			});

			this.renderProducts(filtered);
		},

		showAddProductModal() {
			const modalTitle = document.getElementById("modalTitle");
			const productForm = document.getElementById("productForm");
			const productId = document.getElementById("productId");

			if (modalTitle) modalTitle.textContent = "Add New Product";
			if (productForm) productForm.reset();
			if (productId) productId.value = "";
            this.showImagePreview('');

			const modal = new bootstrap.Modal(document.getElementById("productModal"));
			modal.show();
		},

		editProduct(productId) {
			const product = this.currentProducts.find((p) => p.id === productId);
			if (!product) return;

			const modalTitle = document.getElementById("modalTitle");
			const productIdField = document.getElementById("productId");
			const productName = document.getElementById("productName");
			const productCategory = document.getElementById("productCategory");
			const productPrice = document.getElementById("productPrice");
			const productStock = document.getElementById("productStock");
			const productDescription = document.getElementById("productDescription");
			const productImage = document.getElementById("productImage");

			if (modalTitle) modalTitle.textContent = "Edit Product";
			if (productIdField) productIdField.value = product.id;
			if (productName) productName.value = product.name;
			if (productCategory) productCategory.value = product.category.toLowerCase();
			if (productPrice) productPrice.value = product.price;
			if (productStock) productStock.value = product.stock;
			if (productDescription) productDescription.value = product.description;
			if (productImage) productImage.value = product.image;

			this.showImagePreview(product.image);

			const modal = new bootstrap.Modal(document.getElementById("productModal"));
			modal.show();
		},

		saveProduct() {
			const form = document.getElementById("productForm");
			if (!form.checkValidity()) {
				form.reportValidity();
				return;
			}

			const currentUser = JSON.parse(localStorage.getItem("currentUser"));
			const productId = document.getElementById("productId").value;

			const productData = {
				name: document.getElementById("productName").value,
				category: document.getElementById("productCategory").value,
				price: parseFloat(document.getElementById("productPrice").value),
				stock: parseInt(document.getElementById("productStock").value),
				description: document.getElementById("productDescription").value,
				image: document.getElementById("productImage").value,
				sellerEmail: currentUser.email,
				fav: false,
				quantity: 1,
			};

			let products = JSON.parse(localStorage.getItem("products")) || [];

			if (productId) {
				// Update existing product
				const index = products.findIndex((p) => p.id === parseInt(productId));
				if (index !== -1) {
					products[index] = { ...productData, id: parseInt(productId) };
				}
			} else {
				// Add new product
				const newId = Math.max(...products.map((p) => p.id), 0) + 1;
				products.push({ ...productData, id: newId });
			}

			localStorage.setItem("products", JSON.stringify(products));

			// Close modal and reload
			const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
			if (modal) modal.hide();

			this.loadProducts();

			// Show success message
			this.showAlert(productId ? "Product updated successfully!" : "Product added successfully!", "success");
		},

		deleteProductConfirm(productId) {
			const product = this.currentProducts.find((p) => p.id === productId);
			if (!product) return;

			if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
				let products = JSON.parse(localStorage.getItem("products")) || [];
				products = products.filter((p) => p.id !== productId);
				localStorage.setItem("products", JSON.stringify(products));

				this.loadProducts();
				this.showAlert("Product deleted successfully!", "success");
			}
		},

		showImagePreview(imageUrl) {
			const preview = document.getElementById("imagePreview");
			const previewImg = document.getElementById("previewImg");

			if (preview && previewImg && imageUrl && imageUrl.trim() !== "") {
				previewImg.src = imageUrl;
				preview.style.display = "block";
			} else if (preview) {
				preview.style.display = "none";
			}
		},

		showAlert(message, type) {
			const alertDiv = document.createElement("div");
			alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
			alertDiv.style.zIndex = "9999";
			alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
			document.body.appendChild(alertDiv);

			setTimeout(() => {
				alertDiv.remove();
			}, 5000);
		},
		// Cloudinary Upload Widget
		// SETUP INSTRUCTIONS:
		// 1. Go to your Cloudinary dashboard (cloudinary.com)
		// 2. Navigate to Settings > Upload
		// 3. Scroll to "Upload presets" section
		// 4. Create a new preset named "unsigned_preset"
		// 5. Set "Signing Mode" to "Unsigned"
		// 6. Enable the preset
		// Alternatively, change the uploadPreset below to match your existing preset
		openCloudinaryWidget() {
			// Check if Cloudinary is available
			if (typeof cloudinary === "undefined") {
				alert("Cloudinary widget is not loaded. Please refresh the page and try again.");
				return;
			}

			const cloudinaryWidget = cloudinary.createUploadWidget(
				{
					cloudName: "di6z8fske",
					uploadPreset: "unsigned_preset", // Use a standard unsigned preset name
					multiple: false,
					maxFiles: 1,
					resourceType: "image",
					folder: "ecommerce-products",
					publicId: `product_${Date.now()}`,
					cropping: true,
					croppingAspectRatio: 1,
					transformation: [{ width: 500, height: 500, crop: "fill", quality: "auto", format: "auto" }],
					// Add error handling
					sources: ["local", "url", "camera"],
					showAdvancedOptions: false,
					showInsecurePreview: true,
				},
				(error, result) => {
					if (error) {
						console.error("Cloudinary upload error:", error);

						// Handle specific error cases
						if (error.message && error.message.includes("Upload preset")) {
							window.Products.showAlert(
								"Upload configuration error. Please use the image URL field instead or contact support.",
								"warning"
							);
						} else {
							window.Products.showAlert("Failed to upload image: " + (error.message || "Unknown error"), "danger");
						}
						return;
					}

					if (result && result.event === "success") {
						const imageUrl = result.info.secure_url;
						const imageInput = document.getElementById("productImage");
						if (imageInput) {
							imageInput.value = imageUrl;
							window.Products.showImagePreview(imageUrl);
							window.Products.showAlert("Image uploaded successfully!", "success");
						}
					}
				}
			);

			// Add error handling for widget creation
			try {
				cloudinaryWidget.open();
			} catch (error) {
				console.error("Error opening Cloudinary widget:", error);
				window.Products.showAlert("Failed to open upload widget. Please use the image URL field instead.", "warning");
			}
		},
	};
}
