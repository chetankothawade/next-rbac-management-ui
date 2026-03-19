import http from "../utils/http";

const userService = {
  /**
   * List users with filters & pagination
   */
  list: (params = {}) => {
    return http.get("users", { params });
  },

  /**
   * Get a single user by ID
   */
  get: (id) => {
    return http.get(`users/${id}`);
  },

  /**
   * Create a new user
   */
  create: (data) => {
    return http.post("users", data);
  },

  /**
   * Update an existing user
   */
  update: (id, data) => {
    return http.put(`users/${id}`, data);
  },

  /**
   * Delete a user
   */
  delete: (id) => {
    return http.delete(`users/${id}`);
  },

  /**
   * Update only user status
   */
  updateStatus: (id, status) => {
    return http.put(`users/${id}/active`, { status });
  },

  /**
  * Get a client list
  */
  clientList: () => {
    return http.get(`clients/list`);
  },
};

export default userService;
