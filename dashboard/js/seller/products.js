// seller/products.js
import { createProducts } from "../../createProducts.js"; // <-- factory we made earlier

// this function will be called from router
export function products() {
	// return HTML string for the products page
	const html = `
    <div id="products-content"></div>
  `;

	// Initialize Products after HTML is inserted into DOM
	setTimeout(() => {
		const Products = createProducts();
		window.Products = Products; // so onclick handlers still work
		Products.init();
	});

	return html;
}
