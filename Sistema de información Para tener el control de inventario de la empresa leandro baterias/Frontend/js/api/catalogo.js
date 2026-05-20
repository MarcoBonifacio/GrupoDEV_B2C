const CatalogoAPI = {
    getMarcas: async function() {
        return API.get('/catalogo/marcas');
    },

    getModelos: async function(idMarca) {
        return API.get(`/catalogo/modelos/${idMarca}`);
    },

    getAnios: async function(idModelo) {
        return API.get(`/catalogo/anios/${idModelo}`);
    },

    getBaterias: async function(params = {}) {
        return API.get('/catalogo/baterias', params);
    },

    getBateria: async function(id) {
        return API.get(`/catalogo/baterias/${id}`);
    },

    buscar: async function(query, filtros = {}) {
        return API.get('/catalogo/baterias/buscar', { q: query, ...filtros });
    },

    getMarcasConBaterias: async function() {
        return API.get('/catalogo/marcas/con-baterias');
    }
};

window.CatalogoAPI = CatalogoAPI;