"use client";

import ViewModule from "@/src/pages/admin/modules/View";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function ModuleViewPage() {
  return (
    <AdminProtectedPage module="Modules" permission="view">
      <ViewModule />
    </AdminProtectedPage>
  );
}
