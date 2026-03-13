
    // Function to show visual popup notification
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
        document.body.appendChild(toast);
        
        // Remove element after animation ends
        setTimeout(() => { toast.remove(); }, 3500);
    };

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.getElementById('cart-icon-btn');

    // 2. Aggressive UI Update Logic
    window.updateCartUI = function() {
        const cart = JSON.parse(localStorage.getItem('tourCart')) || [];
        
        // Update every element with .cart-count class simultaneously
        const allBadges = document.querySelectorAll('.cart-count');
        allBadges.forEach(badge => {
            badge.textContent = cart.length;
        });

        // Update Sidebar items if present
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += parseInt(item.price) * (item.quantity || 1);
                const div = document.createElement('div');
                div.style.cssText = 'display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;';
                div.innerHTML = `
                    <span>${item.name}</span>
                    <span>${(parseInt(item.price) * (item.quantity || 1)).toLocaleString()} VND</span>
                    <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer;">&times;</button>
                `;
                cartItemsContainer.appendChild(div);
            });
            if (cartTotalPriceElement) {
                cartTotalPriceElement.textContent = total.toLocaleString() + ' VND';
            }
        }
    };

    // 4. Global Accessibility
    window.addToCart = function(name, price) {
        let cart = JSON.parse(localStorage.getItem('tourCart')) || [];
        cart.push({ name, price, quantity: 1 });
        localStorage.setItem('tourCart', JSON.stringify(cart));
        window.updateCartUI();
        if (cartSidebar) cartSidebar.classList.add('active');
    };

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('tourCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('tourCart', JSON.stringify(cart));
        window.updateCartUI();
    };

    // 3. Cross-tab Synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === 'tourCart') {
            window.updateCartUI();
        }
    });

    // Initial listeners
    
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const cartData = JSON.parse(localStorage.getItem('tourCart')) || [];
            if (cartData.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Giỏ hàng của bạn đang trống!');
            }
        });
    }


    window.updateCartUI();
});
