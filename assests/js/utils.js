export function loadComponent(id, file) {
	fetch(file)
		.then((res) => res.text())
		.then((html) => (document.getElementById(id).innerHTML = html));
}
