"use client";

import CreateModule from "@/src/pages/admin/modules/Create";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function ModuleCreatePage() {
  return (
    <AdminProtectedPage module="Modules" permission="create">
      <CreateModule />
    </AdminProtectedPage>
  );
}
