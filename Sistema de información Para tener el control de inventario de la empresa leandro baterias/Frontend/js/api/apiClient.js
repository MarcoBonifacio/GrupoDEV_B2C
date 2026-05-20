const API = {
    baseUrl: 'http://localhost:5000/api/v1',
    timeout: 30000,

    headers: function() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const user = Storage.getUser();
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }
        return headers;
    },

    request: async function(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                ...this.headers(),
                ...options.headers
            },
            timeout: this.timeout
        };

        if (options.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(options.body);
        }

        if (options.queryParams) {
            const params = new URLSearchParams(options.queryParams);
            url += `?${params.toString()}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data
                    }
                };
            }

            return data;
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new Error('La solicitud ha expirado. Por favor, inténtalo de nuevo.');
            }
            if (error.name === 'AbortError') {
                throw new Error('La solicitud fue cancelada.');
            }
            throw error;
        }
    },

    get: function(endpoint, queryParams) {
        return this.request(endpoint, { method: 'GET', queryParams });
    },

    post: function(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    },

    put: function(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    },

    delete: function(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Métodos especiales para archivos
    upload: async function(endpoint, file, fieldName = 'file') {
        const formData = new FormData();
        formData.append(fieldName, file);

        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Storage.getUser()?.token || ''}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw { response: { status: response.status, data } };
        }
        return data;
    }
};

window.API = API;