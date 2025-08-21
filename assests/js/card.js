export function createProductCard({ id, image, name, price, description, btnAction }) {
	const card = document.createElement("div");
	card.className = "col-6 col-sm-6 col-lg-3 product-cards mb-4";
	card.dataset.id = id; // بيحفظ ال اي دي عشان نستخدمه بعدين

	card.innerHTML = `
        <div class="card text-center shadow-sm h-100 border-0 position-relative">
            <span class="position-absolute top-0 end-0 p-2 favorite">♡</span>
            <img draggable="false" src="${image}" class="card-img-top p-4" alt="${name}">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="fs-5 fw-bold mb-3">$${price}</p>
                <button class="btn btn-dark w-100">Buy Now</button>
            </div>
        </div>
    `;

	// toggle favorite red heart
	const fav = card.querySelector(".favorite");
	fav.addEventListener("click", function () {
		fav.classList.toggle("active");
		fav.textContent = fav.classList.contains("active") ? "♥" : "♡";
	});

	// If btnAction is provided → attach it to the button
	if (btnAction) {
		const button = card.querySelector("button");
		button.addEventListener("click", () => btnAction({ id, image, name, price , description}));
	}

	return card;
}
