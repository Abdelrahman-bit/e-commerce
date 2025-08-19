import { createProductCard } from "./card.js";

export const products = [
	{
		name: "AirPods Max Silver",
		price: 549,
		img: "../assests/images/product.png",
	},
	{
		name: "AirPods Max Space Gray",
		price: 549,
		img: "../assests/images/product.png",
	},
	{
		name: "iPhone 15 Pro Max",
		price: 1199,
		img: "../assests/images/product.png",
	},
	{ name: "MacBook Pro M3", price: 1999, img: "../assests/images/product.png" },
	{
		name: "AirPods Max Silver",
		price: 549,
		img: "../assests/images/product.png",
	},
	{
		name: "AirPods Max Space Gray",
		price: 549,
		img: "../assests/images/product.png",
	},
	{
		name: "iPhone 15 Pro Max",
		price: 1199,
		img: "../assests/images/product.png",
	},
	{ name: "MacBook Pro M3", price: 1999, img: "../assests/images/product.png" },
];

const container = document.getElementById("product-list");
container.innerHTML = "";

products.forEach((product) => {
	const card = createProductCard(product);
	container.appendChild(card);
});
