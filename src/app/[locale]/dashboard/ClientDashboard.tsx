// src/app/[locale]/dashboard/ClientDashboard.tsx
"use client";
import LoginPage from "@/components/auth/Login";
import { useAuth } from "@/context/AuthContext";
import { ImagesProvider } from "@/context/ImagesContext";
import { ResponsesProvider } from "@/context/ResponsesContext";

export function ClientDashboard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <div><LoginPage /></div>; // fallback пока загружается

  return (
    <ResponsesProvider>
      <ImagesProvider userId={user.id}>{children}</ImagesProvider>
    </ResponsesProvider>
  );
}
