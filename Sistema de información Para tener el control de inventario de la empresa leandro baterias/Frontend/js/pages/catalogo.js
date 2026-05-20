const CatalogPage = {
    products: [],
    currentPage: 1,
    itemsPerPage: 12,
    filters: {
        categoria: '',
        marcas: [],
        voltaje: '',
        precioMin: 0,
        precioMax: 2000,
        marca: '',
        modelo: '',
        anio: '',
        buscar: ''
    },

    init: function() {
        this.loadFiltersFromUrl();
        this.loadProducts();
        this.setupFilters();
        this.setupSorting();
        this.setupViewToggle();
    },

    loadFiltersFromUrl: function() {
        const params = new URLSearchParams(window.location.search);
        this.filters.categoria = params.get('tipo') || '';
        this.filters.marca = params.get('marca') || '';
        this.filters.modelo = params.get('modelo') || '';
        this.filters.anio = params.get('anio') || '';
        this.filters.buscar = params.get('buscar') || '';
    },

    loadProducts: function() {
        // Datos de ejemplo (en producción vendría de la API)
        this.products = [
            // SOLITE
            { idBateria: 1, nombre: 'Batería Solite 40B19L', marca: 'Solite', voltaje: '12', amperaje: '35', potenciaArranque: '300 CCA', precio: 180.00, precioAnterior: null, stockActual: 15, destacada: false, garantiaMeses: 12, imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+40B19L&font=roboto' },
            { idBateria: 2, nombre: 'Batería Solite 42B19L', marca: 'Solite', voltaje: '12', amperaje: '40', potenciaArranque: '350 CCA', precio: 210.00, precioAnterior: null, stockActual: 20, destacada: true, garantiaMeses: 12, imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+42B19L&font=roboto' },
            { idBateria: 3, nombre: 'Batería Solite 50B19L', marca: 'Solite', voltaje: '12', amperaje: '50', potenciaArranque: '450 CCA', precio: 280.00, precioAnterior: null, stockActual: 12, destacada: true, garantiaMeses: 18, imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+50B19L&font=roboto' },
            // ENERJET
            { idBateria: 4, nombre: 'Batería Enerjet 11D56', marca: 'Enerjet', voltaje: '12', amperaje: '11', potenciaArranque: '100 CCA', precio: 120.00, precioAnterior: null, stockActual: 25, destacada: false, garantiaMeses: 12, imagenUrl: 'https://placehold.co/400x300/ff6d00/ffffff?text=Enerjet+11D56&font=roboto' },
            { idBateria: 5, nombre: 'Batería Enerjet 13S85', marca: 'Enerjet', voltaje: '12', amperaje: '13', potenciaArranque: '120 CCA', precio: 150.00, precioAnterior: null, stockActual: 18, destacada: false, garantiaMeses: 12, imagenUrl: 'https://placehold.co/400x300/ff6d00/ffffff?text=Enerjet+13S85&font=roboto' },
            { idBateria: 6, nombre: 'Batería Enerjet 15M99', marca: 'Enerjet', voltaje: '12', amperaje: '15', potenciaArranque: '130 CCA', precio: 180.00, precioAnterior: null, stockActual: 14, destacada: true, garantiaMeses: 15, imagenUrl: 'https://placehold.co/400x300/ff6d00/ffffff?text=Enerjet+15M99&font=roboto' },
            { idBateria: 7, nombre: 'Batería Enerjet 23P159 AGM', marca: 'Enerjet', voltaje: '12', amperaje: '23', potenciaArranque: '200 CCA', precio: 320.00, precioAnterior: 380.00, stockActual: 8, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/ff6d00/ffffff?text=Enerjet+23P159+AGM&font=roboto' },
            // ETNA
            { idBateria: 8, nombre: 'Batería Etna W-11', marca: 'Etna', voltaje: '12', amperaje: '45', potenciaArranque: '400 CCA', precio: 195.00, precioAnterior: null, stockActual: 22, destacada: false, garantiaMeses: 12, imagenUrl: 'https://placehold.co/400x300/00c853/ffffff?text=Etna+W-11&font=roboto' },
            { idBateria: 9, nombre: 'Batería Etna W13', marca: 'Etna', voltaje: '12', amperaje: '55', potenciaArranque: '500 CCA', precio: 250.00, precioAnterior: null, stockActual: 16, destacada: true, garantiaMeses: 15, imagenUrl: 'https://placehold.co/400x300/00c853/ffffff?text=Etna+W13&font=roboto' },
            // ULTRABAT
            { idBateria: 10, nombre: 'Batería Ultrabat W-82', marca: 'Ultrabat', voltaje: '12', amperaje: '60', potenciaArranque: '550 CCA', precio: 280.00, precioAnterior: null, stockActual: 14, destacada: true, garantiaMeses: 18, imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+W-82&font=roboto' },
            { idBateria: 11, nombre: 'Batería Ultrabat FF-56', marca: 'Ultrabat', voltaje: '12', amperaje: '56', potenciaArranque: '520 CCA', precio: 260.00, precioAnterior: null, stockActual: 20, destacada: false, garantiaMeses: 15, imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+FF-56&font=roboto' },
            { idBateria: 12, nombre: 'Batería Ultrabat FF-66', marca: 'Ultrabat', voltaje: '12', amperaje: '66', potenciaArranque: '600 CCA', precio: 320.00, precioAnterior: null, stockActual: 10, destacada: true, garantiaMeses: 18, imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+FF-66&font=roboto' },
            { idBateria: 13, nombre: 'Batería Ultrabat V-82 Gel', marca: 'Ultrabat', voltaje: '12', amperaje: '82', potenciaArranque: '750 CCA', precio: 450.00, precioAnterior: null, stockActual: 6, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+V-82+Gel&font=roboto' },
            { idBateria: 14, nombre: 'Batería Ultrabat S-96 Premium', marca: 'Ultrabat', voltaje: '12', amperaje: '96', potenciaArranque: '850 CCA', precio: 550.00, precioAnterior: null, stockActual: 5, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+S-96+Premium&font=roboto' },
            // VARTA
            { idBateria: 15, nombre: 'Batería Varta 27R V5', marca: 'Varta', voltaje: '12', amperaje: '75', potenciaArranque: '700 CCA', precio: 420.00, precioAnterior: null, stockActual: 12, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/e63946/ffffff?text=Varta+27R+V5&font=roboto' },
            { idBateria: 16, nombre: 'Batería Varta 24R V5', marca: 'Varta', voltaje: '12', amperaje: '65', potenciaArranque: '600 CCA', precio: 380.00, precioAnterior: null, stockActual: 10, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/e63946/ffffff?text=Varta+24R+V5&font=roboto' },
            // CAPSA
            { idBateria: 17, nombre: 'Batería Capsa 4D 1800', marca: 'Capsa', voltaje: '12', amperaje: '180', potenciaArranque: '1300 CCA', precio: 850.00, precioAnterior: 980.00, stockActual: 4, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+4D+1800&font=roboto' },
            { idBateria: 18, nombre: 'Batería Capsa 4D 200', marca: 'Capsa', voltaje: '12', amperaje: '200', potenciaArranque: '1500 CCA', precio: 980.00, precioAnterior: null, stockActual: 3, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+4D+200&font=roboto' },
            { idBateria: 19, nombre: 'Batería Capsa 8D 2600', marca: 'Capsa', voltaje: '12', amperaje: '260', potenciaArranque: '1800 CCA', precio: 1250.00, precioAnterior: null, stockActual: 2, destacada: true, garantiaMeses: 24, imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+8D+2600&font=roboto' },
            { idBateria: 20, nombre: 'Batería Capsa 24R 950', marca: 'Capsa', voltaje: '12', amperaje: '70', potenciaArranque: '650 CCA', precio: 340.00, precioAnterior: null, stockActual: 15, destacada: false, garantiaMeses: 18, imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+24R+950&font=roboto' },
            { idBateria: 21, nombre: 'Batería Capsa 27R 1150', marca: 'Capsa', voltaje: '12', amperaje: '80', potenciaArranque: '750 CCA', precio: 400.00, precioAnterior: null, stockActual: 18, destacada: true, garantiaMeses: 18, imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+27R+1150&font=roboto' }
        ];

        // Aplicar búsqueda si existe
        if (this.filters.buscar) {
            this.products = this.products.filter(p => 
                p.nombre.toLowerCase().includes(this.filters.buscar.toLowerCase()) ||
                p.marca.toLowerCase().includes(this.filters.buscar.toLowerCase())
            );
        }

        this.applyFilters();
    },

    applyFilters: function() {
        let filtered = [...this.products];

        // Filtrar por categoría
        if (this.filters.categoria) {
            // Simulación de filtro por categoría
        }

        // Filtrar por marcas
        if (this.filters.marcas.length > 0) {
            filtered = filtered.filter(p => this.filters.marcas.includes(p.marca));
        }

        // Filtrar por voltaje
        if (this.filters.voltaje) {
            filtered = filtered.filter(p => p.voltaje === this.filters.voltaje);
        }

        // Filtrar por precio
        filtered = filtered.filter(p => 
            p.precio >= this.filters.precioMin && 
            p.precio <= this.filters.precioMax
        );

        // Ordenar
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const sortValue = sortSelect.value;
            switch (sortValue) {
                case 'precio-asc':
                    filtered.sort((a, b) => a.precio - b.precio);
                    break;
                case 'precio-desc':
                    filtered.sort((a, b) => b.precio - a.precio);
                    break;
                case 'nombre-asc':
                    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    break;
                case 'stock-desc':
                    filtered.sort((a, b) => b.stockActual - a.stockActual);
                    break;
            }
        }

        this.renderProducts(filtered);
    },

    renderProducts: function(products) {
        const grid = document.getElementById('products-grid');
        const countText = document.getElementById('products-count-text');
        const resultsCount = document.getElementById('results-count');

        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-search" style="font-size: 64px; color: var(--text-light); margin-bottom: 20px;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            if (countText) countText.textContent = '0 productos encontrados';
            if (resultsCount) resultsCount.textContent = 'No se encontraron productos';
            return;
        }

        const totalPages = Math.ceil(products.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageProducts = products.slice(start, end);

        grid.innerHTML = pageProducts.map(p => ProductCard.render(p)).join('');
        ProductCard.setupEvents(grid);

        if (countText) countText.textContent = `${products.length} productos encontrados`;
        if (resultsCount) resultsCount.textContent = `${products.length} productos disponibles`;

        this.renderPagination(totalPages);
    },

    renderPagination: function(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Botón anterior
        if (this.currentPage > 1) {
            html += `<button class="pagination-btn" data-page="${this.currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
        }

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Botón siguiente
        if (this.currentPage < totalPages) {
            html += `<button class="pagination-btn" data-page="${this.currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
        }

        pagination.innerHTML = html;

        // Agregar eventos
        pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.applyFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    },

    setupFilters: function() {
        // Filtros de categoría
        document.querySelectorAll('input[name="categoria"]').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.categoria = input.value;
            });
        });

        // Filtros de marca
        document.querySelectorAll('input[name="marca"]').forEach(input => {
            input.addEventListener('change', () => {
                const checked = document.querySelectorAll('input[name="marca"]:checked');
                this.filters.marcas = Array.from(checked).map(c => c.value);
            });
        });

        // Filtros de voltaje
        document.querySelectorAll('input[name="voltaje"]').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.voltaje = input.value;
            });
        });

        // Aplicar filtros
        const applyBtn = document.getElementById('apply-filters');
        applyBtn?.addEventListener('click', () => {
            this.filters.precioMin = parseInt(document.getElementById('price-min')?.value) || 0;
            this.filters.precioMax = parseInt(document.getElementById('price-max')?.value) || 2000;
            this.currentPage = 1;
            this.applyFilters();
        });

        // Limpiar filtros
        const clearBtn = document.getElementById('clear-filters');
        clearBtn?.addEventListener('click', () => {
            document.querySelectorAll('.filters-panel input').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = input.defaultChecked;
                } else {
                    input.value = input.defaultValue;
                }
            });
            this.filters = {
                categoria: '',
                marcas: [],
                voltaje: '',
                precioMin: 0,
                precioMax: 2000,
                marca: '',
                modelo: '',
                anio: '',
                buscar: ''
            };
            this.currentPage = 1;
            this.applyFilters();
        });
    },

    setupSorting: function() {
        const sortSelect = document.getElementById('sort-select');
        sortSelect?.addEventListener('change', () => {
            this.currentPage = 1;
            this.applyFilters();
        });
    },

    setupViewToggle: function() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const grid = document.getElementById('products-grid');
                if (btn.dataset.view === 'list') {
                    grid.classList.add('products-list-view');
                } else {
                    grid.classList.remove('products-list-view');
                }
            });
        });
    }
};

window.CatalogPage = CatalogPage;