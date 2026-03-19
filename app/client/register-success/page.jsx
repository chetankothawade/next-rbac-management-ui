"use client";

import RegisterSuccess from "@/src/pages/user/auth/RegisterSuccess";
import ClientPublicPage from "@/components/routing/ClientPublicPage";

export default function ClientRegisterSuccessPage() {
  return (
    <ClientPublicPage>
      <RegisterSuccess />
    </ClientPublicPage>
  );
}
