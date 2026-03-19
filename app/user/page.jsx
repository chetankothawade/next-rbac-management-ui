"use client";

import List from "@/src/pages/admin/users/List";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function UserListPage() {
  return (
    <AdminProtectedPage module="Users" permission="view">
      <List />
    </AdminProtectedPage>
  );
}
