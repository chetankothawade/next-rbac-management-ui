"use client";

import Profile from "@/src/pages/admin/users/Profile";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function UserProfilePage() {
  return (
    <AdminProtectedPage module="Users" permission="view">
      <Profile />
    </AdminProtectedPage>
  );
}
