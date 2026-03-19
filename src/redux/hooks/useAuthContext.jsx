//src/redux/hooks/useAuthContext.js
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {useLocation } from "react-router-dom";

export const useAuthContext = () => {

  const auth = useSelector((state) => state.auth);

  // Memoize isClient to avoid recomputing on every render
  const location = useLocation();
  const isClient = useMemo(
     () => /^\/client(\/|$)/.test(location.pathname),
     [location.pathname]
   );

  // Memoize derived values to prevent unnecessary object recreation
  const authSlice = useMemo(() => (isClient ? auth.user : auth.admin), [auth, isClient]);
  const authUser = authSlice?.user ?? null;

  return {
    // context
    isClient,
    authType: isClient ? "client" : "admin",

    // auth state
    isAuthenticated: Boolean(authSlice?.token),

    // user object
    authUser,

    // normalized fields
    authUuid: authUser?.uuid ?? null,
    authUserName: authUser?.name ?? (isClient ? "Client" : "Admin"),
    authUserRole: authUser?.role ?? (isClient ? "client" : "admin"),
    authUserStatus: authUser?.status ?? null,
  };
};
