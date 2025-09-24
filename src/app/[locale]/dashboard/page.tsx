// app/dashboard/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import LoginPage from "@/components/auth/Login";
import { AdminCard } from "@/components/admin/AdminCard";
import { UserCard } from "@/components/user/UserCard";
import CreateUser from "@/components/admin/CreateUser";
import AllResponses from "@/components/admin/ResponsesList";
import CreateFlow from "@/components/create/CreateFlow";
import UserBooksGallery from "@/components/UserBooksGallery";
import AdminGallery from "@/components/AdminGallery";

const DashboardPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  console.log("Current user:", user);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="py-20 bg-gray-600 p-4">
      {user.role === "admin" ? (
        <>
          <AdminCard username={user.username} logout={logout} />
          <CreateUser />
          <AdminGallery />
        </>
      ) : (
        <>
          <UserCard user={user} logout={logout} />
          {user.credit > 0 ? (
            <>
              <CreateFlow user={user} refreshUser={refreshUser} />
              <UserBooksGallery user_id={user.id} />
            </>
          ) : (
            <div className="mt-4 p-4 bg-red-200 text-red-800 rounded">
              У вас нет доступных кредитов. Пожалуйста, свяжитесь с администратором для пополнения.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
