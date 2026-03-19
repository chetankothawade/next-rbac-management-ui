"use client";

import ResetPassword from "@/src/pages/admin/auth/ResetPassword";
import AdminPublicPage from "@/components/routing/AdminPublicPage";

export default function ResetPasswordPage() {
  return (
    <AdminPublicPage>
      <ResetPassword />
    </AdminPublicPage>
  );
}
