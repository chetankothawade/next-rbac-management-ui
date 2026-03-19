"use client";

import Login from "@/src/pages/admin/auth/Login";
import AdminPublicPage from "@/components/routing/AdminPublicPage";

export default function LoginPage() {
  return (
    <AdminPublicPage>
      <Login />
    </AdminPublicPage>
  );
}
