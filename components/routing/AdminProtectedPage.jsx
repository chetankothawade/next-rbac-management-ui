"use client";

import AdminPrivatePage from "./AdminPrivatePage";
import ProtectedRoute from "@/src/components/ProtectedRoute";

// UI-only admin guard. This controls client rendering and redirects,
// but backend endpoints must enforce the same access rules independently.
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
