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

function updateUserAddressInStorage(addressObj) {
  let currentUser = getCurrentUser();
  let users = getUsers();

  let index = users.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    users[index].address = addressObj;
    saveUsers(users);

    currentUser.address = addressObj;
    saveCurrentUser(currentUser);
  }
}

// --- Render address card ---
function renderAddressCard(addressObj, checked = false) {
  const addressList = document.getElementById("addressList");

  const newAddress = document.createElement("div");
  newAddress.classList.add("col-12");
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

  renderAddressCard(addressObj, true);

  updateUserAddressInStorage(addressObj);

  document.getElementById("newAddressForm").reset();
  bootstrap.Modal.getInstance(document.getElementById("addAddressModal")).hide();
});

// --- Remove Address ---
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-address")) {
    const card = e.target.closest(".col-12");
    const radio = card.querySelector("input[type=radio]");
    card.remove();

    if (radio.checked) {
      let currentUser = getCurrentUser();
      let users = getUsers();

      let index = users.findIndex(u => u.email === currentUser.email);
      if (index !== -1) {
        delete users[index].address;
        saveUsers(users);
      }
      delete currentUser.address;
      saveCurrentUser(currentUser);
    }
  }
});

// --- Edit Address - open modal ---
document.addEventListener("click", function(e) {
  if (e.target.closest(".edit-address")) {
    const card = e.target.closest(".card");
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
    editTargetCard.querySelector(".address-title").innerText = document.getElementById("editTitle").value;
    editTargetCard.querySelector(".address-full").innerText = document.getElementById("editFullAddress").value;
    editTargetCard.querySelector(".address-phone").innerText = document.getElementById("editPhone").value;
    editTargetCard.querySelector(".address-label").innerText = document.getElementById("editLabelType").value;

    const radio = editTargetCard.closest(".col-12").querySelector("input[type=radio]");
    if (radio.checked) {
      updateSelectedAddress(radio);
    }
  }

  bootstrap.Modal.getInstance(document.getElementById("editAddressModal")).hide();
});

// --- Handle selecting address ---
document.addEventListener("change", function(e) {
  if (e.target.matches('input[name="address"]')) {
    updateSelectedAddress(e.target);
  }
});

// --- Save selected address into storage ---
function updateSelectedAddress(radioInput) {
  const card = radioInput.closest(".card");
  let selectedAddress = {
    title: card.querySelector(".address-title").innerText,
    fullAddress: card.querySelector(".address-full").innerText,
    phone: card.querySelector(".address-phone").innerText,
    label: card.querySelector(".address-label").innerText
  };

  updateUserAddressInStorage(selectedAddress);
}

// --- On page load, render saved address ---
window.addEventListener("DOMContentLoaded", () => {
  let currentUser = getCurrentUser();
  if (currentUser && currentUser.address) {
    renderAddressCard(currentUser.address, true);
  }
});
function ToPayment(){
    window.location.href = "payment.html";
}
function ToCart(){
    window.location.href = "customer/cart.html";
}