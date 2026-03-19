"use client";

import Login from "@/src/pages/user/auth/Login";
import ClientPublicPage from "@/components/routing/ClientPublicPage";

export default function ClientLoginPage() {
  return (
    <ClientPublicPage>
      <Login />
    </ClientPublicPage>
  );
}
