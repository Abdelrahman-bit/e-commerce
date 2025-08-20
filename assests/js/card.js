export function createProductCard({img, name, price, btnAction}) {
	const card = document.createElement("div");
	card.className = "col-6 col-sm-6 col-lg-3";

	card.innerHTML = `
        <div class="card text-center shadow-sm h-100 border-0 position-relative">
        <span class="position-absolute top-0 end-0 p-2 favorite">♡</span>
        <img draggable="false" src="${img}" class="card-img-top p-4" alt="${name}">
        <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="fs-5 fw-bold mb-3">$${price}</p>
            <button class="btn btn-dark w-100">Buy Now</button>
        </div>
        </div>
    `;

    // toggle between favorit red heart 
	const fav = card.querySelector(".favorite");
	fav.addEventListener("click", function () {
		fav.classList.toggle("active");
		fav.textContent = fav.classList.contains("active") ? "♥" : "♡";
	});

	//action function is responsible for adding the product to the cart
	if (btnAction) {
		const button = col.querySelector("button");
		button.addEventListener("click", () => btnAction({ title, text, img }));
	}

	return card;
}
