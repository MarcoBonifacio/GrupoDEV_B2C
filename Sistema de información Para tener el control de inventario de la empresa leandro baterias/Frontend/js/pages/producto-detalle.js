const ProductDetailPage = {
    product: null,

    init: function() {
        this.loadProduct();
    },

    loadProduct: function() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id')) || 1;

        // Datos de ejemplo
        const products = {
            1: {
                idBateria: 1,
                nombre: 'Batería Bosch S5 12V 70Ah',
                marca: 'Bosch',
                codigo: 'S5 70Ah',
                voltaje: '12V',
                amperaje: '70Ah',
                potenciaArranque: '760 CCA',
                dimensiones: '278 x 175 x 190 mm',
                peso: '18.5 kg',
                polaridad: 'Positivo Derecha',
                garantia: '24 meses',
                precio: 450.00,
                precioAnterior: 520.00,
                stockActual: 15,
                descripcion: 'La batería Bosch S5 es la elección perfecta para vehículos de alta gama. Con tecnología Silver Plus que proporciona un 30% más de potencia de arranque y mayor vida útil. Ideal para autos con sistemas Start-Stop y alta demanda eléctrica.',
                caracteristicas: [
                    'Tecnología Silver Plus para mayor rendimiento',
                    '30% más potencia de arranque',
                    'Compatible con sistemas Start-Stop',
                    'Fabricada con materiales de alta calidad',
                    'Resistente a vibraciones y temperaturas extremas',
                    'Garantía oficial del fabricante'
                ],
                aplicaciones: ['Toyota Corolla', 'Honda Civic', 'Nissan Sentra', 'Hyundai Tucson', 'Kia Sportage'],
                imagenUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop',
                imagenes: [
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1609710428934-6f3684d5fe45?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=450&fit=crop'
                ]
            }
        };

        this.product = products[productId] || products[1];
        this.renderProduct();
        this.loadRelatedProducts();
    },

    renderProduct: function() {
        const container = document.getElementById('product-detail-content');
        const breadcrumb = document.getElementById('breadcrumb-product');

        if (breadcrumb) breadcrumb.textContent = this.product.nombre;

        const discount = this.product.precioAnterior 
            ? Math.round((1 - this.product.precio / this.product.precioAnterior) * 100) 
            : 0;

        const stockClass = this.product.stockActual > 10 ? 'high' 
            : this.product.stockActual > 0 ? 'low' : 'none';

        const stockText = this.product.stockActual > 10 ? 'En stock' 
            : this.product.stockActual > 0 ? `Solo ${this.product.stockActual} unidades` 
            : 'Agotado';

        const isFavorite = Storage.getFavorites().includes(this.product.idBateria);

        container.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-gallery">
                    <div class="main-image">
                        <img id="main-image" src="${this.product.imagenUrl}" alt="${this.product.nombre}">
                        ${this.product.stockActual === 0 ? '<span class="product-badge badge-out" style="position:absolute;top:20px;left:20px;">AGOTADO</span>' : ''}
                    </div>
                    <div class="thumbnail-list">
                        ${this.product.imagenes?.map((img, i) => `
                            <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="ProductDetailPage.changeImage('${img}')">
                                <img src="${img}" alt="Imagen ${i + 1}">
                            </div>
                        `).join('') || ''}
                    </div>
                </div>

                <div class="product-detail-info">
                    <div class="product-detail-meta">
                        <span><i class="fas fa-tag"></i> ${this.product.marca}</span>
                        <span><i class="fas fa-barcode"></i> ${this.product.codigo}</span>
                        <span><i class="fas fa-star"></i> Destacado</span>
                    </div>

                    <h1>${this.product.nombre}</h1>

                    <div class="product-detail-price">
                        <span class="current-price">${Format.currency(this.product.precio)}</span>
                        ${discount > 0 ? `
                            <span class="old-price">${Format.currency(this.product.precioAnterior)}</span>
                            <span class="discount-badge">-${discount}%</span>
                        ` : ''}
                    </div>

                    <div class="product-stock-status">
                        <span class="stock-dot ${stockClass}"></span>
                        <span>${stockText}</span>
                        <button class="btn-favorite-detail" style="margin-left: auto; background: none; border: none; cursor: pointer; color: var(--danger-color);">
                            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i> ${isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                        </button>
                    </div>

                    <p style="margin-bottom: 20px; color: var(--text-medium); line-height: 1.7;">${this.product.descripcion}</p>

                    <div class="quantity-selector">
                        <label style="font-weight: 600;">Cantidad:</label>
                        <div class="quantity-input">
                            <button class="quantity-btn" onclick="ProductDetailPage.updateQuantity(-1)">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="${this.product.stockActual}">
                            <button class="quantity-btn" onclick="ProductDetailPage.updateQuantity(1)">+</button>
                        </div>
                        <span class="stock-info">(${this.product.stockActual} disponibles)</span>
                    </div>

                    <div class="product-actions-detail">
                        ${this.product.stockActual === 0 ? `
                            <button class="btn btn-warning btn-lg" style="flex:1;" onclick="ProductDetailPage.notifyMe()">
                                <i class="fas fa-bell"></i> Notificarme cuando esté disponible
                            </button>
                        ` : `
                            <button class="btn btn-primary btn-lg" style="flex:1;" onclick="ProductDetailPage.addToCart()">
                                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                            </button>
                        `}
                        <button class="btn btn-outline btn-lg" onclick="ProductDetailPage.buyNow()">
                            Comprar Ahora
                        </button>
                    </div>

                    <div class="product-features">
                        <div class="feature-item">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Envío Gratis</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-tools"></i>
                            <span>Instalación Gratis</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Garantía ${this.product.garantia}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-tabs">
                <div class="tabs">
                    <button class="tab-btn active" onclick="ProductDetailPage.switchTab('features')">Características</button>
                    <button class="tab-btn" onclick="ProductDetailPage.switchTab('specs')">Especificaciones</button>
                    <button class="tab-btn" onclick="ProductDetailPage.switchTab('compatibility')">Compatibilidad</button>
                    <button class="tab-btn" onclick="ProductDetailPage.switchTab('warranty')">Garantía</button>
                </div>

                <div id="tab-features" class="tab-content active">
                    <ul style="list-style: none; padding: 0;">
                        ${this.product.caracteristicas.map(c => `
                            <li style="padding: 10px 0; border-bottom: 1px solid var(--border-light);">
                                <i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 10px;"></i>
                                ${c}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div id="tab-specs" class="tab-content">
                    <table class="spec-table">
                        <tr><th>Voltaje</th><td>${this.product.voltaje}</td></tr>
                        <tr><th>Amperaje</th><td>${this.product.amperaje}</td></tr>
                        <tr><th>Potencia de Arranque</th><td>${this.product.potenciaArranque}</td></tr>
                        <tr><th>Dimensiones</th><td>${this.product.dimensiones}</td></tr>
                        <tr><th>Peso</th><td>${this.product.peso}</td></tr>
                        <tr><th>Polaridad</th><td>${this.product.polaridad}</td></tr>
                        <tr><th>Marca</th><td>${this.product.marca}</td></tr>
                    </table>
                </div>

                <div id="tab-compatibility" class="tab-content">
                    <p>Esta batería es compatible con los siguientes vehículos:</p>
                    <ul style="list-style: none; padding: 0; margin-top: 15px;">
                        ${this.product.aplicaciones.map(a => `
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                <i class="fas fa-car" style="color: var(--primary-color); margin-right: 10px;"></i>
                                ${a}
                            </li>
                        `).join('')}
                    </ul>
                    <p style="margin-top: 15px; color: var(--text-light); font-size: var(--font-size-sm);">
                        <i class="fas fa-info-circle"></i> ¿No encuentras tu vehículo? Contáctanos para verificar compatibilidad.
                    </p>
                </div>

                <div id="tab-warranty" class="tab-content">
                    <h4 style="margin-bottom: 15px;">Términos de Garantía</h4>
                    <p style="margin-bottom: 15px;">Esta batería cuenta con garantía de <strong>${this.product.garantia}</strong> cubren defectos de fabricación.</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0;"><i class="fas fa-check" style="color: var(--success-color); margin-right: 10px;"></i> Garantía válida en todo el territorio nacional</li>
                        <li style="padding: 8px 0;"><i class="fas fa-check" style="color: var(--success-color); margin-right: 10px;"></i> Instalación gratuita en tienda</li>
                        <li style="padding: 8px 0;"><i class="fas fa-check" style="color: var(--success-color); margin-right: 10px;"></i> Servicio técnico especializado</li>
                        <li style="padding: 8px 0;"><i class="fas fa-check" style="color: var(--success-color); margin-right: 10px;"></i> Cambio inmediato por defecto de fábrica</li>
                    </ul>
                </div>
            </div>
        `;

        this.setupEvents();
    },

    setupEvents: function() {
        document.querySelector('.btn-favorite-detail')?.addEventListener('click', () => {
            let favorites = Storage.getFavorites();
            const id = this.product.idBateria;
            if (favorites.includes(id)) {
                favorites = favorites.filter(f => f !== id);
                Toast.show('Eliminado de favoritos', 'info');
            } else {
                favorites.push(id);
                Toast.show('Agregado a favoritos', 'success');
            }
            Storage.setFavorites(favorites);
            this.loadProduct();
        });
    },

    changeImage: function(src) {
        document.getElementById('main-image').src = src;
        document.querySelectorAll('.thumbnail').forEach(t => {
            t.classList.toggle('active', t.querySelector('img').src === src);
        });
    },

    updateQuantity: function(delta) {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value) + delta;
        value = Math.max(1, Math.min(value, this.product.stockActual));
        input.value = value;
    },

    addToCart: function() {
        const cantidad = parseInt(document.getElementById('quantity').value);
        const cart = Storage.getCart();
        
        const existingItem = cart.find(item => item.idBateria === this.product.idBateria);
        if (existingItem) {
            existingItem.cantidad += cantidad;
        } else {
            cart.push({
                idBateria: this.product.idBateria,
                nombre: this.product.nombre,
                precio: this.product.precio,
                imagenUrl: this.product.imagenUrl,
                cantidad: cantidad
            });
        }
        
        Storage.setCart(cart);
        Toast.show(`${this.product.nombre} agregado al carrito`, 'success');
        
        if (typeof Carrito !== 'undefined') Carrito.updateUI();
    },

    buyNow: function() {
        this.addToCart();
        window.location.href = 'checkout.html';
    },

    notifyMe: function() {
        Toast.show('Te notificaremos cuando esté disponible', 'info');
        let notifications = Storage.get('leandro_baterias_notifications') || [];
        if (!notifications.includes(this.product.idBateria)) {
            notifications.push(this.product.idBateria);
            Storage.set('leandro_baterias_notifications', notifications);
        }
    },

    switchTab: function(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    },

    loadRelatedProducts: function() {
        const related = [
            { idBateria: 2, nombre: 'Batería Varta Blue Dynamic E43', marca: 'Varta', voltaje: '12', amperaje: '72', potenciaArranque: '680 CCA', precio: 380.00, precioAnterior: null, stockActual: 8, garantiaMeses: 24, imagenUrl: 'https://images.unsplash.com/photo-1609710428934-6f3684d5fe45?w=400&h=300&fit=crop' },
            { idBateria: 5, nombre: 'Batería AGM Bosch S6 High Performance', marca: 'Bosch', voltaje: '12', amperaje: '70', potenciaArranque: '800 CCA', precio: 680.00, precioAnterior: 750.00, stockActual: 3, destacada: true, garantiaMeses: 36, imagenUrl: 'https://images.unsplash.com/photo-1558618047-f4b511839855?w=400&h=300&fit=crop' },
            { idBateria: 10, nombre: 'Batería Yuasa High Performance', marca: 'Yuasa', voltaje: '12', amperaje: '60', potenciaArranque: '550 CCA', precio: 320.00, precioAnterior: null, stockActual: 18, garantiaMeses: 24, imagenUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop' },
            { idBateria: 16, nombre: 'Batería Varta Silver Dynamic', marca: 'Varta', voltaje: '12', amperaje: '74', potenciaArranque: '750 CCA', precio: 520.00, precioAnterior: 580.00, stockActual: 11, garantiaMeses: 30, imagenUrl: 'https://images.unsplash.com/photo-1609710428934-6f3684d5fe45?w=400&h=300&fit=crop' }
        ];
        
        const container = document.getElementById('related-products-grid');
        if (container) {
            ProductCard.renderGrid(related, 'related-products-grid');
        }
    }
};

window.ProductDetailPage = ProductDetailPage;