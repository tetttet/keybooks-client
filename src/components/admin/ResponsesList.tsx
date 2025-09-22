"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useResponses } from "@/context/ResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponseTable from "./ResponseTable";
import { UserData, Response } from "@/lib/pdfUtils";
import { API_URL } from "@/constants/data";
import { useTranslations } from "next-intl";

const AllResponses: React.FC = () => {
  const t = useTranslations("Admin.AllResponses");
  const { responses, fetchAllResponses, deleteResponse } = useResponses();
  const [users, setUsers] = useState<Record<string, UserData>>({});

  const loadResponses = useCallback(async () => {
    await fetchAllResponses();
  }, [fetchAllResponses]);

  const loadUsers = useCallback(async () => {
    const uniqueUserIds = Array.from(new Set(responses.map((r) => r.user_id)));

    setUsers((prev) => {
      const toFetch = uniqueUserIds.filter((id) => !prev[id]);
      toFetch.forEach(async (id) => {
        try {
          const res = await fetch(`${API_URL}/users/public/${id}`);
          const data = await res.json();
          setUsers((p) => ({ ...p, [id]: data }));
        } catch {
          setUsers((p) => ({ ...p, [id]: { id, username: "—" } }));
        }
      });
      return prev;
    });
  }, [responses]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  useEffect(() => {
    if (responses.length > 0) loadUsers();
  }, [responses, loadUsers]);

  const handleDeleteResponse = async (id: number) => {
    const confirmed = window.confirm(t("confirmDelete"));
    if (!confirmed) return;

    await deleteResponse(id);
    await loadResponses();
  };

  return (
    <Card className="m-6 p-6 bg-gray-50 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponseTable
          responses={responses as Response[]}
          users={users}
          onDelete={handleDeleteResponse}
        />
      </CardContent>
    </Card>
  );
};

export default AllResponses;
