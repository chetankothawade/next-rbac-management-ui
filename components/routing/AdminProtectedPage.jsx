"use client";

import AdminPrivatePage from "./AdminPrivatePage";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function AdminProtectedPage({
  children,
  module,
  permission = "view",
}) {
  return (
    <AdminPrivatePage>
      <ProtectedRoute module={module} permission={permission} element={children} />
    </AdminPrivatePage>
  );
}
