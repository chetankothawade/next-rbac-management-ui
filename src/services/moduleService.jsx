import http from "../utils/http";

const moduleService = {
    /* -------------------------------------------------------------
       LIST MODULES  (with optional parentId)
       ------------------------------------------------------------- */
    list: (parentId = null, params = {}) => {
        const queryParams = new URLSearchParams({
            ...params,
            ...(parentId ? { parent_id: parentId } : {}),
        });

        return http.get(`modules?${queryParams.toString()}`);
    },

    /* -------------------------------------------------------------
       GET SINGLE MODULE
       ------------------------------------------------------------- */
    get: (id) => {
        return http.get(`modules/${id}`);
    },

    /* -------------------------------------------------------------
       CREATE MODULE
       ------------------------------------------------------------- */
    create: (data) => {
        return http.post("modules", data);
    },

    /* -------------------------------------------------------------
       UPDATE MODULE
       ------------------------------------------------------------- */
    update: (id, data) => {
        return http.put(`modules/${id}`, data);
    },

    /* -------------------------------------------------------------
       DELETE MODULE
       ------------------------------------------------------------- */
    delete: (id) => {
        return http.delete(`modules/${id}`);
    },

    /* -------------------------------------------------------------
       UPDATE STATUS (activate/inactivate)
       ------------------------------------------------------------- */
    updateStatus: (id, status) => {
        return http.put(`modules/${id}/active`, { status });
    },

    /* -------------------------------------------------------------
      GET  MODULE LIST
      ------------------------------------------------------------- */
    getList: () => {
        return http.get("modules/module/getList/");
    },

};

export default moduleService;
