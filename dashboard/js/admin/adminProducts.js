export function adminProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const html = `
    <style>
      /* Default table for desktop */
      .product-card {
        display: none; /* hide cards on desktop */
      }

      /* Mobile view */
      @media (max-width: 576px) {
        table { display: none; } /* hide table */
        .product-card {
          display: block;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .product-card img {
          width: 100%;
          height: auto;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .product-card .actions button {
          margin-right: 5px;
          margin-top: 5px;
          font-size: 0.8rem;
          padding: 0.25rem 0.4rem;
        }
        .product-card strong {
          display: inline-block;
          width: 80px;
        }
      }
    </style>

    <div class="container mt-4">
    <div class="quick-actions mb-4 d-flex">
        <a href="#dashboard"><i class="fas fa-tachometer-alt"></i> </a>
        <a href="#users"><i class="fas fa-users"></i> </a>
        <a href="#admin-orders"><i class="fas fa-box"></i></a>
        <a href="#analytics"><i class="fas fa-chart-line"></i> </a>
      </div>
      <h2 class="mb-3">Products Dashboard</h2>

      <!-- Desktop Table -->
      <div class="table-responsive d-none d-sm-block">
        <table class="table table-striped table-hover table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productsTbody">
            ${products
				.map(
					(p) => `
              <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" width="50" height="50" class="rounded"></td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>$${p.price}</td>
                <td>${p.stock}</td>
                <td>
                  <button class="btn btn-sm btn-info view-btn">View</button>
                  <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                </td>
              </tr>
            `
				)
				.join("")}
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div id="productCards" class="d-block d-sm-none">
        ${products
			.map(
				(p) => `
          <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}">
            <p><strong>ID:</strong> ${p.id}</p>
            <p><strong>Name:</strong> ${p.name}</p>
            <p><strong>Category:</strong> ${p.category}</p>
            <p><strong>Price:</strong> $${p.price}</p>
            <p><strong>Stock:</strong> ${p.stock}</p>
            <div class="actions">
              <button class="btn btn-sm btn-info view-btn">View</button>
              <button class="btn btn-sm btn-warning edit-btn">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </div>
          </div>
        `
			)
			.join("")}
      </div>
    </div>

    <!-- View Modal -->
    <div class="modal fade" id="viewModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Product Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="viewBody"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="editForm">
              <input type="hidden" id="editId">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" id="editName" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-control" id="editCategory" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Price</label>
                  <input type="number" step="0.01" class="form-control" id="editPrice" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Stock</label>
                  <input type="number" class="form-control" id="editStock" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" id="editImage" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="editDescription" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Seller Email</label>
                <input type="email" class="form-control" id="editSellerEmail" required>
              </div>
              <button type="submit" class="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const viewBody = document.getElementById("viewBody");
    const editForm = document.getElementById("editForm");
    const editModalEl = document.getElementById("editModal");
    const viewModalEl = document.getElementById("viewModal");

    // Handle clicks for both table and cards
    document.querySelectorAll(".view-btn, .edit-btn, .delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest("tr") || e.target.closest(".product-card");
        if (!card) return;
        const id = parseInt(card.dataset.id || card.cells[0].textContent, 10);
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const idx = products.findIndex((p) => p.id === id);
        if (idx === -1) return;
        const product = products[idx];

        // VIEW
        if (e.target.classList.contains("view-btn")) {
          viewBody.innerHTML = `
            <div class="row">
              <div class="col-md-4"><img src="${product.image}" class="img-fluid rounded"></div>
              <div class="col-md-8">
                <h4>${product.name}</h4>
                <p><b>Category:</b> ${product.category}</p>
                <p><b>Price:</b> $${product.price}</p>
                <p><b>Stock:</b> ${product.stock}</p>
                <p><b>Seller:</b> ${product.sellerEmail}</p>
                <p><b>Description:</b> ${product.description}</p>
              </div>
            </div>
          `;
          new bootstrap.Modal(viewModalEl).show();
        }

        // EDIT
        if (e.target.classList.contains("edit-btn")) {
          document.getElementById("editId").value = product.id;
          document.getElementById("editName").value = product.name;
          document.getElementById("editCategory").value = product.category;
          document.getElementById("editPrice").value = product.price;
          document.getElementById("editStock").value = product.stock;
          document.getElementById("editImage").value = product.image;
          document.getElementById("editDescription").value = product.description;
          document.getElementById("editSellerEmail").value = product.sellerEmail;
          new bootstrap.Modal(editModalEl).show();
        }

        // DELETE
        if (e.target.classList.contains("delete-btn")) {
          if (confirm("Are you sure?")) {
            products.splice(idx, 1);
            localStorage.setItem("products", JSON.stringify(products));
            card.remove();
          }
        }
      });
    });

    // EDIT FORM SUBMIT
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let products = JSON.parse(localStorage.getItem("products")) || [];
      const id = parseInt(document.getElementById("editId").value, 10);
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return;

      products[idx] = {
        ...products[idx],
        name: document.getElementById("editName").value,
        category: document.getElementById("editCategory").value,
        price: parseFloat(document.getElementById("editPrice").value),
        stock: parseInt(document.getElementById("editStock").value, 10),
        image: document.getElementById("editImage").value,
        description: document.getElementById("editDescription").value,
        sellerEmail: document.getElementById("editSellerEmail").value,
      };

      localStorage.setItem("products", JSON.stringify(products));

      // Update both table and card views
      const row = [...document.querySelectorAll("tr")].find(
        (r) => parseInt(r.cells[0]?.textContent, 10) === id
      );
      if (row) {
        row.cells[2].textContent = products[idx].name;
        row.cells[3].textContent = products[idx].category;
        row.cells[4].textContent = `$${products[idx].price}`;
        row.cells[5].textContent = products[idx].stock;
        row.cells[1].querySelector("img").src = products[idx].image;
      }
      const card = [...document.querySelectorAll(".product-card")].find(
        (c) => parseInt(c.dataset.id, 10) === id
      );
      if (card) {
        card.querySelector("img").src = products[idx].image;
        card.querySelector("p:nth-child(2)").innerHTML = `<strong>ID:</strong> ${products[idx].id}`;
        card.querySelector("p:nth-child(3)").innerHTML = `<strong>Name:</strong> ${products[idx].name}`;
        card.querySelector("p:nth-child(4)").innerHTML = `<strong>Category:</strong> ${products[idx].category}`;
        card.querySelector("p:nth-child(5)").innerHTML = `<strong>Price:</strong> $${products[idx].price}`;
        card.querySelector("p:nth-child(6)").innerHTML = `<strong>Stock:</strong> ${products[idx].stock}`;
      }

      bootstrap.Modal.getInstance(editModalEl).hide();
    });
  }, 0);

  return html;
}
