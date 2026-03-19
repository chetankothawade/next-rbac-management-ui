"use client";

import ListActivityLogs from "@/src/pages/admin/activityLogs/List";
import AdminProtectedPage from "@/components/routing/AdminProtectedPage";

export default function ActivityLogsPage() {
  return (
    <AdminProtectedPage module="Activity Logs" permission="view">
      <ListActivityLogs />
    </AdminProtectedPage>
  );
}
