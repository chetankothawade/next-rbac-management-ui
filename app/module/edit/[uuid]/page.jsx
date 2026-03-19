"use client";

import EditModule from "@/src/pages/admin/modules/Edit";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function ModuleEditPage() {
  return (
    <AdminProtectedPage module="Modules" permission="edit">
      <EditModule />
    </AdminProtectedPage>
  );
}
