"use client";

import React from "react";
import { UserResponse } from "@/context/ResponsesContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props {
  responses: UserResponse[];
  onDelete: (id: number) => void;
}

const ResponsesTable = ({ responses, onDelete }: Props) => {
  const t = useTranslations("User.ResponsesTable");

  if (responses.length === 0) {
    return <div className="p-4">{t("noBooks")}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("toWhom")}</TableHead>
            <TableHead>{t("questions")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.target}</TableCell>
              <TableCell>
                {r.answers.questions.map((q) => (
                  <div key={q.id}>
                    <strong>{q.question}</strong>: {q.answer || "—"}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm(t("confirmDelete"))) {
                      onDelete(r.id);
                    }
                  }}
                >
                  {t("delete")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsesTable;
