export async function loadComponent(id, file) {
	try {
		const res = await fetch(file);
		const html = await res.text();

		const container = document.getElementById(id);
		if (!container) return;

		container.innerHTML = html;

		// ✅ شغل أي <script> جوه الـ component
		const scripts = container.querySelectorAll("script");
		scripts.forEach((oldScript) => {
			const newScript = document.createElement("script");

			if (oldScript.src) {
				newScript.src = oldScript.src;
			} else {
				newScript.textContent = oldScript.textContent;
			}

			if (oldScript.type) {
				newScript.type = oldScript.type;
			}

			document.body.appendChild(newScript);
			oldScript.remove();
		});
	} catch (err) {
		console.error(`Error loading component ${id} from ${file}:`, err);
	}
}

export async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return hashHex;
}

