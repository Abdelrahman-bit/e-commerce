let counter = 1;
let editTargetCard = null;

// --- Helpers ---
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || {};
}

function saveCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function findCurrentUserIndex(users, currentUser) {
  return users.findIndex(u => u.email === currentUser.email);
}

// --- Render address card ---
function renderAddressCard(addressObj, index, checked = false) {
  const addressList = document.getElementById("addressList");

  const newAddress = document.createElement("div");
  newAddress.classList.add("col-12");
  newAddress.dataset.index = index;
  newAddress.innerHTML = `
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-start">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="address" id="addr${counter}" ${checked ? "checked" : ""}>
          <label class="form-check-label" for="addr${counter}">
            <span class="fw-bold address-title">${addressObj.title}</span>
            <span class="badge bg-dark ms-2 address-label">${addressObj.label}</span>
            <div class="text-muted small address-full">${addressObj.fullAddress}</div>
            <div class="text-muted small address-phone">${addressObj.phone}</div>
          </label>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-dark edit-address"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger remove-address">&times;</button>
        </div>
      </div>
    </div>
  `;
  addressList.appendChild(newAddress);

  counter++;
}

// --- Add New Address ---
document.getElementById("newAddressForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("addressTitle").value;
  const address = document.getElementById("fullAddress").value;
  const phone = document.getElementById("phoneNumber").value;
  const label = document.getElementById("labelType").value;

  const addressObj = { title, fullAddress: address, phone, label };

  let currentUser = getCurrentUser();
  let users = getUsers();
  let idx = findCurrentUserIndex(users, currentUser);

  if (idx !== -1) {
    if (!users[idx].addresses) users[idx].addresses = [];
    users[idx].addresses.push(addressObj);
    users[idx].selectedAddressIndex = users[idx].addresses.length - 1; // mark as selected
    saveUsers(users);

    currentUser = { ...users[idx] };
    saveCurrentUser(currentUser);

    renderAddressCard(addressObj, users[idx].addresses.length - 1, true);
  }

  document.getElementById("newAddressForm").reset();
  bootstrap.Modal.getInstance(document.getElementById("addAddressModal")).hide();
});

// --- Remove Address ---
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-address")) {
    const card = e.target.closest(".col-12");
    const index = parseInt(card.dataset.index);

    let currentUser = getCurrentUser();
    let users = getUsers();
    let idx = findCurrentUserIndex(users, currentUser);

    if (idx !== -1) {
      users[idx].addresses.splice(index, 1);

      // Adjust selected index if needed
      if (users[idx].selectedAddressIndex === index) {
        users[idx].selectedAddressIndex = null;
      } else if (users[idx].selectedAddressIndex > index) {
        users[idx].selectedAddressIndex--;
      }

      saveUsers(users);
      saveCurrentUser(users[idx]);
    }

    card.remove();
  }
});

// --- Edit Address - open modal ---
document.addEventListener("click", function(e) {
  if (e.target.closest(".edit-address")) {
    const card = e.target.closest(".col-12");
    editTargetCard = card;

    document.getElementById("editTitle").value = card.querySelector(".address-title").innerText;
    document.getElementById("editFullAddress").value = card.querySelector(".address-full").innerText;
    document.getElementById("editPhone").value = card.querySelector(".address-phone").innerText;
    document.getElementById("editLabelType").value = card.querySelector(".address-label").innerText;

    new bootstrap.Modal(document.getElementById("editAddressModal")).show();
  }
});

// --- Save Edited Address ---
document.getElementById("editAddressForm").addEventListener("submit", function(e) {
  e.preventDefault();

  if (editTargetCard) {
    const index = parseInt(editTargetCard.dataset.index);

    const updatedAddress = {
      title: document.getElementById("editTitle").value,
      fullAddress: document.getElementById("editFullAddress").value,
      phone: document.getElementById("editPhone").value,
      label: document.getElementById("editLabelType").value
    };

    editTargetCard.querySelector(".address-title").innerText = updatedAddress.title;
    editTargetCard.querySelector(".address-full").innerText = updatedAddress.fullAddress;
    editTargetCard.querySelector(".address-phone").innerText = updatedAddress.phone;
    editTargetCard.querySelector(".address-label").innerText = updatedAddress.label;

    let currentUser = getCurrentUser();
    let users = getUsers();
    let idx = findCurrentUserIndex(users, currentUser);

    if (idx !== -1) {
      users[idx].addresses[index] = updatedAddress;
      saveUsers(users);
      saveCurrentUser(users[idx]);
    }
  }

  bootstrap.Modal.getInstance(document.getElementById("editAddressModal")).hide();
});

// --- Handle selecting address ---
document.addEventListener("change", function(e) {
  if (e.target.matches('input[name="address"]')) {
    const card = e.target.closest(".col-12");
    const index = parseInt(card.dataset.index);

    let currentUser = getCurrentUser();
    let users = getUsers();
    let idx = findCurrentUserIndex(users, currentUser);

    if (idx !== -1) {
      users[idx].selectedAddressIndex = index;
      saveUsers(users);
      saveCurrentUser(users[idx]);
    }
  }
});

// --- On page load, render saved addresses ---
window.addEventListener("DOMContentLoaded", () => {
  let currentUser = getCurrentUser();
  let users = getUsers();
  let idx = findCurrentUserIndex(users, currentUser);

  if (idx !== -1 && users[idx].addresses) {
    users[idx].addresses.forEach((addr, i) => {
      let checked = users[idx].selectedAddressIndex === i;
      renderAddressCard(addr, i, checked);
    });
  }
});

function showAlert(message, type = "danger", duration = 3000) {
  const alertPlaceholder = document.getElementById("alertPlaceholder");
  alertPlaceholder.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  const alertElement = wrapper.firstElementChild;
  alertPlaceholder.append(alertElement);
  setTimeout(() => {
    alertElement.classList.remove("show"); 
    alertElement.classList.add("fade");   
    setTimeout(() => alertElement.remove(), 200);
  }, duration);
}

function ToPayment() {
  let currentUser = getCurrentUser();
  let users = getUsers();
  let idx = findCurrentUserIndex(users, currentUser);

  if (idx === -1 || !users[idx].addresses || users[idx].addresses.length === 0) {
    showAlert("⚠️ Please add at least one address before proceeding to payment.");
    return;
  }

  window.location.href = "payment.html";
}


function ToCart(){
    window.location.href = "customer/cart.html";
}



