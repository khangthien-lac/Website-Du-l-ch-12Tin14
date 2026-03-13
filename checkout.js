
document.addEventListener('DOMContentLoaded', () => {
    const checkoutItemsBody = document.getElementById('checkout-items-body');
    const finalTotalPriceElement = document.getElementById('final-total-price');
    const btnApplyDiscount = document.getElementById('btn-apply-discount');
    const discountInput = document.getElementById('discount-code');
    const btnCompleteOrder = document.getElementById('btn-complete-order');
    const invoiceModal = document.getElementById('invoice-modal');
    const invoiceOverlay = document.getElementById('invoice-modal-overlay');

    let cart = JSON.parse(localStorage.getItem('tourCart')) || [];
    let discountRate = 0;
    // Auto-apply coupon from promotions page
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
        console.log('[Checkout] Found saved coupon:', savedCoupon);
        if (savedCoupon === 'HELLOVIET') discountRate = 0.1;
        else if (savedCoupon === 'FESTIVAL15') discountRate = 0.15;
        else if (savedCoupon === 'VIPTHANKS') discountRate = 0.2;
        
        if (discountRate > 0) {
            if (discountInput) discountInput.value = savedCoupon;
            console.log(`[Checkout] Applied ${discountRate * 100}% discount automatically.`);
        }
    }


    const renderCheckout = () => {
        if (!checkoutItemsBody) return;
        checkoutItemsBody.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemPrice = parseInt(item.price);
            const quantity = item.quantity || 1;
            const itemTotal = itemPrice * quantity;
            total += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding:10px;">${item.name}</td>
                <td align="center">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span style="margin: 0 10px;">${quantity}</span>
                        <button class="quantity-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td align="right">${itemTotal.toLocaleString()} VND</td>
            `;
            checkoutItemsBody.appendChild(row);
        });

        const finalTotal = total * (1 - discountRate);
        finalTotalPriceElement.textContent = finalTotal.toLocaleString() + ' VND';
    };

    window.changeQty = (index, delta) => {
        if (!cart[index].quantity) cart[index].quantity = 1;
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        localStorage.setItem('tourCart', JSON.stringify(cart));
        renderCheckout();
    };

    if (btnApplyDiscount) {
        btnApplyDiscount.addEventListener('click', () => {
            if (discountInput.value.toUpperCase() === 'GIAM10') {
                discountRate = 0.1;
                alert('Áp dụng mã giảm giá 10% thành công!');
            } else {
                discountRate = 0;
                alert('Mã giảm giá không hợp lệ.');
            }
            renderCheckout();
        });
    }

    if (btnCompleteOrder) {
        btnCompleteOrder.addEventListener('click', () => {
            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            if (!name) {
                alert('Vui lòng nhập tên của bạn để hoàn tất đơn hàng.');
                return;
            }

            const date = new Date().toLocaleDateString('vi-VN');
            const totalStr = finalTotalPriceElement.textContent;

            invoiceModal.innerHTML = `
                <div class="invoice-header">
                    <h2 class="invoice-title">Hóa Đơn Tour Du Lịch</h2>
                    <p>Ngày: ${date} | Mã HĐ: #DLV${Math.floor(Math.random()*10000)}</p>
                </div>
                <div class="invoice-details-grid">
                    <div class="invoice-col">
                        <h4>Khách hàng:</h4>
                        <p>${name}</p>
                        <p>${phone}</p>
                    </div>
                    <div class="invoice-col">
                        <h4>Đơn vị cung cấp:</h4>
                        <p>Du Lịch Việt</p>
                        <p>Hotline: 1900 1177</p>
                    </div>
                </div>
                <table class="invoice-table-summary" style="width:100%; border-collapse:collapse;">
                    ${cart.map(item => `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:8px 0;">${item.name} x ${item.quantity || 1}</td>
                            <td align="right">${(parseInt(item.price) * (item.quantity || 1)).toLocaleString()} VND</td>
                        </tr>`).join('')}
                </table>
                <div class="invoice-total-row" style="margin-top:20px; font-weight:bold; font-size:1.2rem; text-align:right;">
                    TỔNG TIỀN: ${totalStr}
                </div>
                <div style="text-align:center; margin-top:30px;">
                    <button class="btn-print-invoice" onclick="window.print()">In Hóa Đơn</button>
                    <button class="btn-close-invoice" id="btn-close-modal">Đóng</button>
                </div>
            `;

            invoiceOverlay.style.display = 'block';
            invoiceModal.style.display = 'block';

            document.getElementById('btn-close-modal').addEventListener('click', () => {
                invoiceOverlay.style.display = 'none';
                invoiceModal.style.display = 'none';
                localStorage.removeItem('tourCart');
                window.location.href = 'index.html';
            });
        });
    }

    renderCheckout();
});
