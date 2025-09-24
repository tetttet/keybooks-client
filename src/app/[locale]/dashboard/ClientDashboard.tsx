// src/app/[locale]/dashboard/ClientDashboard.tsx
"use client";
import LoginPage from "@/components/auth/Login";
import { useAuth } from "@/context/AuthContext";
import { BooksProvider } from "@/context/BooksContext";
import { ImagesProvider } from "@/context/ImagesContext";
import { ResponsesProvider } from "@/context/ResponsesContext";
import { UserResponsesProvider } from "@/context/UserResponsesContext";

export function ClientDashboard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user)
    return (
      <div>
        <LoginPage />
      </div>
    ); // fallback пока загружается

  return (
    <ResponsesProvider>
      <BooksProvider>
        <UserResponsesProvider>
          <ImagesProvider userId={user.id}>{children}</ImagesProvider>
        </UserResponsesProvider>
      </BooksProvider>
    </ResponsesProvider>
  );
}
