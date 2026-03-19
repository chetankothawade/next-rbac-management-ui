"use client";

import ModuleAccess from "@/src/pages/admin/modules/ModuleAccess";
import AdminPrivatePage from "@/components/routing/AdminPrivatePage";

export default function ModulePermissionUserPage() {
  return (
    <AdminPrivatePage>
      <ModuleAccess />
    </AdminPrivatePage>
  );
}
