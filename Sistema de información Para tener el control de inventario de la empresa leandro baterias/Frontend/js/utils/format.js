const Format = {
    currency: function(amount, currency = 'PEN', locale = 'es-PE') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    number: function(value, decimals = 0, locale = 'es-PE') {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },

    percentage: function(value, decimals = 0) {
        return `${this.number(value, decimals)}%`;
    },

    date: function(date, format = 'short', locale = 'es-PE') {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const options = {
            short: { day: '2-digit', month: '2-digit', year: 'numeric' },
            medium: { day: 'numeric', month: 'long', year: 'numeric' },
            long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            full: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        };

        return new Intl.DateTimeFormat(locale, options[format] || options.short).format(d);
    },

    timeAgo: function(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} minutos`;
        if (diffHours < 24) return `Hace ${diffHours} horas`;
        if (diffDays < 7) return `Hace ${diffDays} días`;
        return this.date(date, 'short');
    },

    phone: function(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 9) {
            return `+51 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
        }
        if (cleaned.length === 11) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
        }
        return phone;
    },

    document: function(doc, type) {
        if (type === 'DNI') {
            return doc.replace(/(\d{4})(\d{5})/, '$1 $2');
        }
        if (type === 'RUC') {
            return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1 $2 $3 $4');
        }
        return doc;
    },

    capitalize: function(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    capitalizeWords: function(str) {
        if (!str) return '';
        return str.split(' ').map(word => this.capitalize(word)).join(' ');
    },

    truncate: function(str, length = 100, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length).trim() + suffix;
    },

    slug: function(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    fileSize: function(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    creditCard: function(cardNumber) {
        if (!cardNumber) return '';
        const cleaned = cardNumber.replace(/\s/g, '');
        const last4 = cleaned.slice(-4);
        return `**** **** **** ${last4}`;
    },

    orderNumber: function(id) {
        return `LB-${String(id).padStart(8, '0')}`;
    },

    invoiceNumber: function(serie, numero) {
        return `${serie}-${String(numero).padStart(8, '0')}`;
    }
};

window.Format = Format;