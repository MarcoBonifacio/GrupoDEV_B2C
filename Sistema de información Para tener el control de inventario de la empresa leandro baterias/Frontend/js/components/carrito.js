const Carrito = {
    updateUI: function() {
        const cart = Storage.getCart();
        const countElements = document.querySelectorAll('.cart-count');
        const totalElements = document.querySelectorAll('.cart-total');
        const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        countElements.forEach(el => el.textContent = cart.length);
        totalElements.forEach(el => el.textContent = Format.currency(total));

        this.updateMiniCart(cart);
    },

    updateMiniCart: function(cart) {
        const miniCartItems = document.getElementById('mini-cart-items');
        const miniCartTotal = document.getElementById('mini-cart-total');

        if (!miniCartItems) return;

        if (cart.length === 0) {
            miniCartItems.innerHTML = `
                <div class="mini-cart-empty" style="text-align: center; padding: 30px;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: var(--border-color); margin-bottom: 15px;"></i>
                    <p style="color: var(--text-light);">Tu carrito está vacío</p>
                    <a href="pages/catalogo.html" class="btn btn-primary btn-sm" style="margin-top: 15px;">Ver Catálogo</a>
                </div>
            `;
            miniCartTotal.textContent = 'S/ 0.00';
            return;
        }

        miniCartItems.innerHTML = cart.map(item => `
            <div class="mini-cart-item" data-id="${item.idBateria}">
                <img src="${item.imagenUrl || `https://via.placeholder.com/60x60?text=${encodeURIComponent(item.nombre)}`}" alt="${item.nombre}">
                <div class="mini-cart-item-info">
                    <h5>${item.nombre}</h5>
                    <p>${Format.currency(item.precio)} x ${item.cantidad}</p>
                </div>
                <div class="mini-cart-item-actions">
                    <span class="mini-cart-item-price">${Format.currency(item.precio * item.cantidad)}</span>
                    <button class="mini-cart-item-remove" data-id="${item.idBateria}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        miniCartTotal.textContent = Format.currency(total);

        miniCartItems.querySelectorAll('.mini-cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(parseInt(btn.dataset.id));
            });
        });
    },

    addItem: function(producto) {
        const cart = Storage.getCart();
        const idBateria = producto.idBateria || producto.IdBateria;
        const existingItem = cart.find(item => item.idBateria === idBateria);

        if (existingItem) {
            existingItem.cantidad += 1;
            Storage.setCart(cart);
            this.updateUI();
            Toast.show('Cantidad actualizada en el carrito', 'success');
        } else {
            cart.push({
                idBateria: idBateria,
                nombre: producto.nombre || producto.Nombre,
                precio: producto.precio || producto.Precio,
                imagenUrl: producto.imagenUrl || producto.ImagenUrl,
                stock: producto.stockActual || producto.StockActual || 99,
                cantidad: 1
            });
            Storage.setCart(cart);
            this.updateUI();
            Toast.show(`${producto.nombre || producto.Nombre} agregado al carrito`, 'success');
        }
    },

    addItemById: function(idBateria, productosDisponibles) {
        const producto = productosDisponibles.find(p => p.idBateria === idBateria);
        if (producto) {
            this.addItem(producto);
        } else {
            Toast.show('Producto no encontrado', 'error');
        }
    },

    updateQuantity: function(idBateria, cantidad) {
        const cart = Storage.getCart();
        const item = cart.find(item => item.idBateria === idBateria);

        if (item) {
            if (cantidad <= 0) {
                this.removeItem(idBateria);
            } else {
                item.cantidad = cantidad;
                Storage.setCart(cart);
                this.updateUI();
            }
        }
    },

    removeItem: function(idBateria) {
        let cart = Storage.getCart();
        cart = cart.filter(item => item.idBateria !== idBateria);
        Storage.setCart(cart);
        this.updateUI();
        Toast.show('Producto eliminado del carrito', 'info');
    },

    clear: function() {
        Storage.setCart([]);
        this.updateUI();
    },

    init: function() {
        const cartBtn = document.getElementById('btn-cart');
        const miniCart = document.getElementById('mini-cart');
        const closeMiniCart = document.getElementById('close-mini-cart');

        if (cartBtn && miniCart) {
            cartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                miniCart.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!miniCart.contains(e.target) && e.target !== cartBtn) {
                    miniCart.classList.add('hidden');
                }
            });

            closeMiniCart?.addEventListener('click', () => {
                miniCart.classList.add('hidden');
            });
        }

        this.updateUI();
    }
};

window.Carrito = Carrito;