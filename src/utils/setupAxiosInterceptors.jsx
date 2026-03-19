import toast from "react-hot-toast";
import http from "./http";

let toastShown = false;
let interceptorsConfigured = false;
const showToastOnce = (message) => {
  if (!toastShown) {
    toastShown = true;
    toast.error(message);
    setTimeout(() => (toastShown = false), 3000);
  }
};

export const setupAxiosInterceptors = (store) => {
  if (interceptorsConfigured) {
    return;
  }

  interceptorsConfigured = true;

  // REQUEST
  http.interceptors.request.use(
    (config) => {
      const state = store.getState();

      const adminToken = state.auth?.admin?.token;
      const clientToken = state.auth?.user?.token;

      const token = adminToken || clientToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          showToastOnce(data?.message || "Unauthorized. Please login again.");
        }

        if (status === 403) {
          showToastOnce("Forbidden. No access rights.");
        }

        if (status >= 500) {
          showToastOnce("Server error. Try again later.");
        }
      } else {
        showToastOnce("Network error. Check your connection.");
      }

      return Promise.reject(error);
    }
  );
};
