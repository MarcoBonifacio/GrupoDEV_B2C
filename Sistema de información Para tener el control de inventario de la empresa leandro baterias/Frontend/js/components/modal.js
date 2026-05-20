const Modal = {
    element: null,
    body: null,
    closeBtn: null,

    init: function() {
        this.element = document.getElementById('modal');
        this.body = document.getElementById('modal-body');
        this.closeBtn = this.element?.querySelector('.modal-close');

        this.closeBtn?.addEventListener('click', () => this.close());

        this.element?.addEventListener('click', (e) => {
            if (e.target === this.element) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.element.classList.contains('hidden')) {
                this.close();
            }
        });
    },

    open: function(content, options = {}) {
        if (!this.element || !this.body) return;

        this.body.innerHTML = content;
        this.element.classList.remove('hidden');

        if (options.onOpen && typeof options.onOpen === 'function') {
            options.onOpen();
        }
    },

    close: function() {
        if (!this.element) return;
        this.element.classList.add('hidden');
    },

    showLoading: function(message = 'Cargando...') {
        this.open(`
            <div style="text-align: center; padding: 40px;">
                <div class="spinner" style="margin: 0 auto 20px;"></div>
                <p>${message}</p>
            </div>
        `);
    },

    showAlert: function(type, title, message) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        this.open(`
            <div class="alert alert-${type}" style="margin: 0;">
                <i class="fas fa-${icons[type]} alert-icon"></i>
                <div class="alert-content">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="Modal.close()">Aceptar</button>
            </div>
        `);
    },

    showConfirm: function(title, message, onConfirm) {
        this.open(`
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-question-circle" style="font-size: 64px; color: var(--primary-color); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">${title}</h3>
                <p style="color: var(--text-medium); margin-bottom: 30px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="btn btn-outline" onclick="Modal.close()">Cancelar</button>
                    <button class="btn btn-primary" id="confirm-btn">Confirmar</button>
                </div>
            </div>
        `);

        document.getElementById('confirm-btn')?.addEventListener('click', () => {
            onConfirm();
            this.close();
        });
    }
};

const Toast = {
    container: null,

    init: function() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show: function(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();

        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        this.container.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });

        setTimeout(() => {
            this.remove(toast);
        }, duration);
    },

    remove: function(toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }
};

// Agregar animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

window.Modal = Modal;
window.Toast = Toast;