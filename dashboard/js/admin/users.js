import {hashPassword} from '../../../assests/js/utils.js'
export function Users() {
  const allusers = JSON.parse(localStorage.getItem("users")) || [];
  const filteredUsers = allusers.filter(u => u.role !== "admin");

  if (filteredUsers.length === 0) {
    return `
      <div class="text-center p-5">
        <h5 class="text-muted">🚫 No users available</h5>
        <p class="text-secondary small">There are currently no users to manage.</p>
      </div>
    `;
  }

  const html = `
  <style>
    .delete-icon:hover {
      filter: invert(26%) sepia(95%) saturate(7471%) hue-rotate(358deg) brightness(97%) contrast(80%);
      cursor: pointer;
    }
    .edit-icon:hover {
      filter: invert(13%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(30%) contrast(100%);
      cursor: pointer;
    }

    @media (max-width: 768px) {
      table {
        font-size: 14px;
      }
      th, td {
        padding: 6px !important;
      }
      .delete-icon, .edit-icon {
        width: 18px;
      }
      .modal-dialog {
        max-width: 95% !important;
        margin: auto;
      }
    }
    @media (max-width: 480px) {
      table {
        font-size: 13px;
      }
      th, td {
        padding: 4px !important;
      }
      h2 {
        font-size: 18px;
        text-align: center;
      }
    }
  </style>
    <div class="quick-actions mb-4 d-flex">
        <a href="#dashboard"><i class="fas fa-tachometer-alt"></i> </a>
        <a href="#users"><i class="fas fa-users"></i> </a>
        <a href="#admin-orders"><i class="fas fa-box"></i></a>
        <a href="#admin-products"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
        <a href="#analytics"><i class="fas fa-chart-line"></i> </a>
      </div>
    <h2 class="mb-3">Manage Users</h2>
    <div class="table-responsive">
      <table class="table table-hover table-bordered align-middle">
        <thead class="text-center table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers
				.map((u, index) => {
					const modalId = `editModal-${u.id || index}`;
					return `
                <tr class="text-center">
                  <th>${index + 1}</th>
                  <td>${u.name || ""}</td>
                  <td class="text-break">${u.email || ""}</td>
                  <td>
                    <span class="badge bg-${u.role === "seller" ? "info" : "success"}">${u.role || "User"}</span>
                  </td>
                  <td>
                    <img class="delete-icon" data-id="${u.id}" 
                        src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000" 
                        alt="Delete" width="20">
                  </td>
                  <td>
                    <img data-bs-toggle="modal" data-bs-target="#${modalId}" 
                        class="edit-icon" data-id="${u.id}" 
                        src="https://img.icons8.com/?size=100&id=zqRKVWtC1VeY&format=png&color=000000" 
                        alt="Edit" width="20">

                    <!-- Modal -->
                    <div class="modal fade" id="${modalId}" tabindex="-1" 
                        aria-labelledby="${modalId}-label" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}-label">Edit User: ${u.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body text-start">
                            <form id="form-${u.id}">
                              <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" name="name" value="${u.name || ""}">
                              </div>
                              <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" name="password" value="${u.password || ""}">
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-warning save-edit-btn" data-id="${u.id}">Save changes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
				})
				.join("")}
        </tbody>
      </table>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll(".save-edit-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const form = document.getElementById(`form-${id}`);
        const updatedUser = {
        ...allusers.find((u) => u.id == id),
        name: form.name.value,
        password: await hashPassword(form.password.value),
      };
        const newUsers = allusers.map(u => (u.id == id ? updatedUser : u));
        localStorage.setItem("users", JSON.stringify(newUsers));
        location.reload();
      });
    });
  }, 0);

  setTimeout(() => {
    document.querySelectorAll(".delete-icon").forEach(icon => {
      icon.addEventListener("click", e => {
        const tr = e.target.closest("tr");
        const id = e.target.dataset.id;
        tr.innerHTML = `
          <td colspan="6" class="text-center">
            <span class="fw-medium text-danger small me-2">Delete this user?</span>
            <button class="btn btn-sm btn-outline-danger confirm-yes">Yes</button>
            <button class="btn btn-sm btn-outline-secondary confirm-no">No</button>
          </td>
        `;
        tr.querySelector(".confirm-yes").addEventListener("click", () => {
          let allusers = JSON.parse(localStorage.getItem("users")) || [];
          const newUsers = allusers.filter(u => u.id != id);
          localStorage.setItem("users", JSON.stringify(newUsers));
          tr.remove();
        });
        tr.querySelector(".confirm-no").addEventListener("click", () => location.reload());
      });
    });
  }, 0);

  return html;
}
