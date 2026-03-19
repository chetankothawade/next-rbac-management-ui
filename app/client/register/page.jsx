"use client";

import Register from "@/src/pages/user/auth/Register";
import ClientPublicPage from "@/components/routing/ClientPublicPage";

export default function ClientRegisterPage() {
  return (
    <ClientPublicPage>
      <Register />
    </ClientPublicPage>
  );
}
