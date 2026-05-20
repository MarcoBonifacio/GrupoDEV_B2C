const CheckoutPage = {
    init: function() {
        this.loadOrderSummary();
        this.setupPaymentMethods();
    },

    loadOrderSummary: function() {
        const cart = Storage.getCart();
        const itemsContainer = document.getElementById('order-items');

        if (!itemsContainer) return;

        if (cart.length === 0) {
            window.location.href = 'carrito.html';
            return;
        }

        itemsContainer.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-img">
                    <img src="${item.imagenUrl || 'https://placehold.co/60x60?text=Bateria'}" alt="${item.nombre}">
                </div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.nombre}</div>
                    <div class="order-item-qty">Cantidad: ${item.cantidad}</div>
                </div>
                <div class="order-item-price">${Format.currency(item.precio * item.cantidad)}</div>
            </div>
        `).join('');

        this.updateTotals();
    },

    updateTotals: function() {
        const cart = Storage.getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const igv = subtotal * 0.18;
        const shipping = subtotal >= 200 ? 0 : 15;
        const total = subtotal + shipping;

        document.getElementById('summary-subtotal').textContent = Format.currency(subtotal);
        document.getElementById('summary-igv').textContent = Format.currency(igv);
        document.getElementById('summary-envio').textContent = shipping === 0 ? 'GRATIS' : Format.currency(shipping);
        document.getElementById('summary-total').textContent = Format.currency(total);
    },

    setupPaymentMethods: function() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const cardFields = document.getElementById('card-fields');

        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input').checked = true;

                const paymentMethod = option.querySelector('input').value;
                cardFields.style.display = (paymentMethod === 'tarjeta') ? 'block' : 'none';
            });
        });
    },

    processOrder: function() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validación básica
        if (!data.nombres || !data.apellidos || !data.email || !data.telefono || !data.direccion || !data.tipoDoc || !data.numeroDoc) {
            Toast.show('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const paymentMethod = document.querySelector('input[name="pago"]:checked').value;
        
        if (paymentMethod === 'tarjeta') {
            if (!data.numeroTarjeta || !data.mesExpiracion || !data.anioExpiracion || !data.cvv) {
                Toast.show('Por favor completa los datos de tu tarjeta', 'error');
                return;
            }
        }

        // Mostrar loading
        const btn = document.querySelector('button[onclick="CheckoutPage.processOrder()"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        btn.disabled = true;

        // Simular procesamiento (en producción sería una llamada a la API)
        setTimeout(() => {
            // Generar número de pedido
            const orderNumber = 'LB-' + Date.now().toString().slice(-8);
            
            // Guardar datos del pedido
            const orderData = {
                numeroPedido: orderNumber,
                cliente: data,
                productos: Storage.getCart(),
                paymentMethod: paymentMethod,
                fecha: new Date().toISOString(),
                estado: 'PENDIENTE'
            };
            Storage.set('leandro_baterias_ultimo_pedido', orderData);
            
            // Limpiar carrito
            Storage.setCart([]);

            // Mostrar confirmación
            this.showOrderConfirmation(orderNumber);
        }, 2000);
    },

    showOrderConfirmation: function(orderNumber) {
        const container = document.getElementById('checkout-content');
        
        container.innerHTML = `
            <div class="order-success">
                <i class="fas fa-check-circle"></i>
                <h2>¡Pedido Confirmado!</h2>
                <p>Gracias por tu compra.Hemos recibido tu pedido y lo estamos procesando.</p>
                
                <div class="order-number">
                    <p style="margin-bottom: 5px; color: var(--text-light);">Número de Pedido:</p>
                    <strong>${orderNumber}</strong>
                </div>

                <div style="text-align: left; max-width: 500px; margin: 0 auto 30px; background: var(--bg-gray); padding: 20px; border-radius: var(--radius-md);">
                    <h4 style="margin-bottom: 15px;">Próximos Pasos:</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0;"><i class="fas fa-envelope" style="color: var(--primary-color); margin-right: 10px;"></i> Recibirás un correo de confirmación</li>
                        <li style="padding: 8px 0;"><i class="fas fa-phone" style="color: var(--primary-color); margin-right: 10px;"></i> Te contactaremos para confirmar la entrega</li>
                        <li style="padding: 8px 0;"><i class="fas fa-truck" style="color: var(--primary-color); margin-right: 10px;"></i> Delivery en 24-48 horas hábiles</li>
                    </ul>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center;">
                    <a href="../index.html" class="btn btn-primary">
                        <i class="fas fa-home"></i> Volver al Inicio
                    </a>
                    <a href="catalogo.html" class="btn btn-outline">
                        <i class="fas fa-store"></i> Seguir Comprando
                    </a>
                </div>
            </div>
        `;
    }
};

window.CheckoutPage = CheckoutPage;