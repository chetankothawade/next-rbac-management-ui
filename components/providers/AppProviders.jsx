"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import store from "@/src/redux/store";
import { initAuth } from "@/src/redux/authSlice";
import { setupAxiosInterceptors } from "@/src/utils/setupAxiosInterceptors";
import "@/src/i18n";

let initialized = false;

function Bootstrapper() {
  useEffect(() => {
    if (initialized) {
      return;
    }

    initialized = true;
    store.dispatch(initAuth());
    setupAxiosInterceptors(store);
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <Bootstrapper />
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </Provider>
  );
}
