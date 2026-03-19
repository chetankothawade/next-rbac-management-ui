"use client";

import { useCallback, useEffect } from "react";

export default function useSidebarDismiss(pathname) {
  const handleOutsideClick = useCallback((event) => {
    const sidebar = document.querySelector(".app-menu");
    const hamburger = document.querySelector("#topnav-hamburger-icon");

    const sidebarOpen = document.body.classList.contains(
      "vertical-sidebar-enable"
    );

    if (!sidebarOpen) return;

    const insideSidebar = sidebar?.contains(event.target);
    const clickedHamburger = hamburger?.contains(event.target);

    if (!insideSidebar && !clickedHamburger) {
      document.body.classList.remove("vertical-sidebar-enable");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    if (window.innerWidth < 1025) {
      document.body.classList.remove("vertical-sidebar-enable");
    }
  }, [pathname]);
}
