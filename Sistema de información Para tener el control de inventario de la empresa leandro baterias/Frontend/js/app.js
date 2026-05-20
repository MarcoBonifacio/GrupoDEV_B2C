(function() {
    'use strict';

    // Global error handler
    window.addEventListener('error', function(e) {
        console.warn('Error capturado:', e.message);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.warn('Promesa rechazada:', e.reason);
    });

    // Inicializar aplicación
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Leandro Baterías - E-commerce initialized');

        try {
            // Inicializar componentes
            if (typeof Modal !== 'undefined') Modal.init();
            if (typeof Toast !== 'undefined') Toast.init();
            if (typeof Navbar !== 'undefined') Navbar.init();
            if (typeof Carrito !== 'undefined') Carrito.init();

            // Cargar página según la URL
            const page = Helpers.getCurrentPage();

            switch (page) {
                case 'index':
                case '':
                    if (typeof HomePage !== 'undefined') HomePage.init();
                    break;
                case 'catalogo':
                    if (typeof CatalogPage !== 'undefined') CatalogPage.init();
                    break;
                case 'producto-detalle':
                    if (typeof ProductDetailPage !== 'undefined') ProductDetailPage.init();
                    break;
                case 'carrito':
                    if (typeof CartPage !== 'undefined') CartPage.init();
                    break;
                case 'checkout':
                    if (typeof CheckoutPage !== 'undefined') CheckoutPage.init();
                    break;
                default:
                    console.log('Page:', page);
            }

            // Actualizar contadores de favoritos y comparación
            if (typeof updateBadges === 'function') updateBadges();
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    });

    function updateBadges() {
        try {
            const favoritesCount = document.querySelector('#btn-favorites .action-badge');
            const compareCount = document.querySelector('#btn-compare .action-badge');

            if (favoritesCount) {
                const favorites = Storage.getFavorites();
                favoritesCount.textContent = favorites.length;
            }

            if (compareCount) {
                const compare = Storage.getCompare();
                compareCount.textContent = compare.length;
            }
        } catch (e) {
            console.warn('Error actualizando badges:', e);
        }
    }

    // Funciones globales de utilidad
    window.appReady = function(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };

    // Exportar para uso en consola
    window.App = {
        Storage,
        Helpers,
        Format,
        Validation,
        API,
        CatalogoAPI,
        Carrito,
        ProductCard,
        Modal,
        Toast,
        Navbar
    };

})();