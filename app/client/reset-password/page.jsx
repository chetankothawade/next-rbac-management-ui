"use client";

import ResetPassword from "@/src/pages/user/auth/ResetPassword";
import ClientPublicPage from "@/components/routing/ClientPublicPage";

export default function ClientResetPasswordPage() {
  return (
    <ClientPublicPage>
      <ResetPassword />
    </ClientPublicPage>
  );
}
