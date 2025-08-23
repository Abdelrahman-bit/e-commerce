(function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const guestRoutes = ["/login.html", "/signup.html"];
    const protectedRoutes = ["/checkout.html", "/payment.html", "/profile.html"];

    const currentPage = window.location.pathname;

    if (currentUser && guestRoutes.includes(currentPage)) {
        window.location.href = "/index.html";
    }

    if (!currentUser && protectedRoutes.includes(currentPage)) {
        window.location.href = "/login.html";
    }
})();
