
document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btn-search-flights');

    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            // 3. Thu thập các giá trị từ form
            const departure = document.getElementById('departure-city').value;
            const arrival = document.getElementById('arrival-city').value;
            const date = document.getElementById('departure-date').value;
            const airlineRadio = document.querySelector('input[name="airline"]:checked');
            const airlineCode = airlineRadio ? airlineRadio.value : 'VNA';

            // 4. Kiểm tra dữ liệu đầu vào
            if (!date) {
                alert('Vui lòng chọn ngày đi!');
                return;
            }

            if (departure === arrival) {
                alert('Điểm đi và điểm đến không được trùng nhau!');
                return;
            }

            // 5. Logic giả lập giá vé dựa trên hãng hàng không
            let price = 0;
            let airlineName = '';

            switch (airlineCode) {
                case 'VNA':
                    price = 1500000;
                    airlineName = 'Vietnam Airlines';
                    break;
                case 'VJA':
                    price = 800000;
                    airlineName = 'Vietjet Air';
                    break;
                case 'BAV':
                    price = 1200000;
                    airlineName = 'Bamboo Airways';
                    break;
                default:
                    price = 1000000;
                    airlineName = 'Unknown Airline';
            }

            // 6. Tạo đối tượng flightTicket
            const ticketName = `Vé máy bay ${departure} - ${arrival} (${airlineName})`;
            const flightTicket = {
                name: ticketName,
                price: price.toString(),
                quantity: 1
            };

            // 7. Tích hợp với hệ thống giỏ hàng (localStorage)
            let cart = JSON.parse(localStorage.getItem('tourCart')) || [];
            cart.push(flightTicket);
            localStorage.setItem('tourCart', JSON.stringify(cart));

            // Kích hoạt cập nhật UI nếu cart.js đã load
            if (typeof window.updateCartUI === 'function') {
                window.updateCartUI();
            } else {
                // Fallback: Dispatch một event để cart.js nhận biết (nếu được thiết lập)
                // Hoặc đơn giản là thông báo cho người dùng reload/mở sidebar
                console.log('Vé đã được thêm vào LocalStorage.');
            }

            // Mở sidebar giỏ hàng để phản hồi trực quan
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.add('active');
            }

            // 8. Hiển thị thông báo xác nhận
            alert(`Đã thêm thành công: ${ticketName} vào giỏ hàng!`);
        });
    }
});
