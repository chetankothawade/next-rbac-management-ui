// src/components/LayoutWrapper.js
'use client'

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Layout components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Loader from "./Loader";
import RightSidebar from "./RightSidebar";

import useHeaderShadow from "../../../hooks/useHeaderShadow";
import useLayoutTheme from "../../../hooks/useLayoutTheme";
import usePermissionBootstrap from "../../../hooks/usePermissionBootstrap";
import useSidebarDismiss from "../../../hooks/useSidebarDismiss";

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

  /* ------------------------- Redux Hooks -------------------------- */

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

  const headerClass = useHeaderShadow();
  const { layoutMode, setLayoutMode } = useLayoutTheme();

  usePermissionBootstrap({
    token,
    userUuid,
    modulesLoaded,
    accessLoaded,
  });

  useSidebarDismiss(location.pathname);

  /**
   * Theme toggle handler (Light / Dark)
   */
  const onChangeLayoutMode = (mode) => {
    setLayoutMode(mode);
  };

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
