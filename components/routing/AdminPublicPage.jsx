"use client";

import { useSelector } from "react-redux";

import Loader from "@/src/components/Loader";
import { PublicRoute } from "@/src/components/PublicRoute";

export default function AdminPublicPage({ children }) {
  const { admin, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <PublicRoute
      isAuthenticated={Boolean(admin?.token)}
      redirectTo="/dashboard"
      element={children}
    />
  );
}
