// components/dashboard/AdminCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AdminCardProps {
  username: string;
  logout: () => void;
}

export const AdminCard: React.FC<AdminCardProps> = ({ username, logout }) => {
  const t = useTranslations("Admin.AdminCard");

  return (
    <div className="flex justify-start p-6">
      <Card className="bg-white text-black shadow-lg w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("title")}</CardTitle>
          <CardDescription className="text-gray-600">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-800">
            {t("welcome", { username })}
          </p>
          <Button className="w-full mb-3">{t("dashboardBtn")}</Button>
          <Button variant="outline" className="w-full" onClick={logout}>
            {t("logoutBtn")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
