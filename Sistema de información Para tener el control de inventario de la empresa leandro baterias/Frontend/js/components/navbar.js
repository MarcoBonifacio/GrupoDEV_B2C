const Navbar = {
    init: function() {
        this.setupMobileMenu();
        this.setupUserMenu();
        this.setupVehicleSearch();
        this.setupSearch();
    },

    setupMobileMenu: function() {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-label', 'Menú');

        const headerNav = document.querySelector('.header-nav');
        const navList = headerNav.querySelector('.nav-list');

        menuBtn.addEventListener('click', () => {
            headerNav.classList.toggle('active');
            menuBtn.innerHTML = headerNav.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        headerNav.parentElement.appendChild(menuBtn);
        menuBtn.style.cssText = 'display: none; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: transparent; color: white; font-size: 20px; border: none; cursor: pointer; z-index: 400;';

        if (window.innerWidth <= 992) {
            menuBtn.style.display = 'flex';
            menuBtn.style.alignItems = 'center';
            menuBtn.style.justifyContent = 'center';
        }

        window.addEventListener('resize', () => {
            menuBtn.style.display = window.innerWidth <= 992 ? 'flex' : 'none';
            menuBtn.style.alignItems = 'center';
            menuBtn.style.justifyContent = 'center';
        });
    },

    setupUserMenu: function() {
        const userMenu = document.getElementById('user-menu');
        if (!userMenu) return;

        const userBtn = userMenu.querySelector('.user-btn');
        const userDropdown = userMenu.querySelector('.user-dropdown');

        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.add('hidden');
        });

        const user = Storage.getUser();
        if (user) {
            userBtn.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=${user.nombres}&background=1a73e8&color=fff" alt="${user.nombres}" style="width: 32px; height: 32px; border-radius: 50%;">
                <span>${user.nombres}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            userDropdown.innerHTML = `
                <a href="pages/mi-cuenta.html"><i class="fas fa-user-circle"></i> Mi Perfil</a>
                <a href="pages/mis-pedidos.html"><i class="fas fa-box"></i> Mis Pedidos</a>
                <a href="pages/favoritos.html"><i class="fas fa-heart"></i> Favoritos</a>
                <hr>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            `;
        }
    },

    setupVehicleSearch: function() {
        const forms = [
            document.getElementById('vehicle-search-form'),
            document.getElementById('hero-vehicle-form')
        ];

        forms.forEach(form => {
            if (!form) return;

            const marcaSelect = form.querySelector('[id*="marca"]');
            const modeloSelect = form.querySelector('[id*="modelo"]');
            const anioSelect = form.querySelector('[id*="anio"]');

            this.loadMarcas(marcaSelect);

            marcaSelect?.addEventListener('change', async () => {
                modeloSelect.innerHTML = '<option value="">Cargando...</option>';
                modeloSelect.disabled = true;
                anioSelect.innerHTML = '<option value="">Seleccionar...</option>';
                anioSelect.disabled = true;

                if (marcaSelect.value) {
                    try {
                        const modelos = await CatalogoAPI.getModelos(marcaSelect.value).catch(() => this.loadModelosDemo(marcaSelect.value));
                        modeloSelect.innerHTML = '<option value="">Seleccionar...</option>';
                        modelos.forEach(m => {
                            modeloSelect.innerHTML += `<option value="${m.idModelo}">${m.nombre}</option>`;
                        });
                        modeloSelect.disabled = false;
                    } catch (error) {
                        // Usar datos demo si falla
                        const modelos = this.loadModelosDemo(marcaSelect.value);
                        modeloSelect.innerHTML = '<option value="">Seleccionar...</option>';
                        modelos.forEach(m => {
                            modeloSelect.innerHTML += `<option value="${m.idModelo}">${m.nombre}</option>`;
                        });
                        modeloSelect.disabled = false;
                    }
                }
            });

            modeloSelect?.addEventListener('change', async () => {
                anioSelect.innerHTML = '<option value="">Cargando...</option>';
                anioSelect.disabled = true;

                if (modeloSelect.value) {
                    try {
                        const anios = await CatalogoAPI.getAnios(modeloSelect.value).catch(() => this.loadAniosDemo());
                        anioSelect.innerHTML = '<option value="">Seleccionar...</option>';
                        anios.forEach(a => {
                            anioSelect.innerHTML += `<option value="${a.idAnio}">${a.anio}</option>`;
                        });
                        anioSelect.disabled = false;
                    } catch (error) {
                        // Usar datos demo si falla
                        const anios = this.loadAniosDemo();
                        anioSelect.innerHTML = '<option value="">Seleccionar...</option>';
                        anios.forEach(a => {
                            anioSelect.innerHTML += `<option value="${a.idAnio}">${a.anio}</option>`;
                        });
                        anioSelect.disabled = false;
                    }
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (marcaSelect?.value) params.set('marca', marcaSelect.value);
                if (modeloSelect?.value) params.set('modelo', modeloSelect.value);
                if (anioSelect?.value) params.set('anio', anioSelect.value);
                window.location.href = `pages/catalogo.html?${params.toString()}`;
            });
        });
    },

    loadMarcas: async function(select) {
        if (!select) return;
        select.innerHTML = '<option value="">Cargando...</option>';
        
        // Datos de ejemplo para demostración (sin backend)
        const marcasDemo = [
            { idMarca: 1, nombre: 'Toyota' },
            { idMarca: 2, nombre: 'Honda' },
            { idMarca: 3, nombre: 'Hyundai' },
            { idMarca: 4, nombre: 'Kia' },
            { idMarca: 5, nombre: 'Nissan' },
            { idMarca: 6, nombre: 'Chevrolet' },
            { idMarca: 7, nombre: 'Ford' },
            { idMarca: 8, nombre: 'Volkswagen' }
        ];
        
        try {
            const marcas = await CatalogoAPI.getMarcas().catch(() => marcasDemo);
            select.innerHTML = '<option value="">Seleccionar...</option>';
            marcas.forEach(m => {
                select.innerHTML += `<option value="${m.idMarca}">${m.nombre}</option>`;
            });
        } catch (error) {
            // Usar datos de ejemplo si falla
            select.innerHTML = '<option value="">Seleccionar...</option>';
            marcasDemo.forEach(m => {
                select.innerHTML += `<option value="${m.idMarca}">${m.nombre}</option>`;
            });
        }
    },

    loadModelosDemo: function(marcaValue) {
        const modelosDemo = {
            1: [
                { idModelo: 1, nombre: 'Corolla' },
                { idModelo: 2, nombre: 'Yaris' },
                { idModelo: 3, nombre: 'Rav4' },
                { idModelo: 4, nombre: 'Hilux' }
            ],
            2: [
                { idModelo: 5, nombre: 'Civic' },
                { idModelo: 6, nombre: 'HR-V' },
                { idModelo: 7, nombre: 'CR-V' }
            ],
            3: [
                { idModelo: 8, nombre: 'Tucson' },
                { idModelo: 9, nombre: 'Creta' },
                { idModelo: 10, nombre: 'Santa Fe' }
            ],
            4: [
                { idModelo: 11, nombre: 'Sportage' },
                { idModelo: 12, nombre: 'Seltos' },
                { idModelo: 13, nombre: 'Sorento' }
            ],
            5: [
                { idModelo: 14, nombre: 'Versa' },
                { idModelo: 15, nombre: 'Sentra' },
                { idModelo: 16, nombre: 'Kicks' }
            ],
            6: [
                { idModelo: 17, nombre: 'Spark' },
                { idModelo: 18, nombre: 'Onix' },
                { idModelo: 19, nombre: 'Tracker' }
            ],
            7: [
                { idModelo: 20, nombre: 'Fiesta' },
                { idModelo: 21, nombre: 'Focus' },
                { idModelo: 22, nombre: 'Escape' }
            ],
            8: [
                { idModelo: 23, nombre: 'Gol' },
                { idModelo: 24, nombre: 'Polo' },
                { idModelo: 25, nombre: 'T-Cross' }
            ]
        };
        return modelosDemo[marcaValue] || [];
    },

    loadAniosDemo: function() {
        const anios = [];
        for (let year = 2026; year >= 2015; year--) {
            anios.push({ idAnio: year, anio: year });
        }
        return anios;
    },

    setupSearch: function() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchSuggestions = document.getElementById('search-suggestions');

        if (!searchInput) return;

        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                window.location.href = `pages/catalogo.html?buscar=${encodeURIComponent(query)}`;
            }
        };

        searchButton?.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
};

window.Navbar = Navbar;