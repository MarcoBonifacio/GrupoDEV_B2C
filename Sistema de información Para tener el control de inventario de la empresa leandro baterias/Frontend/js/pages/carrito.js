const CartPage = {
    init: function() {
        this.renderCart();
    },

    renderCart: function() {
        const cart = Storage.getCart();
        const container = document.getElementById('cart-content');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Añade productos para comenzar tu compra!</p>
                    <a href="catalogo.html" class="btn btn-primary btn-lg">
                        <i class="fas fa-store"></i> Ver Catálogo
                    </a>
                </div>
            `;
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const igv = subtotal * 0.18;
        const total = subtotal;
        const shipping = subtotal >= 200 ? 0 : 15;
        const finalTotal = total + shipping;

        container.innerHTML = `
            <div class="cart-layout">
                <div class="cart-items">
                    <h3 style="margin-bottom: 20px;">Productos en tu carrito (${cart.length})</h3>
                    ${cart.map((item, index) => this.renderCartItem(item, index)).join('')}
                </div>

                <div class="cart-summary">
                    <h3>Resumen del Pedido</h3>
                    
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${Format.currency(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>IGV (18%)</span>
                        <span>${Format.currency(igv)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Envío</span>
                        <span>${shipping === 0 ? 'GRATIS' : Format.currency(shipping)}</span>
                    </div>
                    ${shipping > 0 ? '<p style="font-size: 12px; color: var(--text-light); margin-bottom: 10px;">Envío gratis en pedidos mayores a S/ 200</p>' : ''}
                    
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>${Format.currency(finalTotal)}</span>
                    </div>

                    <div class="coupon-code">
                        <input type="text" placeholder="Código de descuento">
                        <button class="btn btn-outline">Aplicar</button>
                    </div>

                    <a href="checkout.html" class="btn btn-primary btn-lg btn-block" style="margin-top: 20px;">
                        <i class="fas fa-credit-card"></i> Proceder al Pago
                    </a>

                    <div class="benefits-list">
                        <div class="benefit-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Compra segura con SSL</span>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-undo"></i>
                            <span>Devolución en 30 días</span>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-headset"></i>
                            <span>Soporte 24/7</span>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-truck"></i>
                            <span>Delivery a todo el Perú</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEvents();
    },

    renderCartItem: function(item, index) {
        return `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.imagenUrl || 'https://placehold.co/120x120?text=Bateria'}" alt="${item.nombre}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-meta">Precio unitario: ${Format.currency(item.precio)}</div>
                    <div class="cart-item-price">${Format.currency(item.precio * item.cantidad)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button onclick="CartPage.updateQuantity(${index}, -1)">-</button>
                            <input type="number" value="${item.cantidad}" min="1" max="99" onchange="CartPage.setQuantity(${index}, this.value)">
                            <button onclick="CartPage.updateQuantity(${index}, 1)">+</button>
                        </div>
                        <span class="remove-item" onclick="CartPage.removeItem(${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </span>
                    </div>
                </div>
            </div>
        `;
    },

    setupEvents: function() {
        // Los eventos están en los atributos onclick
    },

    updateQuantity: function(index, delta) {
        let cart = Storage.getCart();
        if (cart[index]) {
            cart[index].cantidad = Math.max(1, cart[index].cantidad + delta);
            Storage.setCart(cart);
            this.renderCart();
            Toast.show('Cantidad actualizada', 'success');
        }
    },

    setQuantity: function(index, value) {
        let cart = Storage.getCart();
        const qty = parseInt(value);
        if (cart[index] && qty > 0) {
            cart[index].cantidad = qty;
            Storage.setCart(cart);
            this.renderCart();
        }
    },

    removeItem: function(index) {
        let cart = Storage.getCart();
        const itemName = cart[index]?.nombre;
        cart.splice(index, 1);
        Storage.setCart(cart);
        this.renderCart();
        Toast.show(`${itemName} eliminado del carrito`, 'info');
    }
};

window.CartPage = CartPage;