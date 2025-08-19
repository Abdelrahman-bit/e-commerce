// Authentication and User Management
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // Register new user
    register(userData) {
        const users = this.getUsers();
        
        // Check if user already exists
        if (users.find(user => user.email === userData.email)) {
            throw new Error('User already exists');
        }

        // Add new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return newUser;
    }

    // Login user
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        return user;
    }

    // Logout user
    // logout() {
    //     // Clear current user from localStorage
    //     localStorage.removeItem('currentUser');
        
    //     // Clear cart for the logged out user
    //     localStorage.removeItem('cart');
        
    //     // Clear any session data
    //     localStorage.removeItem('sessionData');
        
    //     // Reset current user
    //     this.currentUser = null;
        
    //     // Show logout message
    //     if (typeof showAlert === 'function') {
    //         showAlert('Logged out successfully!', 'success');
    //     }
        
    //     // Redirect to home page with relative path
    //     setTimeout(() => {
    //         const currentPath = window.location.pathname;
    //         if (currentPath.includes('/adminr/') || currentPath.includes('/sellerr/') || currentPath.includes('/customer/')) {
    //             window.location.href = '../../index.html';
    //         } else {
    //             window.location.href = './index.html';
    //         }
    //     }, 1000);
    // }
logout(options = { redirect: true }) {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('cart');
  localStorage.removeItem('sessionData');
  this.currentUser = null;

  if (typeof showAlert === 'function') {
    showAlert('Logged out successfully!', 'success');
  }

  if (options.redirect) {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin/') || currentPath.includes('/seller/') || currentPath.includes('/customer/')) {
        window.location.href = '../../index.html';
      } else {
        window.location.href = './index.html';
      }
    }, 1000);
  }
}

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Get all users
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check user role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Redirect based on role
    redirectToRolePage() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        switch (this.currentUser.role) {
            case 'admin':
                window.location.href = '/admin/admin-dashboard.html';
                break;
            case 'seller':
                window.location.href = '/seller/seller-dashboard.html';
                break;
            case 'customer':
                window.location.href = '/index.html';
                break;
            default:
                window.location.href = '/index.html';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();