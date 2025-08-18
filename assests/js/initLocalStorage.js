import { addProduct, getProducts, addUser, getUsers } from "./storage.js";
import { users, products } from "./data.js";

// add all the dummy users in local storage

// checking if users existe in local storage
if (getUsers().length === 0) {
	users.forEach((user) => {
		addUser(user);
	});
}

// add all the dummy products to localstorage
if (getProducts().length === 0) {
	products.forEach((product) => {
		addProduct(product);
	});
}
