// Get data from Local Storage (returns array or default)
function getData(key) {
	return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data to Local Storage
function saveData(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

// ===== USERS =====
function getUsers() {
	return getData("users");
}

function addUser(user) {
	const users = getUsers();
	users.push(user);
	saveData("users", users);
}

function updateUser(updatedUser) {
	const users = getUsers().map((user) => (user.id === updatedUser.id ? updatedUser : user));
	saveData("users", users);
}

function deleteUser(userId) {
	const users = getUsers().filter((user) => user.id !== userId);
	saveData("users", users);
}

// ===== CURRENT USER (SESSION) =====
function setCurrentUser(user) {
	localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
	return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function logoutUser() {
	localStorage.removeItem("currentUser");
}

// ===== PRODUCTS =====
function getProducts() {
	return getData("products");
}

function addProduct(product) {
	const products = getProducts();
	products.push(product);
	saveData("products", products);
}

function updateProduct(updatedProduct) {
	const products = getProducts().map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
	saveData("products", products);
}

function deleteProduct(productId) {
	const products = getProducts().filter((p) => p.id !== productId);
	saveData("products", products);
}

// ===== CART =====
function getCart(userId) {
	return getData(`cart_${userId}`);
}

function saveCart(userId, cart) {
	saveData(`cart_${userId}`, cart);
}

function addToCart(userId, product) {
	const cart = getCart(userId);
	cart.push(product);
	saveCart(userId, cart);
}

function removeFromCart(userId, productId) {
	const cart = getCart(userId).filter((p) => p.id !== productId);
	saveCart(userId, cart);
}

// ===== ORDERS =====
function getOrders() {
	return getData("orders");
}

function addOrder(order) {
	const orders = getOrders();
	orders.push(order);
	saveData("orders", orders);
}

function updateOrder(updatedOrder) {
	const orders = getOrders().map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
	saveData("orders", orders);
}

function deleteOrder(orderId) {
	const orders = getOrders().filter((o) => o.id !== orderId);
	saveData("orders", orders);
}

export {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    getCurrentUser,
    logoutUser,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder
};