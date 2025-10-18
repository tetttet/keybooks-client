"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useBooks } from "@/context/BooksContext";
import { useUserResponses, Question } from "@/context/UserResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/context/AuthContext";
import { API_URL } from "@/constants/data";
import Image from "next/image";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

const AdminGallery = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { getBooks, fetchBooks } = useBooks();
  const { fetchResponses, getResponsesForBook } = useUserResponses();
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  // В хук usePDFGenerator теперь НЕ возвращается setPdfProgress
  const { pdfProgress, generatePDF, cancelPdf } = usePDFGenerator();

  // --- Загрузка пользователей ---
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/all`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadAllData();
  }, [fetchUsers]);

  // --- Загрузка книг пользователей ---
  useEffect(() => {
    const loadBooks = async () => {
      if (users.length === 0) return;
      setLoading(true);
      await Promise.all(users.map((u) => fetchBooks(u.id)));
      setLoading(false);
    };
    loadBooks();
  }, [users, fetchBooks]);

  // --- Загрузка ответов ---
  useEffect(() => {
    const loadResponses = async () => {
      if (users.length === 0) return;
      const allBooks = users.flatMap((u) => getBooks(u.id));
      if (allBooks.length === 0) return;
      await Promise.all(
        allBooks.map((book) => fetchResponses(book.user_id, book.id))
      );
    };
    loadResponses();
  }, [users, getBooks, fetchResponses]);

  // --- Пользователи без админов ---
  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .sort((a, b) => a.username.localeCompare(b.username));

  // --- Тогглы ---
  const toggleUser = (userId: string) =>
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));

  const toggleBook = (bookId: string) =>
    setExpandedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));

  // helper ETA format
  const formatSeconds = (s: number | null) => {
    if (s === null) return "--:--";
    const sec = Math.max(0, Math.round(s));
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const ss = (sec % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  // --- Состояние загрузки ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-gray-600 text-sm font-medium">
            Загрузка данных...
          </p>
        </div>
      </div>
    );
  }

  if (!filteredUsers.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Пользователи не найдены</p>
      </div>
    );
  }

  // --- Основной вывод ---
  return (
    <div className="space-y-6 p-6">
      {/* Модал прогресса PDF */}
      {pdfProgress.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-lg mx-4">
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Генерация PDF</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {pdfProgress.statusText} — {pdfProgress.processed}/
                    {pdfProgress.total}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{pdfProgress.percent}%</p>
                  <p className="text-xs text-gray-500">
                    ETA: {formatSeconds(pdfProgress.etaSeconds)}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
                  <div
                    style={{ width: `${pdfProgress.percent}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    {pdfProgress.canceled
                      ? "Отменено"
                      : `${pdfProgress.processed} из ${pdfProgress.total}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!pdfProgress.canceled && (
                      <button
                        onClick={cancelPdf}
                        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Отменить
                      </button>
                    )}
                    <button
                      onClick={() =>
                        // просто скрываем визуально, но не сбрасываем состояние хука
                        (pdfProgress.visible = false)
                      }
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      Скрыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredUsers.map((user) => {
        const userBooks = getBooks(user.id);

        return (
          <div key={user.id} className="border rounded-lg shadow-md">
            {/* Пользователь */}
            <button
              onClick={() => toggleUser(user.id)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold rounded-t-lg"
            >
              {user.username}{" "}
              <span className="text-sm text-gray-500">({user.role})</span>
            </button>

            {expandedUsers[user.id] && (
              <div className="p-4 space-y-4">
                {userBooks.length ? (
                  userBooks.map((book) => {
                    const bookResponses = getResponsesForBook(book.id);

                    return (
                      <div
                        key={book.id}
                        className="border rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between bg-gray-50 border-b rounded-t-lg">
                          <button
                            onClick={() => toggleBook(book.id)}
                            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 font-medium rounded-t-md"
                          >
                            {book.title} — {book.author}
                          </button>
                          <button
                            onClick={() => generatePDF(book.id, bookResponses)}
                            className="px-4 py-1 mr-4 bg-blue-600 whitespace-nowrap text-white rounded hover:bg-blue-700"
                          >
                            Скачать PDF
                          </button>
                        </div>

                        {expandedBooks[book.id] && (
                          <div className="p-3 space-y-3">
                            {book.bookcover && (
                              <Image
                                width={400}
                                height={300}
                                src={book.bookcover}
                                alt="Обложка книги"
                                className="w-full max-h-64 object-cover rounded-md mb-2"
                              />
                            )}
                            {bookResponses.length ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {bookResponses.map((response) => (
                                  <Card key={response.id} className="shadow-md">
                                    <CardHeader>
                                      <CardTitle className="text-lg font-semibold">
                                        Ответ: {response.target}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {response.answers.questions.map(
                                        (q: Question) => (
                                          <div
                                            key={q.id}
                                            className="mb-3 border-b pb-1"
                                          >
                                            <p className="font-medium">
                                              {q.question}
                                            </p>
                                            <p className="text-gray-700 mb-1">
                                              {q.answer}
                                            </p>
                                            {q.image_url && (
                                              <Image
                                                src={q.image_url}
                                                alt="question image"
                                                className="rounded-md w-full object-cover max-h-48"
                                                width={400}
                                                height={300}
                                              />
                                            )}
                                          </div>
                                        )
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">Ответов пока нет</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Книг пока нет</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminGallery;
