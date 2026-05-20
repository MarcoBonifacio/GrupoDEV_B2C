const HomePage = {
    featuredProducts: [],

    init: function() {
        this.setupHeroSlider();
        this.loadFeaturedProducts();
        this.setupVehicleFinder();
        this.setupFAQ();
        this.setupNewsletter();
    },

    setupHeroSlider: function() {
        const slider = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.hero-slide');
        const dotsContainer = document.querySelector('.hero-dots');
        const prevBtn = document.querySelector('.hero-nav.prev');
        const nextBtn = document.querySelector('.hero-nav.next');

        if (!slider || slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                slides[currentSlide].classList.remove('active');
                dotsContainer.children[currentSlide].classList.remove('active');
                currentSlide = i;
                slides[currentSlide].classList.add('active');
                dotsContainer.children[currentSlide].classList.add('active');
            });
            dotsContainer.appendChild(dot);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                slides[currentSlide].classList.remove('active');
                dotsContainer.children[currentSlide].classList.remove('active');
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                slides[currentSlide].classList.add('active');
                dotsContainer.children[currentSlide].classList.add('active');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                slides[currentSlide].classList.remove('active');
                dotsContainer.children[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % totalSlides;
                slides[currentSlide].classList.add('active');
                dotsContainer.children[currentSlide].classList.add('active');
            });
        }

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            dotsContainer.children[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
            dotsContainer.children[currentSlide].classList.add('active');
        }, 5000);
    },

    loadFeaturedProducts: function() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        // Datos de ejemplo para demostración
        const products = [
            // SOLITE
            {
                idBateria: 1,
                nombre: 'Batería Solite 40B19L',
                marca: 'Solite',
                voltaje: '12',
                amperaje: '35',
                potenciaArranque: '300 CCA',
                precio: 180.00,
                precioAnterior: null,
                stockActual: 15,
                destacada: false,
                garantiaMeses: 12,
                imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+40B19L&font=roboto'
            },
            {
                idBateria: 2,
                nombre: 'Batería Solite 42B19L',
                marca: 'Solite',
                voltaje: '12',
                amperaje: '40',
                potenciaArranque: '350 CCA',
                precio: 210.00,
                precioAnterior: null,
                stockActual: 20,
                destacada: true,
                garantiaMeses: 12,
                imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+42B19L&font=roboto'
            },
            {
                idBateria: 3,
                nombre: 'Batería Solite 50B19L',
                marca: 'Solite',
                voltaje: '12',
                amperaje: '50',
                potenciaArranque: '450 CCA',
                precio: 280.00,
                precioAnterior: null,
                stockActual: 12,
                destacada: true,
                garantiaMeses: 18,
                imagenUrl: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Solite+50B19L&font=roboto'
            },
            // ENERJET
            {
                idBateria: 4,
                nombre: 'Batería Enerjet 23P159 AGM',
                marca: 'Enerjet',
                voltaje: '12',
                amperaje: '23',
                potenciaArranque: '200 CCA',
                precio: 320.00,
                precioAnterior: 380.00,
                stockActual: 8,
                destacada: true,
                garantiaMeses: 24,
                imagenUrl: 'https://placehold.co/400x300/ff6d00/ffffff?text=Enerjet+23P159+AGM&font=roboto'
            },
            // ETNA
            {
                idBateria: 5,
                nombre: 'Batería Etna W13',
                marca: 'Etna',
                voltaje: '12',
                amperaje: '55',
                potenciaArranque: '500 CCA',
                precio: 250.00,
                precioAnterior: null,
                stockActual: 16,
                destacada: true,
                garantiaMeses: 15,
                imagenUrl: 'https://placehold.co/400x300/00c853/ffffff?text=Etna+W13&font=roboto'
            },
            // ULTRABAT
            {
                idBateria: 6,
                nombre: 'Batería Ultrabat V-82 Gel',
                marca: 'Ultrabat',
                voltaje: '12',
                amperaje: '82',
                potenciaArranque: '750 CCA',
                precio: 450.00,
                precioAnterior: null,
                stockActual: 6,
                destacada: true,
                garantiaMeses: 24,
                imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+V-82+Gel&font=roboto'
            },
            {
                idBateria: 7,
                nombre: 'Batería Ultrabat S-96 Premium',
                marca: 'Ultrabat',
                voltaje: '12',
                amperaje: '96',
                potenciaArranque: '850 CCA',
                precio: 550.00,
                precioAnterior: null,
                stockActual: 5,
                destacada: true,
                garantiaMeses: 24,
                imagenUrl: 'https://placehold.co/400x300/9c27b0/ffffff?text=Ultrabat+S-96+Premium&font=roboto'
            },
            // VARTA
            {
                idBateria: 8,
                nombre: 'Batería Varta 27R V5',
                marca: 'Varta',
                voltaje: '12',
                amperaje: '75',
                potenciaArranque: '700 CCA',
                precio: 420.00,
                precioAnterior: null,
                stockActual: 12,
                destacada: true,
                garantiaMeses: 24,
                imagenUrl: 'https://placehold.co/400x300/e63946/ffffff?text=Varta+27R+V5&font=roboto'
            },
            // CAPSA
            {
                idBateria: 9,
                nombre: 'Batería Capsa 27R 1150',
                marca: 'Capsa',
                voltaje: '12',
                amperaje: '80',
                potenciaArranque: '750 CCA',
                precio: 400.00,
                precioAnterior: null,
                stockActual: 18,
                destacada: true,
                garantiaMeses: 18,
                imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+27R+1150&font=roboto'
            },
            {
                idBateria: 10,
                nombre: 'Batería Capsa 4D 1800',
                marca: 'Capsa',
                voltaje: '12',
                amperaje: '180',
                potenciaArranque: '1300 CCA',
                precio: 850.00,
                precioAnterior: 980.00,
                stockActual: 0,
                garantiaMeses: 24,
                imagenUrl: 'https://placehold.co/400x300/4caf50/ffffff?text=Capsa+4D+1800&font=roboto'
            }
        ];

        this.featuredProducts = products;
        ProductCard.renderGrid(products, 'products-grid');
        setTimeout(() => {
            ProductCard.checkStockAlerts(products);
        }, 1500);
    },

    setupVehicleFinder: function() {
        Navbar.setupVehicleSearch();
    },

    setupFAQ: function() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    },

    setupNewsletter: function() {
        const form = document.getElementById('newsletter-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            Toast.show('¡Te has suscrito correctamente!', 'success');
            form.reset();
        });
    }
};

window.HomePage = HomePage;