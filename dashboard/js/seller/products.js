// seller/products.js
import { createProducts } from "../../createProducts.js"; // <-- factory we made earlier

// this function will be called from router
export function products() {
	// return HTML string for the products page
	const html = `
	<div class="quick-actions mb-4 d-flex">
      <a href="#dashboard"><i class="fas fa-tachometer-alt"></i></a>
      <a href="#products"><i class="fa-solid fa-box-open"></i></a>
      <a href="#sellerOrders"><i class="fas fa-box"></i></a>
    </div>
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
