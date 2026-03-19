"use client";

import Edit from "@/src/pages/admin/users/Edit";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function UserEditPage() {
  return (
    <AdminProtectedPage module="Users" permission="edit">
      <Edit />
    </AdminProtectedPage>
  );
}
