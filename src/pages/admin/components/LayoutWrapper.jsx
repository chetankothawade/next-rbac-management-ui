// src/components/LayoutWrapper.js
'use client'

import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Layout components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Loader from "./Loader";
import RightSidebar from "./RightSidebar";

// Redux actions
import { fetchModules } from "../../../redux/modulesSlice";
import { fetchAccess } from "../../../redux/accessSlice";

/**
 * LayoutWrapper
 * -------------------------------------------------------
 * Common layout wrapper for Admin & Client UI
 * - Handles layout structure (Header, Sidebar, Footer)
 * - Loads modules & access permissions
 * - Manages sidebar outside-click behavior
 * - Handles scroll-based header shadow
 * - Controls light / dark theme mode
 */
const LayoutWrapper = ({ children, loading = false }) => {
  const location = useLocation();

  /* ------------------------- Local State ------------------------- */

  // Header shadow class on scroll
  const [headerClass, setHeaderClass] = useState("");

  // Theme mode (light / dark)
  const layoutModeTypes = {
    LIGHTMODE: "light",
    DARKMODE: "dark",
  };

  const [layoutMode, setLayoutMode] = useState(layoutModeTypes.LIGHTMODE);

  /* ------------------------- Redux Hooks -------------------------- */

  const dispatch = useDispatch();

  // Auth state (admin / client)
  const auth = useSelector((state) => state.auth);

  // Module & access loading flags
  const modulesLoaded = useSelector((state) => state.modules.loaded);
  const accessLoaded = useSelector((state) => state.access.loaded);

  /* ---------------------- User Context ---------------------------- */

  // Detect whether current UI is Client or Admin
  // Example URL: /client/dashboard
  // Memoize isClient to avoid recomputing on every render
  const isClient = useMemo(
    () => /^\/client(\/|$)/.test(location.pathname),
    [location.pathname]
  );
  // Memoize derived values to prevent unnecessary object recreation
  const userData = useMemo(() => (isClient ? auth?.user : auth?.admin), [auth, isClient]);

  const token = userData?.token;
  const userUuid = userData?.user?.uuid;

  /* ------------------- Load Modules & Access ---------------------- */

  /**
   * Fetch application modules and access permissions
   * Runs only when:
   * - token & user UUID are available
   * - modules / access are not already loaded
   */
  useEffect(() => {
    if (!token) return;

    if (!modulesLoaded) {
      dispatch(fetchModules());
    }

    if (userUuid && !accessLoaded) {
      dispatch(fetchAccess(userUuid));
    }
  }, [dispatch, token, userUuid, modulesLoaded, accessLoaded]);

  /* ---------------- Sidebar Outside Click Handler ---------------- */

  /**
   * Close sidebar when clicking outside sidebar
   * (Except hamburger menu button)
   */
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

  /**
   * Register & cleanup outside click listener
   */
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  /* -------------------- Header Scroll Effect ---------------------- */

  /**
   * Adds shadow to header when page scrolls down
   */

  const scrollNavigation = () => {
    const scrollTop = document.documentElement.scrollTop;
    setHeaderClass(scrollTop > 50 ? "topbar-shadow" : "");
  };


  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
    return () =>
      window.removeEventListener("scroll", scrollNavigation, true);
  }, []);


  /* ----------------------- Theme Handling ------------------------- */

  /**
   * Apply theme mode to <html> tag
   * and persist in sessionStorage
   */
  useEffect(() => {
    const savedMode =
      sessionStorage.getItem("data-layout-mode") || layoutModeTypes.LIGHTMODE;
    setLayoutMode(savedMode);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-layout-mode", layoutMode);
    sessionStorage.setItem("data-layout-mode", layoutMode);
  }, [layoutMode]);

  /**
   * Theme toggle handler (Light / Dark)
   */
  const onChangeLayoutMode = (mode) => {
    setLayoutMode(mode);
  };

  /* -------------------- SIDEBAR HANDLING ON MOBILE/TAB---------------------- */
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 1025) {
      document.body.classList.remove("vertical-sidebar-enable");
    }
  }, [location.pathname]);


  /* --------------------------- Render ----------------------------- */

  return (
    <>
      <div id="layout-wrapper">
        {/* Header */}
        <Header
          headerClass={headerClass}
          layoutMode={layoutMode}
          onChangeLayoutMode={onChangeLayoutMode}
        />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              {loading ? <Loader /> : children}
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Right Sidebar (Settings / Theme Panel) */}
      <RightSidebar />
    </>
  );
};

export default LayoutWrapper;
