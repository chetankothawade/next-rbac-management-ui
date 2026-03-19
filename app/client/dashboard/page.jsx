"use client";

import Dashboard from "@/src/pages/user/dashboard/Dashboard";
import ClientPrivatePage from "@/components/routing/ClientPrivatePage";

export default function ClientDashboardPage() {
  return (
    <ClientPrivatePage>
      <Dashboard />
    </ClientPrivatePage>
  );
}
