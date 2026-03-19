"use client";

import ForgotPassword from "@/src/pages/user/auth/ForgotPassword";
import ClientPublicPage from "@/components/routing/ClientPublicPage";

export default function ClientForgotPasswordPage() {
  return (
    <ClientPublicPage>
      <ForgotPassword />
    </ClientPublicPage>
  );
}
