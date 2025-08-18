export function loadComponent(id, file) {
	fetch(file)
		.then((res) => res.text())
		.then((html) => (document.getElementById(id).innerHTML = html));
}

export function createCard({ title, text, img, btnText, btnAction }) {
	const col = document.createElement("div");
	col.className = "col-md-4";

	col.innerHTML = `
    <div class="card h-100 shadow-sm">
      ${img ? `<img src="${img}" class="card-img-top" alt="${title}">` : ""}
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${text}</p>
        ${btnText ? `<button class="btn btn-dark mt-auto">${btnText}</button>` : ""}
      </div>
    </div>
  `;

	// If a button exists, attach action
	if (btnText && btnAction) {
		const button = col.querySelector("button");
		button.addEventListener("click", () => btnAction({ title, text, img }));
	}

	return col;
}