"use client";

import RoleModuleAccess from "@/src/pages/admin/modules/RoleModuleAccess";
import AdminPrivatePage from "@/components/routing/AdminPrivatePage";

export default function RoleModulePermissionPage() {
  return (
    <AdminPrivatePage>
      <RoleModuleAccess />
    </AdminPrivatePage>
  );
}
