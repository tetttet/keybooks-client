"use client";

import React, { useState } from "react";
import { User } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { coverDesigns } from "@/constants/data";
import { useTranslations } from "next-intl";

const UserCreateBookCard: React.FC<{
  user: User;
  onCreated: (bookId: string) => void;
}> = ({ user, onCreated }) => {
  const { createBook, loading } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [design, setDesign] = useState(coverDesigns[0].name);
  const [busy, setBusy] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const t = useTranslations("All.step.stepTwo");

  const selectedCover = coverDesigns.find((c) => c.name === design);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setBusy(true);
      const payload = {
        title,
        author,
        bookcover: selectedCover?.image || "",
        user_id: user.id,
      };

      type CreatedBook = { id?: string; _id?: string };
      const created = (await createBook(payload)) as CreatedBook | undefined;
      const id = created?.id || created?._id || null;
      if (!id) throw new Error("CreateBook did not return created book id.");

      setSuccessId(id);
      onCreated(id);
      setTitle("");
      setAuthor("");
      setDesign(coverDesigns[0].name);
    } catch (err) {
      console.error(err);
      alert((err as Error)?.message || "Ошибка при создании книги");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex justify-center w-full px-0 lg:px-4">
      <div className="bg-gradient-to-b from-[#e0ebff] to-[#f4f7ff] p-0 lg:p-0 rounded-2xl w-full max-w-2xl">
        <div className="text-white rounded-xl p-6">
          <Card className="border-none mb-6 bg-gradient-to-r from-[#2a344c] to-[#222630] text-white shadow-2xl rounded-2xl">
            <CardContent className="flex flex-col items-center gap-6">
              {/* Превью */}
              <div className="w-64 h-96 relative rounded-md overflow-hidden shadow-lg bg-slate-950 flex items-center justify-center">
                {selectedCover ? (
                  <Image
                    src={selectedCover.image}
                    alt={design}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-gray-400">Нет превью</div>
                )}
              </div>

              {/* Форма */}
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-4 max-w-sm"
              >
                <div>
                  <label className="block mb-1 font-medium">
                    {t("bookName")}
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={t("bookPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("author")}</label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    placeholder={t("authorPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("designs")}</label>
                  <Select value={design} onValueChange={setDesign}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("designAlt")} />
                    </SelectTrigger>
                    <SelectContent>
                      {coverDesigns.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={loading || busy}
                    className="flex items-center bg-white text-black hover:bg-gray-100 px-6"
                  >
                    {loading || busy ? t("creating") : t("createABook")}
                  </Button>
                  {successId && (
                    <div className="text-sm text-green-400">
                      Книга создана (id: {successId})
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCreateBookCard;
