// Utility functions
function getFromStorage(key) {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error(`Error getting ${key} from storage:`, error);
		return null;
	}
}

function setToStorage(key, data) {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error(`Error setting ${key} to storage:`, error);
	}
}

// Load cart products and display them
function loadCartProducts() {
	const checkoutCart = getFromStorage("checkoutCart") || [];
	const productsList = document.getElementById("productsList");

	if (checkoutCart.length === 0) {
		document.getElementById("emptyCartAlert").classList.remove("d-none");
		document.getElementById("checkoutContent").classList.add("d-none");
		return;
	}

	let subtotal = 0;
	let productsHTML = "";

	checkoutCart.forEach((product) => {
		const productTotal = product.price * product.quantity;
		subtotal += productTotal;

		productsHTML += `
            <div class="d-flex align-items-center border rounded p-2 mb-2 product-item">
              <div class="me-3">
                <img
                  src="${product.image || "https://via.placeholder.com/50"}"
                  alt="${product.name}"
                  class="img-fluid rounded"
                  style="width: 50px; height: 50px; object-fit: cover;"
                  onerror="this.src='https://via.placeholder.com/50'"
                />
              </div>
              <div class="flex-grow-1">
                <p class="mb-0 fw-medium">${product.name}</p>
                <small class="text-muted">Qty: ${product.quantity} × $${product.price}</small>
              </div>
              <div class="text-end">
                <strong>$${productTotal}</strong>
              </div>
            </div>
          `;
	});

	productsList.innerHTML = productsHTML;

	// Calculate totals
	const tax = Math.round(subtotal * 0.14); // 14% tax
	const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
	const total = subtotal + tax + shipping;

	// Update totals in UI
	document.getElementById("subtotal").textContent = `$${subtotal}`;
	document.getElementById("tax").textContent = `$${tax}`;
	document.getElementById("shipping").textContent = shipping === 0 ? "Free" : `$${shipping}`;
	document.getElementById("total").textContent = `$${total}`;
}

// Load user address
function loadUserAddress() {
	const currentUser = getFromStorage("currentUser");
	const userAddressElement = document.getElementById("userAddress");

	if (!currentUser) {
		userAddressElement.innerHTML = '<span class="text-danger">Please log in to continue</span>';
		return;
	}

	const users = getFromStorage("users") || [];
	const user = users.find((u) => u.email === currentUser.email);
	// console.log(user.addresses[user.selectedAddressIndex]);

	const selectedAddress = user.addresses[user.selectedAddressIndex].fullAddress;
	if (user && user.addresses) {
		userAddressElement.textContent = selectedAddress;
	} else {
		userAddressElement.innerHTML = '<span class="text-warning">No address found. Please update your profile.</span>';
	}
}

// Credit card validation functions
function validateCardNumber(cardNumber) {
	const cleaned = cardNumber.replace(/\s/g, "");
	if (!/^\d{13,19}$/.test(cleaned)) return false;

	// Luhn algorithm
	let sum = 0;
	let isEven = false;
	for (let i = cleaned.length - 1; i >= 0; i--) {
		let digit = parseInt(cleaned[i]);
		if (isEven) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
		isEven = !isEven;
	}
	return sum % 10 === 0;
}

function validateExpiryDate(expDate) {
	if (!/^\d{2}\/\d{2}$/.test(expDate)) return false;

	const [month, year] = expDate.split("/").map((num) => parseInt(num));
	if (month < 1 || month > 12) return false;

	const now = new Date();
	const currentYear = now.getFullYear() % 100;
	const currentMonth = now.getMonth() + 1;

	if (year < currentYear || (year === currentYear && month < currentMonth)) {
		return false;
	}

	return true;
}

function validateCVV(cvv) {
	return /^\d{3,4}$/.test(cvv);
}

// Format card number input
function formatCardNumber(value) {
	const cleaned = value.replace(/\s/g, "");
	const formatted = cleaned.replace(/(.{4})/g, "$1 ");
	return formatted.trim();
}

// Format expiry date input
function formatExpiryDate(value) {
	const cleaned = value.replace(/\D/g, "");
	if (cleaned.length >= 2) {
		return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
	}
	return cleaned;
}

