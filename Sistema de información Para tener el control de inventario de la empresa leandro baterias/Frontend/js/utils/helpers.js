const Helpers = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    getQueryParam: function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    setQueryParams: function(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    },

    getBaseUrl: function() {
        return window.location.origin + '/api/v1';
    },

    getCurrentPage: function() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    },

    isMobile: function() {
        return window.innerWidth <= 768;
    },

    isTablet: function() {
        return window.innerWidth > 768 && window.innerWidth <= 992;
    },

    isDesktop: function() {
        return window.innerWidth > 992;
    },

    scrollTo: function(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    fadeIn: function(element, duration = 300) {
        element.style.display = 'block';
        element.style.opacity = '0';
        let start = null;
        window.requestAnimationFrame(function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            element.style.opacity = opacity;
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            }
        });
    },

    fadeOut: function(element, duration = 300) {
        element.style.opacity = '1';
        let start = null;
        window.requestAnimationFrame(function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - progress / duration, 0);
            element.style.opacity = opacity;
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        });
    },

    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    slugify: function(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    truncate: function(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    parseJSON: function(str, defaultValue = null) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    },

    getErrorMessage: function(error) {
        if (error.response && error.response.data && error.response.data.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
        return 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    },

    arrayUnique: function(array) {
        return [...new Set(array)];
    },

    groupBy: function(array, key) {
        return array.reduce((result, item) => {
            const group = typeof key === 'function' ? key(item) : item[key];
            (result[group] = result[group] || []).push(item);
            return result;
        }, {});
    },

    sortBy: function(array, key, order = 'asc') {
        return array.sort((a, b) => {
            const aVal = typeof key === 'function' ? key(a) : a[key];
            const bVal = typeof key === 'function' ? key(b) : b[key];
            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }
};

window.Helpers = Helpers;