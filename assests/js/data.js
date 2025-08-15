export const users = [
	{
		id: 1,
		name: "admin",
		role: "admin",
		email: "admin@example.com",
		password: "admin123",
	},
	{
		id: 2,
		name: "hamada",
		role: "seller",
		email: "hamada@example.com",
		password: "hamada123",
	},
];

export const products = [
	{
		id: 1,
		sellerEmail: "hamada@example.com",
		name: "laptop",
		price: 100,
		description: "Description for laptop",
		category: "smart devices",
		image: "url",
		stock: 50,
	},
	{
		id: 2,
		sellerEmail: "hamada@example.com",
		name: "smartphone",
		price: 200,
		description: "Description for smartphone",
		category: "smart devices",
		image: "url",
		stock: 30,
	},
	{
		id: 3,
		sellerEmail: "hamada@example.com",
		name: "tablet",
		price: 300,
		description: "Description for tablet",
		category: "smart devices",
		image: "url",
		stock: 20,
	},
	{
		id: 4,
		sellerEmail: "hamada@example.com",
		name: "smartwatch",
		price: 150,
		description: "Description for smartwatch",
		category: "smart devices",
		image: "url",
		stock: 25,
	},
	{
		id: 5,
		sellerEmail: "hamada@example.com",
		name: "wireless earbuds",
		price: 100,
		description: "Description for wireless earbuds",
		category: "smart devices",
		image: "url",
		stock: 40,
	},
];

export const orders = {
	id: 1,
	customerEmail: "customer@example.com",
	products: [
		{ productId: 101, quantity: 2 },
		{ productId: 102, quantity: 1 },
	],
	total: 2500,
};

export const currentUser = {
    id: 2,
    name: "hamada",
    role: "seller",
    email: "hamada@example.com",
    password: "hamada123",
}