import "../src/index.css";

import LayoutRootState from "@/components/layout/LayoutRootState";
import AppProviders from "@/components/providers/AppProviders";
import { DEFAULT_LAYOUT_ATTRIBUTES } from "@/src/lib/layoutAttributes";

export const metadata = {
  title: "NACK",
  description: "Next.js migration of the existing React admin application.",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" {...DEFAULT_LAYOUT_ATTRIBUTES}>
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/icons.min.css" />
        <link rel="stylesheet" href="/assets/css/app.min.css" />
      </head>
      <body suppressHydrationWarning>
        <LayoutRootState />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
