"use client";
import React, { useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserCreateBook = ({
    user
}: {
    user: User;
}) => {
  const { createBook, loading } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookcover, setBookcover] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createBook({
      title,
      author,
      bookcover,
      user_id: user.id,
    });

    // очистка формы
    setTitle("");
    setAuthor("");
    setBookcover("");
  };

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Добавить книгу</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Название</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название книги"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Автор</label>
            <Input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Введите автора"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Обложка (URL)</label>
            <Input
              type="text"
              value={bookcover}
              onChange={(e) => setBookcover(e.target.value)}
              placeholder="Ссылка на изображение"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Создание..." : "Создать книгу"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserCreateBook;
