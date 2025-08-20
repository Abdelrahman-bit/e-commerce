const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const container = document.querySelector(".login-container");
const toggleLink = document.getElementById("toggle-link");
const alertBox = document.getElementById("form-alert");

let isLogin = true;
const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])\S{8,16}$/;

function showAlert(message, type = "danger") {
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  setTimeout(() => {
    const alert = alertBox.querySelector(".alert");
    if (alert) {
      alert.classList.remove("show");
      alert.classList.add("fade");
      setTimeout(() => alert.remove(), 300);
    }
  }, 3000);
}


document.querySelectorAll('input[type="email"]').forEach(input => {
  input.addEventListener("input", function () {
    if (!emailRegex.test(this.value)) {
      this.setCustomValidity("Please enter a valid email (example@domain.com).");
    } else {
      this.setCustomValidity("");
    }
  });
});

document.querySelectorAll('input[type="password"]').forEach(input => {
  input.addEventListener("input", function () {
    if (!passwordRegex.test(this.value)) {
      this.setCustomValidity("Password must be 8-16 chars with uppercase, lowercase, number, and special char.");
    } else {
      this.setCustomValidity("");
    }
  });
});


function validateForm(form) {
  form.classList.add("was-validated");

  if (form.id === "register-form") {
    const pass = form.querySelector('input[placeholder="Password"]');
    const confirmPass = form.querySelector('input[placeholder="Confirm Password"]');
    if (pass.value !== confirmPass.value) {
      confirmPass.setCustomValidity("Passwords do not match");
    } else {
      confirmPass.setCustomValidity("");
    }
  }

  return form.checkValidity();
}

function resetForm(form) {
  form.reset();
  form.classList.remove("was-validated");
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm(loginForm)) {
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    try {
      authManager.login(email, password);
      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => authManager.redirectToRolePage(), 1500);
    } catch (err) {
      const passwordInput = document.getElementById("login-password");
      passwordInput.setCustomValidity("Incorrect email or password");
      passwordInput.reportValidity();
      showAlert(err.message);
    }
  }
});

// Reset error لما يكتب المستخدم تاني
document.getElementById("login-password").addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});


registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm(registerForm)) {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const phone = document.getElementById("reg-phone").value.trim();
    const role = document.getElementById("reg-role").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (password !== confirm) {
      showAlert("Passwords do not match ❌", "danger");
      return;
    }

    try {
      authManager.register({ name, email, phone, role, password });
      showAlert("Account created successfully! You can now login.", "success");
      setTimeout(() => {
        resetForm(registerForm);
        // نرجع على وضع الـ Login لو احنا في وضع Register
        if (!isLogin) switchForms(new Event("click"));
      }, 1500);
    } catch (err) {
      showAlert(err.message);
    }
  }
});


function switchForms(e) {
  e.preventDefault();
  container.classList.toggle("toggle");

  if (isLogin) {
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Please register to get started";
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
    toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
  } else {
    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Please login to your account";
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
    toggleText.innerHTML = 'Don’t have an account? <a href="#" id="toggle-link">Signup</a>';
  }
  isLogin = !isLogin;
  document.getElementById("toggle-link").addEventListener("click", switchForms);
}

toggleLink.addEventListener("click", switchForms);
