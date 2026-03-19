"use client";

import Dashboard from "@/src/pages/admin/dashboard/Dashboard";
import AdminPrivatePage from "@/components/routing/AdminPrivatePage";

export default function DashboardPage() {
  return (
    <AdminPrivatePage>
      <Dashboard />
    </AdminPrivatePage>
  );
}
