"use client";

import Register from "@/src/pages/admin/auth/Register";
import AdminPublicPage from "@/components/routing/AdminPublicPage";

export default function RegisterPage() {
  return (
    <AdminPublicPage>
      <Register />
    </AdminPublicPage>
  );
}
