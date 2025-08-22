import { addProduct, getProducts, addUser, getUsers, saveCart } from "./storage.js";
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

// Add sample cart data for testing (for user with id 3 - ali)
const sampleCart = [
	{
		id: 1,
		sellerEmail: "hamada@example.com",
		name: "Microsoft Surface Laptop",
		price: 100,
		description: "Description for laptop",
		category: "smart devices",
		image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681675/laptop_ksseyu.jpg",
		fav: false,
		stock: 50,
		quantity: 2,
	},
	{
		id: 2,
		sellerEmail: "hamada@example.com",
		name: "Apple iPhone 14 Pro",
		price: 200,
		description: "Description for smartphone",
		category: "phones",
		image: "https://res.cloudinary.com/dzcjymfa3/image/upload/v1755681676/iphone_tsbejx.jpg",
		fav: false,
		stock: 30,
		quantity: 1,
	}
];

// Add sample cart for testing (only if cart doesn't exist)
if (!localStorage.getItem('cart_3')) {
	saveCart(3, sampleCart);
}

