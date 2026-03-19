"use client";

import { useSelector } from "react-redux";

import Loader from "@/src/components/Loader";
import { PrivateRoute } from "@/src/components/PrivateRoute";

export default function ClientPrivatePage({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <PrivateRoute
      isAuthenticated={Boolean(user?.token)}
      redirectTo="/client/login"
      element={children}
    />
  );
}
