// src/hooks/usePageTitle.js
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const APP_SUFFIX = " | Signature Tool";

/**
 * Central static + dynamic route titles
 */
const pageTitleConfig = [
  /** HOME & AUTH */
  { path: "/", title: "Signature Tool : Home" },
  { path: "/dashboard", title: "Admin : Dashboard" },

  { path: "/login", title: "Admin : Login" },
  { path: "/register", title: "Admin : Register" },
  { path: "/forgot-password", title: "Admin : Forgot Password" },
  { path: "/reset-password", title: "Admin : Reset Password" },

  /** USER ROUTES */
  { path: "/user", title: "Admin : User List" },
  { path: "/user/create", title: "Admin : Create User" },
  { path: /^\/user\/edit\/[a-zA-Z0-9-]+$/, title: "Admin : Edit User" },
  { path: /^\/user\/view\/[a-zA-Z0-9-]+$/, title: "Admin : View User" },
  { path: /^\/user\/profile\/[a-zA-Z0-9-]+$/, title: "Admin : User Profile" },

  /** MODULE ROUTES */
  { path: "/module", title: "Admin : Module List" },
  { path: /^\/module\/[a-zA-Z0-9-]+$/, title: "Admin : Module List" },
  { path: "/module/create", title: "Admin : Create Module" },
  { path: /^\/module\/edit\/[a-zA-Z0-9-]+$/, title: "Admin : Edit Module" },
  { path: /^\/module\/view\/[a-zA-Z0-9-]+$/, title: "Admin : View Module" },

  { path: "/module/permission", title: "Admin : Module Access" },
  { path: /^\/module\/permission\/[a-zA-Z0-9-]+$/, title: "Admin : Module Access" },


  { path: "/client/", title: "Signature Tool : Home" },
  { path: "/client/dashboard", title: "Dashboard" },
  { path: /^\/client\/profile\/[a-zA-Z0-9-]+$/, title: "Profile" },

  /** Invoice ROUTES */
  { path: "/client/invoice", title: "Invoice List" },
  { path: /^\/client\/invoice\/[a-zA-Z0-9-]+$/, title: "Invoice List" },
  { path: /^\/client\/invoice\/view\/[a-zA-Z0-9-]+$/, title: "View Invoice" },

  /** ERROR PAGES */
  { path: "/server_error", title: "Server Error" },
  { path: "/forbidden", title: "Access Forbidden" },
  { path: "*", title: "Page Not Found" },
];

/** Add suffix */
function formatTitle(baseTitle) {
  if (!baseTitle) return "Signature Tool";
  return baseTitle.endsWith(APP_SUFFIX) ? baseTitle : baseTitle + APP_SUFFIX;
}

/** Resolve title by matching route */
function resolvePageTitle(pathname, defaultTitle) {
  for (const entry of pageTitleConfig) {
    const { path, title } = entry;

    if (typeof path === "string" && path === pathname)
      return formatTitle(title);

    if (path instanceof RegExp && path.test(pathname))
      return formatTitle(title);
  }

  // Auto-fallback: "/clients/edit/uuid" → "Clients : Edit"
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return formatTitle(defaultTitle);

  const autoFormatted = segments
    .map((s) =>
      s
        .replace(/-/g, " ")
        .replace(/\d+/g, "")
        .trim()
    )
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" : ");

  return formatTitle(autoFormatted || defaultTitle);
}

/** Main Hook */
export default function usePageTitle(defaultTitle = "Signature Tool") {
  const { pathname } = useLocation();

  const pageTitle = useMemo(
    () => resolvePageTitle(pathname, defaultTitle),
    [pathname, defaultTitle]
  );

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
}
