const Storage = {
    KEY_CART: 'leandro_baterias_cart',
    KEY_FAVORITES: 'leandro_baterias_favorites',
    KEY_USER: 'leandro_baterias_user',
    KEY_COMPARE: 'leandro_baterias_compare',

    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },

    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    // Carrito
    getCart: function() {
        return this.get(this.KEY_CART) || [];
    },

    setCart: function(cart) {
        return this.set(this.KEY_CART, cart);
    },

    // Favoritos
    getFavorites: function() {
        return this.get(this.KEY_FAVORITES) || [];
    },

    setFavorites: function(favorites) {
        return this.set(this.KEY_FAVORITES, favorites);
    },

    // Usuario
    getUser: function() {
        return this.get(this.KEY_USER);
    },

    setUser: function(user) {
        return this.set(this.KEY_USER, user);
    },

    removeUser: function() {
        return this.remove(this.KEY_USER);
    },

    // Comparar
    getCompare: function() {
        return this.get(this.KEY_COMPARE) || [];
    },

    setCompare: function(compare) {
        return this.set(this.KEY_COMPARE, compare);
    }
};

window.Storage = Storage;