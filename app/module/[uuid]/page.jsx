"use client";

import ListModule from "@/src/pages/admin/modules/List";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function SubModuleListPage() {
  return (
    <AdminProtectedPage module="Modules" permission="view">
      <ListModule />
    </AdminProtectedPage>
  );
}
