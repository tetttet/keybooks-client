// app/dashboard/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import LoginPage from "@/components/auth/Login";
import { AdminCard } from "@/components/admin/AdminCard";
import { UserCard } from "@/components/user/UserCard";
import CreateUser from "@/components/admin/CreateUser";
import CreateBook from "@/components/user/CreateBook";
import AllResponses from "@/components/admin/ResponsesList";
import { UserImagesForm } from "@/components/user/UserImagesForm";
import UserImageForm from "@/components/user/UserImageForm";

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
          <AllResponses />
        </>
      ) : (
        <>
          <UserCard user={user} logout={logout} />
          <CreateBook user={user} refreshUser={refreshUser} />
          <UserImageForm />
          <UserImagesForm />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
