//src/components/ProtectedRoute.js
//ProtectedRoute with only permission check and roleModules check
import React, { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchAccess } from "../redux/accessSlice";

const ProtectedRoute = ({ element, permission = "view", module }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const auth = useSelector((state) => state.auth);
  const access = useSelector((state) => state.access);

  const isClient = useMemo(
    () => /^\/client(\/|$)/.test(location.pathname),
    [location.pathname]
  );

  const userData = isClient ? auth.user : auth.admin;
  const { list, roleModules, loading, loaded, error } = access;

  useEffect(() => {
    if (userData?.user?.uuid && !loading && !loaded) {
      dispatch(fetchAccess(userData.user.uuid));
    }
  }, [dispatch, userData?.user?.uuid, loaded, loading]);

  if (loading || !loaded) return <Loader />;

  if (error) return <Navigate to="/forbidden" replace />;

  // ✅ Super admin bypass
  if (userData?.role === "super_admin") {
    return element;
  }

  // 🚫 ROLE CHECK FIRST
  if (!roleModules?.includes(module)) {
    return <Navigate to="/forbidden" replace />;
  }

  // 🚫 USER PERMISSION CHECK
  const hasPermission = list?.[module]?.includes(permission);

  if (!hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  return element;
};

export default ProtectedRoute;
