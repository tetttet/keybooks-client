"use client";

import { useEffect, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useResponses } from "@/context/ResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsesTable from "./ResponsesTable";
import { useTranslations } from "next-intl";

interface CreateBookProps {
  user: User;
  refreshUser: () => Promise<void>;
}

const CreateBook: React.FC<CreateBookProps> = ({ user, refreshUser }) => {
  const t = useTranslations("User.CreateBook");
  const { responses, fetchResponses, deleteResponse } = useResponses();

  const loadResponses = useCallback(async () => {
    await fetchResponses(user.id);
  }, [user.id, fetchResponses]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  const handleDeleteResponse = async (id: number) => {
    await deleteResponse(id);
    await refreshUser();
  };

  if (user.credit <= 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 font-medium">{t("noCredits")}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="gap-6 p-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>{t("yourBooks")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsesTable
            responses={responses}
            onDelete={handleDeleteResponse}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBook;
