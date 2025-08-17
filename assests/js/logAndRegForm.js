const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const container = document.querySelector(".login-container");
const toggleLink = document.getElementById("toggle-link");
const alertBox = document.getElementById("form-alert");

let isLogin = true;

function showAlert(message, type = "success") {
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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


function validateForm(form) {
  form.classList.add("was-validated");
  //دي بتاعت فانكشكن البوتستراب عشان بس ميعملش علامتين صح لما ادخل اي باسوردين مش شبه بعض ودي مشكلة
  if (form.id === "register-form") {
    const pass = form.querySelector('input[placeholder="Password"]');
    const confirmPass = form.querySelector(
      'input[placeholder="Confirm Password"]'
    );

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
    showAlert("Login successful ✅", "success"); 
  }
});


registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm(registerForm)) {
    const pass = registerForm.querySelector(
      'input[placeholder="Password"]'
    ).value;
    const confirmPass = registerForm.querySelector(
      'input[placeholder="Confirm Password"]'
    ).value;

    if (pass !== confirmPass) {
      showAlert("Passwords do not match ❌", "danger");
      return;
    }

    showAlert("Registration successful ✅", "success");
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
    toggleText.innerHTML =
      'Already have an account? <a href="#" id="toggle-link">Login</a>';
    resetForm(loginForm);
  } else {
    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Please login to your account";
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
    toggleText.innerHTML =
      'Don’t have an account? <a href="#" id="toggle-link">Signup</a>';
    resetForm(registerForm);
  }
  isLogin = !isLogin;
  document.getElementById("toggle-link").addEventListener("click", switchForms);
}

toggleLink.addEventListener("click", switchForms);
