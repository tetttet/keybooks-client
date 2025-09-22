"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Response, UserData, downloadResponsePDF } from "@/lib/pdfUtils";
import { API_URL } from "@/constants/data";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  responses: Response[];
  users: Record<string, UserData>;
  onDelete: (id: number) => void;
}

const ResponseTable: React.FC<Props> = ({ responses, users, onDelete }) => {
  const t = useTranslations("Admin.ResponseTable");
  const [userImages, setUserImages] = React.useState<
    Record<string, { url: string; description?: string }[]>
  >({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (responses.length === 0) return;

    const uniqueUserIds = Array.from(new Set(responses.map((r) => r.user_id)));

    const toFetch = uniqueUserIds.filter((id) => !userImages[id]);
    if (toFetch.length === 0) return;

    setLoading(true);

    Promise.all(
      toFetch.map(async (userId) => {
        try {
          const res = await fetch(`${API_URL}/images?userId=${userId}`);
          const data = await res.json();
          return { userId, images: data.images || [] };
        } catch (err) {
          console.error(err);
          return { userId, images: [] };
        }
      })
    ).then((results) => {
      setUserImages((prev) => {
        const updated = { ...prev };
        results.forEach(({ userId, images }) => {
          updated[userId] = images;
        });
        return updated;
      });
      setLoading(false);
    });
  }, [responses, userImages]);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border border-gray-200">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="font-medium">{t("user")}</TableCell>
            <TableCell className="font-medium">{t("target")}</TableCell>
            <TableCell className="font-medium">{t("questions")}</TableCell>
            <TableCell className="font-medium text-center">
              {t("images")}
            </TableCell>
            <TableCell className="font-medium text-center">
              {t("actions")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {responses.map((r) => (
            <TableRow key={r.id} className="hover:bg-gray-50">
              <TableCell>
                {users[r.user_id]?.username || t("loading")}
              </TableCell>
              <TableCell>{r.target}</TableCell>
              <TableCell className="space-y-1">
                {r.answers.questions.map((q) => (
                  <div key={q.id}>
                    <strong>{q.question}</strong>: {q.answer || "—"}
                  </div>
                ))}
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                {loading && !userImages[r.user_id] ? (
                  <span>{t("loading")}</span>
                ) : userImages[r.user_id]?.length > 0 ? (
                  userImages[r.user_id].map((img, idx) => {
                    let src = img.url;
                    let alt = img.description || `Image ${idx + 1}`;

                    if (img.url.includes("docs.google.com")) {
                      src = "/google-docs-logo.png";
                      alt = "Google Docs";
                    } else if (img.url.includes("drive.google.com")) {
                      src = "/google-drive-logo.png";
                      alt = "Google Drive";
                    }
                    return (
                      <a
                        key={idx}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          width={200}
                          height={200}
                          src={src}
                          alt={alt}
                          className="w-40 h-40 object-cover rounded"
                        />
                      </a>
                    );
                  })
                ) : (
                  <span>{t("noImages")}</span>
                )}
              </TableCell>

              <TableCell className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(r.id)}
                >
                  {t("delete")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadResponsePDF(r, users)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {t("downloadPDF")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponseTable;
