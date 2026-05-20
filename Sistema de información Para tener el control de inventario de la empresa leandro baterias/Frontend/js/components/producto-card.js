const ProductCard = {
    checkStockAlerts: function(products) {
        products.forEach(product => {
            if (product.stockActual === 0) {
                Toast.show(`ALERTA: ${product.nombre} está AGOTADO`, 'error', 4000);
            } else if (product.stockActual <= 3) {
                Toast.show(`ÚLTIMAS UNIDADES: ${product.nombre} - Solo quedan ${product.stockActual}`, 'warning', 3500);
            } else if (product.stockActual <= 5) {
                Toast.show(`Stock bajo: ${product.nombre} - Solo quedan ${product.stockActual} unidades`, 'info', 3000);
            }
        });
    },

    render: function(product) {
        const discount = product.precioAnterior
            ? Math.round((1 - product.precio / product.precioAnterior) * 100)
            : 0;

        const stockClass = product.stockActual > 10 ? 'stock-high'
            : product.stockActual > 3 ? 'stock-medium'
            : product.stockActual > 0 ? 'stock-low'
            : 'stock-none';

        const stockText = product.stockActual > 10 ? 'En stock'
            : product.stockActual > 3 ? `Stock disponible (${product.stockActual})`
            : product.stockActual > 0 ? `¡Últimas ${product.stockActual} unidades!`
            : 'AGOTADO - Notificarme';

        const isFavorite = Storage.getFavorites().includes(product.idBateria);
        const isCompare = Storage.getCompare().includes(product.idBateria);

        let badgeHtml = '';
        if (product.destacado && product.stockActual > 0) badgeHtml += '<span class="product-badge badge-new">Nuevo</span>';
        if (discount > 0 && product.stockActual > 0) badgeHtml += `<span class="product-badge badge-offer">-${discount}%</span>`;
        if (product.stockActual === 0) badgeHtml += '<span class="product-badge badge-out">AGOTADO</span>';
        else if (product.stockActual <= 3) badgeHtml += '<span class="product-badge badge-stock">¡Últimas!</span>';

        const imageSrc = product.imagenUrl
            ? product.imagenUrl
            : 'https://placehold.co/400x300/e8e8e8/1a73e8?text=Bater%C3%ADa+Image';

        return `
            <article class="product-card" data-id="${product.idBateria}">
                ${badgeHtml}
                <div class="product-actions">
                    <button class="product-action-btn btn-favorite" data-id="${product.idBateria}" title="Agregar a favoritos">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="product-action-btn btn-compare" data-id="${product.idBateria}" title="Comparar">
                        <i class="${isCompare ? 'fas' : 'far'} fa-balance-scale"></i>
                    </button>
                </div>
                <div class="product-image">
                    <img src="${imageSrc}" alt="${product.nombre}" loading="lazy" onerror="this.src='https://placehold.co/400x300/e8e8e8/1a73e8?text=Imagen+no+disponible'">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.marca || ''}</div>
                    <h3 class="product-name">${product.nombre}</h3>
                    <div class="product-specs">
                        <span class="product-spec">${product.voltaje}V</span>
                        <span class="product-spec">${product.amperaje}A</span>
                        ${product.potenciaArranque ? `<span class="product-spec">${product.potenciaArranque}</span>` : ''}
                    </div>
                    <div class="product-stock ${product.stockActual <= 3 && product.stockActual > 0 ? 'stock-warning' : ''}">
                        <span class="stock-indicator ${stockClass}"></span>
                        <span>${stockText}</span>
                    </div>
                    <div class="product-pricing">
                        <span class="product-price">${Format.currency(product.precio)}</span>
                        ${discount > 0 ? `
                            <span class="product-price-old">${Format.currency(product.precioAnterior)}</span>
                            <span class="product-discount">-${discount}%</span>
                        ` : ''}
                    </div>
                    <div class="product-warranty">
                        <i class="fas fa-shield-alt"></i>
                        <span>Garantía: ${product.garantiaMeses || 24} meses</span>
                    </div>
                    <div class="product-buttons">
                        ${product.stockActual === 0 ? `
                            <button class="product-btn-cart btn-notify" data-id="${product.idBateria}" data-name="${product.nombre}">
                                <i class="fas fa-bell"></i> Notificarme
                            </button>
                        ` : `
                            <button class="product-btn-cart" data-id="${product.idBateria}">
                                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                            </button>
                        `}
                        <a href="pages/producto-detalle.html?id=${product.idBateria}" class="product-btn-detail" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    },

    renderGrid: function(products, containerId = 'products-grid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        window.productosDisponibles = products;

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-search" style="font-size: 64px; color: var(--text-light); margin-bottom: 20px;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(p => this.render(p)).join('');

        // Pass products to setupEvents for cart functionality
        this.setupEvents(container, products);
    },

    setupEvents: function(container, productsData = []) {
        const self = this;
        
        container.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                self.toggleFavorite(id, btn);
            });
        });

        container.querySelectorAll('.btn-compare').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                self.toggleCompare(id, btn);
            });
        });

        container.querySelectorAll('.product-btn-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                
                if (btn.classList.contains('btn-notify')) {
                    const productName = btn.dataset.name;
                    self.notifyWhenAvailable(id, productName);
                } else {
                    const producto = productsData.find(p => p.idBateria === id);
                    if (producto) {
                        Carrito.addItem(producto);
                    } else {
                        Carrito.addItemById(id, window.productosDisponibles || []);
                    }
                }
            });
        });
    },

    notifyWhenAvailable: function(id, productName) {
        Toast.show(`Te notificaremos cuando "${productName}" esté disponible`, 'info');
        
        let notifications = Storage.get('leandro_baterias_notifications') || [];
        if (!notifications.includes(id)) {
            notifications.push(id);
            Storage.set('leandro_baterias_notifications', notifications);
        }
    },

    toggleFavorite: function(id, btn) {
        let favorites = Storage.getFavorites();
        const index = favorites.indexOf(id);

        if (index > -1) {
            favorites.splice(index, 1);
            btn.querySelector('i').className = 'far fa-heart';
            Toast.show('Producto eliminado de favoritos', 'info');
        } else {
            favorites.push(id);
            btn.querySelector('i').className = 'fas fa-heart';
            Toast.show('Producto agregado a favoritos', 'success');
        }

        Storage.setFavorites(favorites);
    },

    toggleCompare: function(id, btn) {
        let compare = Storage.getCompare();
        const index = compare.indexOf(id);

        if (index > -1) {
            compare.splice(index, 1);
            btn.querySelector('i').className = 'far fa-balance-scale';
            Toast.show('Producto removido de comparación', 'info');
        } else {
            if (compare.length >= 4) {
                Toast.show('Máximo 4 productos para comparar', 'warning');
                return;
            }
            compare.push(id);
            btn.querySelector('i').className = 'fas fa-balance-scale';
            Toast.show('Producto agregado a comparación', 'success');
        }

        Storage.setCompare(compare);
    }
};

window.ProductCard = ProductCard;