"use client";

import { useSelector } from "react-redux";

import Loader from "@/src/components/Loader";
import { PrivateRoute } from "@/src/components/PrivateRoute";

export default function AdminPrivatePage({ children }) {
  const { admin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <PrivateRoute
      isAuthenticated={Boolean(admin?.token)}
      redirectTo="/login"
      element={children}
    />
  );
}
