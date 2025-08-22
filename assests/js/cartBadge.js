// Cart Badge Management
class CartBadgeManager {
    constructor() {
        this.badge = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready and header to be loaded
        this.waitForHeader();
    }

    waitForHeader() {
        const checkHeader = () => {
            const badge = document.getElementById('cart-badge');
            if (badge) {
                this.setupBadge();
            } else {
                // Check again after a short delay
                setTimeout(checkHeader, 100);
            }
        };
        
        checkHeader();
    }

    setupBadge() {
        // Find the cart badge element
        this.badge = document.getElementById('cart-badge');
        
        if (this.badge) {
            // Update badge on page load
            this.updateBadge();
            
            // Listen for storage changes (when cart is updated from other pages)
            window.addEventListener('storage', (e) => {
                if (e.key && e.key.startsWith('cart_')) {
                    this.updateBadge();
                }
            });
        }
    }

    updateBadge() {
        if (!this.badge) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this.hideBadge();
            return;
        }

        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            this.showBadge(totalItems);
        } else {
            this.hideBadge();
        }
    }

    showBadge(count) {
        if (!this.badge) return;

        this.badge.textContent = count > 99 ? '99+' : count;
        this.badge.classList.remove('hidden');
        
        // Add pulse animation
        this.badge.classList.add('pulse');
        
        // Remove pulse animation after it completes
        setTimeout(() => {
            this.badge.classList.remove('pulse');
        }, 600);
    }

    hideBadge() {
        if (!this.badge) return;
        this.badge.classList.add('hidden');
    }

    // Method to be called when adding items to cart
    addItemToCart() {
        this.updateBadge();
    }

    // Method to be called when removing items from cart
    removeItemFromCart() {
        this.updateBadge();
    }
}

// Initialize cart badge manager
const cartBadgeManager = new CartBadgeManager();

// Export for use in other modules
export { cartBadgeManager };
