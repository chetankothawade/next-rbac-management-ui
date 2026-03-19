"use client";

import ForgotPassword from "@/src/pages/admin/auth/ForgotPassword";
import AdminPublicPage from "@/components/routing/AdminPublicPage";

export default function ForgotPasswordPage() {
  return (
    <AdminPublicPage>
      <ForgotPassword />
    </AdminPublicPage>
  );
}