// Generate order ID
function generateOrderId() {
	return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generate receipt content
function generateReceipt(orderData) {
	const currentDate = new Date().toLocaleString();

	let receiptHTML = `
          <div class="receipt-header">
            <h4><strong>CYBER TECH STORE</strong></h4>
            <p>Thank you for your purchase!</p>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Date:</strong> ${currentDate}</p>
          </div>
          
          <div class="mb-3">
            <h6><strong>CUSTOMER INFORMATION:</strong></h6>
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Address:</strong> ${orderData.address}</p>
          </div>
          
          <div class="mb-3">
            <h6><strong>ITEMS ORDERED:</strong></h6>`;

	orderData.items.forEach((item) => {
		receiptHTML += `
            <div class="receipt-item">
              <span>${item.name} (x${item.quantity})</span>
              <span>$${item.price * item.quantity}</span>
            </div>`;
	});

	receiptHTML += `
          </div>
          
          <div class="receipt-total">
            <div class="receipt-item">
              <span>Subtotal:</span>
              <span>$${orderData.subtotal}</span>
            </div>
            <div class="receipt-item">
              <span>Tax:</span>
              <span>$${orderData.tax}</span>
            </div>
            <div class="receipt-item">
              <span>Shipping:</span>
              <span>${orderData.shipping === 0 ? "Free" : "$" + orderData.shipping}</span>
            </div>
            <div class="receipt-item" style="font-size: 1.2em; margin-top: 10px;">
              <span><strong>TOTAL:</strong></span>
              <span><strong>$${orderData.total}</strong></span>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <p><em>Thank you for shopping with Cyber Tech Store!</em></p>
            <p><small>This is your receipt. Please keep it for your records.</small></p>
          </div>
        `;

	return receiptHTML;
}

// Save order to localStorage
function saveOrder(orderData) {
	const orders = getFromStorage("orders") || [];
	orders.push(orderData);
	setToStorage("orders", orders);

	// Clear the checkout cart
	localStorage.removeItem("checkoutCart");
	// clear the current user cart
	const currentUser = getFromStorage("currentUser") || [];
	localStorage.removeItem(`cart_${currentUser.id}`);
}

// Download receipt as text file
function downloadReceipt(orderData) {
	const receiptText = `
CYBER TECH STORE
================
Order Receipt

Order ID: ${orderData.orderId}
Date: ${new Date().toLocaleString()}

Customer Information:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Address: ${orderData.address}

Items Ordered:
${orderData.items.map((item) => `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`).join("\n")}

Order Summary:
Subtotal: $${orderData.subtotal}
Tax: $${orderData.tax}
Shipping: ${orderData.shipping === 0 ? "Free" : "$" + orderData.shipping}
TOTAL: $${orderData.total}

Thank you for shopping with Cyber Tech Store!
        `;

	const blob = new Blob([receiptText], { type: "text/plain" });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `receipt_${orderData.orderId}.txt`;
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
	document.body.removeChild(a);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
	loadCartProducts();
	loadUserAddress();

	// Card number formatting
	document.getElementById("cardNumber").addEventListener("input", function (e) {
		e.target.value = formatCardNumber(e.target.value);
	});

	// Expiry date formatting
	document.getElementById("expDate").addEventListener("input", function (e) {
		e.target.value = formatExpiryDate(e.target.value);
	});

	// CVV numeric only
	document.getElementById("cvv").addEventListener("input", function (e) {
		e.target.value = e.target.value.replace(/\D/g, "");
	});

	// Form validation and submission
	document.getElementById("paymentForm").addEventListener("submit", function (e) {
		e.preventDefault();

		// Clear previous errors
		document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));

		// Get form values
		const cardholderName = document.getElementById("cardholderName").value.trim();
		const cardNumber = document.getElementById("cardNumber").value.trim();
		const expDate = document.getElementById("expDate").value.trim();
		const cvv = document.getElementById("cvv").value.trim();

		let isValid = true;

		// Validate cardholder name
		if (!cardholderName || cardholderName.length < 2) {
			document.getElementById("cardholderNameError").textContent = "Please enter a valid cardholder name";
			isValid = false;
		}

		// Validate card number
		if (!validateCardNumber(cardNumber)) {
			document.getElementById("cardNumberError").textContent = "Please enter a valid credit card number";
			isValid = false;
		}

		// Validate expiry date
		if (!validateExpiryDate(expDate)) {
			document.getElementById("expDateError").textContent = "Please enter a valid expiry date (MM/YY)";
			isValid = false;
		}

		// Validate CVV
		if (!validateCVV(cvv)) {
			document.getElementById("cvvError").textContent = "Please enter a valid CVV (3-4 digits)";
			isValid = false;
		}

		if (!isValid) return;

		// Show loading state
		const payBtn = document.getElementById("payBtn");
		payBtn.classList.add("loading");
		payBtn.disabled = true;

		// Simulate payment processing
		setTimeout(async () => {
			// Get order data
			const checkoutCart = getFromStorage("checkoutCart") || [];
			const currentUser = getFromStorage("currentUser");
			const users = getFromStorage("users") || [];
			const user = users.find((u) => u.email === currentUser.email);

			const subtotal = checkoutCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const tax = Math.round(subtotal * 0.14);
			const shipping = subtotal > 100 ? 0 : 10;
			const total = subtotal + tax + shipping;

			const orderData = {
				orderId: generateOrderId(),
				customerName: cardholderName,
				customerEmail: currentUser.email,
				address: user ? user.addresses[user.selectedAddressIndex].fullAddress : "No address provided",
				items: checkoutCart,
				subtotal: subtotal,
				tax: tax,
				shipping: shipping,
				total: total,
				paymentMethod: "Credit Card",
				cardLastFour: cardNumber.slice(-4),
				orderDate: new Date().toISOString(),
				status: "Processing",
			};

			// Save order
			saveOrder(orderData);

			// Generate and show receipt
			document.getElementById("receiptContent").innerHTML = generateReceipt(orderData);

			// Set up download functionality
			document.getElementById("downloadReceipt").onclick = () => downloadReceipt(orderData);

			// Hide loading state
			payBtn.classList.remove("loading");
			payBtn.disabled = false;

			// Update cart badge in the header
			try {
				const { cartBadgeManager } = await import("./cartBadge.js");
				cartBadgeManager.addItemToCart();
			} catch (error) {
				console.log("Cart badge manager not available");
			}
            // show empty cart message before exite the modle
			loadCartProducts();
			// Show receipt modal
			const receiptModal = new bootstrap.Modal(document.getElementById("receiptModal"));
			receiptModal.show();
		}, 2000); // 2 second delay to simulate processing
	});
});
