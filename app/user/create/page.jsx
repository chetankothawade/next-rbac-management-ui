"use client";

import Create from "@/src/pages/admin/users/Create";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function UserCreatePage() {
  return (
    <AdminProtectedPage module="Users" permission="create">
      <Create />
    </AdminProtectedPage>
  );
}
