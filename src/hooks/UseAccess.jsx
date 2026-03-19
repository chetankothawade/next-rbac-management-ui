import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

/**
 * useAccess Hook
 * --------------------------------------------------
 * Purpose:
 * - Centralized permission check for modules & actions
 * - Works for both Admin and Client routes
 * - SSR-safe and React-Router aware
 *
 * @param {string} moduleName   Module key (e.g. "Clients", "Users")
 * @param {string} permission  Permission type (e.g. "view", "create")
 * @returns {boolean}          Whether access is granted
 */
const useAccess = (moduleName, permission) => {
  /* -----------------------------------------------
     Redux State Selection (IMPORTANT)
     -----------------------------------------------
     ❌ Never select entire state (state => state)
     ✅ Select only required slices to avoid
        unnecessary rerenders and route re-evaluation
  ------------------------------------------------ */
  const auth = useSelector((state) => state.auth);
  const access = useSelector((state) => state.access);

  /* -----------------------------------------------
     React Router Location
     -----------------------------------------------
     Used to detect whether current route
     belongs to client or admin section
  ------------------------------------------------ */
  const location = useLocation();

  /* -----------------------------------------------
     Detect Client Routes
     -----------------------------------------------*/
  const isClient = useMemo(
    () => /^\/client(\/|$)/.test(location.pathname),
    [location.pathname]
  );

  /* -----------------------------------------------
     Select Correct Auth Slice
     -----------------------------------------------
     - Client routes  → auth.user
     - Admin routes   → auth.admin
  ------------------------------------------------ */
  const userData = useMemo(
    () => (isClient ? auth?.user : auth?.admin),
    [auth, isClient]
  );

  /* -----------------------------------------------
     Normalize Access List
     -----------------------------------------------
     Backend modules may come as:
     {
       Clients: ["view", "create"],
       Users: ["edit"]
     }
     Normalize keys to lowercase for safe matching
  ------------------------------------------------ */
  const accessObj = useMemo(() => {
    const raw = access?.list || {};
    const normalized = {};

    Object.keys(raw).forEach((key) => {
      normalized[key.toLowerCase()] = raw[key];
    });

    return normalized;
  }, [access?.list]);

  /* -----------------------------------------------
     Final Permission Evaluation
     -----------------------------------------------
     Returns TRUE or FALSE
  ------------------------------------------------ */
  return useMemo(() => {
    // No user data yet → deny
    if (!userData) return false;

    // 🔑 Super/System admins bypass all permission checks
    if (["super_admin", "system_admin"].includes(userData?.role)) {
      return true;
    }

    // Access list not loaded yet → deny
    if (!Object.keys(accessObj).length) return false;

    // Normalize requested module name
    const moduleKey = moduleName?.toLowerCase();

    // Get permissions for module
    const modulePermissions = accessObj[moduleKey] || [];

    // Check if permission exists
    return modulePermissions.includes(permission);
  }, [userData, accessObj, moduleName, permission]);
};

export default useAccess;
