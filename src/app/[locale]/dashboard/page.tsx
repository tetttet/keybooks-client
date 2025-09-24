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
import { useLocale } from "next-intl";

const DashboardPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const locale = useLocale();

  const text =
    locale === "en"
      ? `
  You have no credits left.
  `
      : `
  Kredit anda telah habis.
  `;

  const upperText =
    locale === "en"
      ? `
  You have successfully completed the survey.
  `
      : `
  Anda telah berjaya menyelesaikan tinjauan.
  `;

  const lowerText =
    locale === "en"
      ? ` 
      Please contact your administrator to top up your credits or upgrade your plan.
  `
      : `
      Sila hubungi pentadbir anda untuk menambah kredit atau mengemas kini pelan anda.
  `;

  console.log("Current user:", user);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="py-20 bg-gradient-to-b from-[#080e20] to-[#0f1729] p-4 h-[90vh] overflow-auto">
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
              {/* <UserBooksGallery user_id={user.id} /> */}
            </>
          ) : (
            <>
              {/* <div className="mt-4 p-4 ml-6 mr-6 bg-green-200 text-green-800 rounded-2xl">
              {upperText}
            </div> */}
              <div className="flex p-6">
                <div
                  className="-mt-8 p-4 bg-red-200 text-red-800 rounded-2xl 
                w-full sm:w-[78%] md:w-[74%] lg:w-[80%] xl:w-[55%]"
                >
                  <span className="text-[14px] sm:text-[15px] lg:text-[16px]">
                    {upperText}
                  </span>
                  <br />
                  <span className="text-[14px] sm:text-[15px] lg:text-[16px]">
                    {lowerText}
                  </span>
                  <br />
                  <span className="text-[14px] sm:text-[15px] lg:text-[16px]">
                    {text}
                  </span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
