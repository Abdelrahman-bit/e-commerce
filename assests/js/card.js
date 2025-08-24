export function createProductCard({ id, image, name, price, description, category, stock, sellerEmail, btnAction }) {
	const card = document.createElement("div");
	card.className = "col-6 col-sm-6 col-lg-3 product-cards mb-4";
	card.dataset.id = id; // بيحفظ ال اي دي عشان نستخدمه بعدين

	card.innerHTML = `
        <div class="card text-center shadow-sm h-100 border-0 position-relative">
            <span class="position-absolute top-0 end-0 p-2 favorite">♡</span>
            <img draggable="false" src="${image}" class="card-img-top p-4" alt="${name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${name}</h5>
                <p class="fs-5 fw-bold mb-3">$${price}</p>
                <div class="mt-auto">
                    <button class="btn btn-dark w-100 mb-2">View Details</button>
                    <button class="btn btn-outline-dark w-100 add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

	// toggle favorite red heart
	const fav = card.querySelector(".favorite");
	fav.addEventListener("click", function () {
		fav.classList.toggle("active");
		fav.textContent = fav.classList.contains("active") ? "♥" : "♡";
	});

	// If btnAction is provided → attach it to the view details button
	if (btnAction) {
		const viewButton = card.querySelector(".btn-dark");
		viewButton.addEventListener("click", () => btnAction({ id, image, name, price, description, category, sellerEmail, stock }));
	}

		// Add to cart functionality
	const addToCartBtn = card.querySelector(".add-to-cart-btn");
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

		// Add product to cart
		const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
		const productData = { id, image, name, price, description, category,sellerEmail, stock };
		
		// Check if product already exists in cart
		const existingItem = cart.find(item => item.id === id);
		
		if (existingItem) {
			// Update quantity if product exists
			existingItem.quantity += 1;
			if (existingItem.quantity > existingItem.stock) {
				existingItem.quantity = existingItem.stock;
			}
		} else {
			// Add new product to cart
			cart.push({
				...productData,
				quantity: 1
			});
		}
		
		// Save updated cart
		localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
		
		// Update cart badge
		try {
			const { cartBadgeManager } = await import('./cartBadge.js');
			cartBadgeManager.addItemToCart();
		} catch (error) {
			console.log('Cart badge manager not available');
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

	return card;
}
