import "../src/index.css";

import AppProviders from "@/components/providers/AppProviders";

export const metadata = {
  title: "NACK",
  description: "Next.js migration of the existing React admin application.",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" data-layout="vertical" data-topbar="light" data-sidebar="light" data-sidebar-size="lg" data-sidebar-image="none" data-preloader="disable">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/icons.min.css" />
        <link rel="stylesheet" href="/assets/css/app.min.css" />
      </head>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
