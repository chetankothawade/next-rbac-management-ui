"use client";

import ModuleAccess from "@/src/pages/admin/modules/ModuleAccess";
import AdminPrivatePage from "@/components/routing/AdminPrivatePage";

export default function ModulePermissionPage() {
  return (
    <AdminPrivatePage>
      <ModuleAccess />
    </AdminPrivatePage>
  );
}
