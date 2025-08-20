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
