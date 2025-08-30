// Always disable browser scroll restoration (extra safety if you navigate)
try { history.scrollRestoration = "manual"; } catch (_) {}

let currentProduct = JSON.parse(localStorage.getItem("selectedProduct")) || null;

function scrollToTopRobust() {
  const header = document.querySelector("#header");
  if (header && header.scrollIntoView) {
    header.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  // Ensure we end at the top after any image/layout shifts
  setTimeout(() => window.scrollTo(0, 0), 350);
  requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
}

function renderProduct(product) {
  if (!product) return;

  // Keep local copy and persist for other pages
  currentProduct = product;
  localStorage.setItem("selectedProduct", JSON.stringify(product));

  const imgContainer = document.querySelector(".img-OfProduct");
  const productName = document.querySelector(".product-OfName");
  const priceContainer = document.querySelector(".price-OfProduct");
  const descriptionProduct = document.querySelector(".desk-OfProduct");
  const priceDiscounted = document.querySelector(".priceDiscounted");

  if (productName) productName.textContent = product.name || "Product";
  if (imgContainer) {
    imgContainer.src = product.image || "";
    imgContainer.alt = product.name || "Product";
  }
  if (priceContainer)
    priceContainer.textContent = `$${Number((product.price || 0) * 1.5).toFixed(2)}`;
  if (descriptionProduct)
    descriptionProduct.textContent = product.description || "No description available.";
  if (priceDiscounted)
    priceDiscounted.textContent = `$${Number(product.price || 0).toFixed(2)}`;

  // Load & render similar products
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const container = document.getElementById("similarProductsContainer");
  if (!container) return;

  if (similar.length > 0) {
    container.innerHTML = similar
      .map(
        (p) => `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${p.image || ""}" class="card-img-top" alt="${p.name || "Product"}">
            <div class="card-body d-flex flex-column text-center">
              <h6 class="card-title fw-bold text-truncate" title="${p.name || ""}">
                ${p.name || "Product"}
              </h6>
              <p class="card-text text-muted mb-2">$${Number(p.price || 0).toFixed(2)}</p>
              <button class="btn btn-outline-dark mt-auto viewProductBtn" data-id="${p.id}">
                View Details
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Bind click handlers to render the selected product WITHOUT reloading
    container.querySelectorAll(".viewProductBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const selected = products.find((p) => String(p.id) === String(id));
        if (selected) {
          renderProduct(selected);
          scrollToTopRobust();
        }
      });
    });
  } else {
    container.innerHTML = '<p class="text-muted">No similar products found.</p>';
  }
}

// Initial render on first load
window.addEventListener("DOMContentLoaded", () => {
  renderProduct(currentProduct);
});

// ADD TO CART
const addToCartBtn = document.querySelector(".add-to-cart-btn");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      // Show login alert
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div id="login-alert" class="alert alert-warning text-center" 
				  style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;">
					<i class="fas fa-exclamation-triangle me-2"></i>يجب عليك أولاً تسجيل الدخول إلى حسابك
				</div>`
      );

      setTimeout(() => {
        document.getElementById("login-alert")?.remove();
      }, 3000);
      return;
    }

    if (!currentProduct) return;

    // Add product to cart
    const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];

    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.id === currentProduct.id);

    if (existingItem) {
      // Update quantity if product exists
      existingItem.quantity += 1;
      if (existingItem.quantity > existingItem.stock) {
        existingItem.quantity = existingItem.stock;
      }
    } else {
      // Add new product to cart
      cart.push({
        ...currentProduct,
        quantity: 1,
      });
    }

    // Save updated cart
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));

    // Update cart badge
    try {
      const { cartBadgeManager } = await import("./assests/js/cartBadge.js");
      cartBadgeManager.addItemToCart();
    } catch (error) {
      console.log("Cart badge manager not available");
    }

    // Show success message
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div id="success-alert" class="alert alert-success text-center" 
			  style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;">
				<i class="fas fa-check-circle me-2"></i>Product added to cart successfully!
			</div>`
    );

    setTimeout(() => {
      document.getElementById("success-alert")?.remove();
    }, 2000);
  });
}
