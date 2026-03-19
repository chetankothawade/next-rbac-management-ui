"use client";

import View from "@/src/pages/admin/users/View";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function UserViewPage() {
  return (
    <AdminProtectedPage module="Users" permission="view">
      <View />
    </AdminProtectedPage>
  );
}
