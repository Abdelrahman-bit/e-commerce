(function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // logged in routes
  const guestRoutes = ["/login.html"];

  // Protected routes (need login)
  const protectedRoutes = [
    "/CheckOutPage.html",
    "/payment.html",
    "/profile.html",
    "/customer/cart.html",
    "/admin/dashboard.html",
    "/seller/seller-dashboard.html",
    "/seller/seller-orders.html",
  ];

  // Role restrictions
  const roleRestrictions = {
    customer: ["/admin/admin-dashboard.html", "/seller/seller-dashboard.html"],
    seller: ["/admin/admin-dashboard.html"],
    admin: [],
  };

  const currentPage = window.location.pathname;

  // logged in but on guest route → redirect home
  if (currentUser && guestRoutes.includes(currentPage)) {
    window.location.href = "/index.html";
  }

  //not logged in but on protected route → redirect login
  if (!currentUser && protectedRoutes.includes(currentPage)) {
    window.location.href = "/login.html";
  }

  // logged in but role is restricted for this page
  if (currentUser) {
    const { role } = currentUser;
    const restricted = roleRestrictions[role] || [];

    if (restricted.includes(currentPage)) {
      window.location.href = "/index.html";
    }
  }
})();
