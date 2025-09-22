"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useResponses } from "@/context/ResponsesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuestionsForm from "./QuestionsForm";
import ResponsesTable from "./ResponsesTable";
import { useTranslations } from "next-intl";

interface CreateBookProps {
  user: User;
  refreshUser: () => Promise<void>;
}

type TargetType =
  | "mother"
  | "father"
  | "girlfriend"
  | "boyfriend"
  | "colleague"
  | "friend"
  | "husband"
  | "wife"
  | "parents";

const TARGETS: TargetType[] = [
  "mother",
  "father",
  "girlfriend",
  "boyfriend",
  "colleague",
  "friend",
  "husband",
  "wife",
  "parents"
];

const CreateBook: React.FC<CreateBookProps> = ({ user, refreshUser }) => {
  const t = useTranslations("User.CreateBook");
  const { responses, fetchResponses, deleteResponse } = useResponses();
  const [target, setTarget] = useState<TargetType | null>(null);

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

  const handleBookCreated = async () => {
    await refreshUser();
    setTarget(null);
    await loadResponses();
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!target ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TARGETS.map((tgt) => (
                <Button
                  key={tgt}
                  onClick={() => setTarget(tgt)}
                  variant="outline"
                  className="w-full"
                >
                  {t(`targets.${tgt}`)}
                </Button>
              ))}
            </div>
          ) : (
            <QuestionsForm
              user={user}
              target={target}
              onClose={() => setTarget(null)}
              onCreated={handleBookCreated}
            />
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {t("remainingCredits")}
            </span>
            <Badge variant="secondary">{user.credit}</Badge>
          </div>
        </CardContent>
      </Card>

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
