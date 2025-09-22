// src/app/[locale]/dashboard/layout.server.tsx (or just layout.tsx without "use client")
import type { Metadata } from "next";
import { ClientDashboard } from "./ClientDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function DashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientDashboard>{children}</ClientDashboard>
    </>
  );
}
