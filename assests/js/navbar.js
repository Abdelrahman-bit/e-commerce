// // assests/js/navbar.js
// document.addEventListener('DOMContentLoaded', () => {
//     const placeholder = document.getElementById('authPlaceholder');
//     if (!placeholder) return;

//     function getCurrentUserSafe() {
//     try {
//         return authManager.getCurrentUser();
//     } catch {
//         return null;
//     }
//     }

//     function renderAuthArea() {
//     const nav = placeholder.parentElement;
//     nav.querySelectorAll('[data-dynamic="auth"]').forEach(el => el.remove());

//     const user = getCurrentUserSafe();
//     if (user) {
//       // Dropdown user
//         const li = document.createElement('li');
//         li.className = 'nav-item dropdown';
//         li.setAttribute('data-dynamic', 'auth');
//         const displayName = user.name ? `<span class="d-none d-md-inline ms-2">${escapeHtml(user.name)}</span>` : '';
//         li.innerHTML = `
//         <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                 <i class="far fa-user"></i>
//                 ${displayName}
//         </a>
//         <ul class="dropdown-menu dropdown-menu-end user-dropdown" aria-labelledby="userDropdown">
//             <li><a class="dropdown-item" href="#">Profile</a></li>
//             <li><hr class="dropdown-divider"></li>
//             <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
//         </ul>
//         `;
//         placeholder.insertAdjacentElement('afterend', li);

//     const logoutBtn = li.querySelector('#logoutBtn');
//     logoutBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (!confirm('are you sure to logout?')) return;
//         try {
//             authManager.logout({ redirect: false });
//         } catch {
//             authManager.logout();
//         }
//         renderAuthArea();
//     });
//     } else {
//       // Login / Signup buttons
//     const liLogin = document.createElement('li');
//         liLogin.className = 'nav-item';
//         liLogin.setAttribute('data-dynamic', 'auth');
//         liLogin.innerHTML = `<a class="nav-link btn btn-light " href="login.html">Login</a>`;

//     const liSignup = document.createElement('li');
//         liSignup.className = 'nav-item';
//         liSignup.setAttribute('data-dynamic', 'auth');
//         liSignup.innerHTML = `<a class="nav-link btn btn-dark  ms-2" href="register.html">Sign Up</a>`;

//         placeholder.insertAdjacentElement('afterend', liSignup);
//         placeholder.insertAdjacentElement('afterend', liLogin);
//     }
// }

// function escapeHtml(s = '') {
//     return String(s)
//         .replace(/&/g, '&amp;')
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')
//         .replace(/"/g, '&quot;')
//         .replace(/'/g, '&#39;');
// }

//     renderAuthArea();

// window.addEventListener('storage', (e) => {
//     if (e.key === 'currentUser') renderAuthArea();
// });
// });
