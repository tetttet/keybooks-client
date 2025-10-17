"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useBooks } from "@/context/BooksContext";
import jsPDF from "jspdf";
import { useUserResponses, Question } from "@/context/UserResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/context/AuthContext";
import { API_URL } from "@/constants/data";
import Image from "next/image";

type PDFProgress = {
  visible: boolean;
  percent: number;
  processed: number;
  total: number;
  etaSeconds: number | null;
  statusText?: string;
  canceled?: boolean;
};

const AdminGallery = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { getBooks, fetchBooks } = useBooks();
  const { responses, fetchResponses } = useUserResponses();
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  // progress state
  const [pdfProgress, setPdfProgress] = useState<PDFProgress>({
    visible: false,
    percent: 0,
    processed: 0,
    total: 0,
    etaSeconds: null,
    statusText: "",
    canceled: false,
  });

  // cancellation flag
  const cancelRef = useRef({ canceled: false });

  // --- Загрузка всех пользователей ---
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

  // --- Загрузка книг всех пользователей (один раз, параллельно) ---
  useEffect(() => {
    const loadBooks = async () => {
      if (users.length === 0) return;
      setLoading(true);
      await Promise.all(users.map((u) => fetchBooks(u.id)));
      setLoading(false);
    };
    loadBooks();
  }, [users, fetchBooks]);

  // --- Загрузка ответов всех книг всех пользователей ---
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

  // --- Фильтрация пользователей без админов ---
  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .sort((a, b) => a.username.localeCompare(b.username));

  // --- Тогглы ---
  const toggleUser = (userId: string) =>
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));

  const toggleBook = (bookId: string) =>
    setExpandedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));

  // helper: формат ETA seconds -> mm:ss
  const formatSeconds = (s: number | null) => {
    if (s === null) return "--:--";
    const sec = Math.max(0, Math.round(s));
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const ss = (sec % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  // helper: load image with timeout, return dataURL or null
  const loadImageToDataUrl = (
    src: string,
    timeout = 8000
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      let done = false;
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.src = src;

      const timer = window.setTimeout(() => {
        if (done) return;
        done = true;
        resolve(null); // timeout -> treat as missing
      }, timeout);

      img.onload = () => {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/png");
          resolve(imgData);
        } catch (err) {
          console.error("Canvas conversion failed", err);
          resolve(null);
        }
      };

      img.onerror = () => {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(null);
      };
    });
  };

  // --- Генерация PDF с прогресс-баром и отменой ---
  const generatePDF = async (bookId: string) => {
    cancelRef.current = { canceled: false };
    setPdfProgress({
      visible: true,
      percent: 0,
      processed: 0,
      total: 0,
      etaSeconds: null,
      statusText: "Подсчитываем элементы...",
      canceled: false,
    });

    // collect responses for this book
    const bookResponses = responses.filter((r) => r.book_id === bookId);
    // guard
    if (!bookResponses.length) {
      setPdfProgress((p) => ({
        ...p,
        statusText: "Нет ответов для этого тома",
        visible: true,
      }));
      setTimeout(() => setPdfProgress((p) => ({ ...p, visible: false })), 1600);
      return;
    }

    // compute total steps: target string + each question text + each answer text + each image
    let totalSteps = 0;
    for (const r of bookResponses) {
      totalSteps += 1; // target line
      for (const q of r.answers.questions) {
        totalSteps += 2; // question + answer
        if (q.image_url) totalSteps += 1; // image is another step
      }
      totalSteps += 1; // small gap/separator
    }

    setPdfProgress((p) => ({
      ...p,
      total: totalSteps,
      statusText: "Генерация PDF...",
      processed: 0,
      percent: 0,
    }));

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = 190;
    let y = 10;

    const startTime = performance.now();
    let processed = 0;

    const updateProgress = (increment = 1, statusText?: string) => {
      processed += increment;
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;
      const avgPerStep = processed > 0 ? elapsedSec / processed : 0;
      const remaining = Math.max(0, totalSteps - processed);
      const eta = remaining * avgPerStep;
      const percent = Math.min(100, Math.round((processed / totalSteps) * 100));
      setPdfProgress({
        visible: true,
        percent,
        processed,
        total: totalSteps,
        etaSeconds: isFinite(eta) ? eta : null,
        statusText: statusText ?? "Генерация PDF...",
        canceled: cancelRef.current.canceled,
      });
    };

    try {
      // loop responses synchronously to allow progress and cancellation
      for (const r of bookResponses) {
        if (cancelRef.current.canceled) break;

        // target
        doc.setFontSize(12);
        const targetLines = doc.splitTextToSize(
          `Ответ: ${r.target}`,
          pageWidth
        );
        doc.text(targetLines, 10, y);
        y += targetLines.length * 6 + 2;
        updateProgress(1);

        for (const q of r.answers.questions) {
          if (cancelRef.current.canceled) break;

          doc.setFontSize(10);

          // question
          const questionLines = doc.splitTextToSize(
            `Вопрос: ${q.question}`,
            pageWidth
          );
          if (y + questionLines.length * 5 > 290) {
            doc.addPage();
            y = 10;
          }
          doc.text(questionLines, 10, y);
          y += questionLines.length * 5 + 2;
          updateProgress(1);

          if (cancelRef.current.canceled) break;

          // answer
          const answerLines = doc.splitTextToSize(
            `Ответ: ${q.answer}`,
            pageWidth
          );
          if (y + answerLines.length * 5 > 290) {
            doc.addPage();
            y = 10;
          }
          doc.text(answerLines, 10, y);
          y += answerLines.length * 5 + 2;
          updateProgress(1);

          if (q.image_url) {
            if (cancelRef.current.canceled) break;
            setPdfProgress((p) => ({
              ...p,
              statusText: "Загрузка изображения...",
            }));
            // attempt to load image -> dataURL (with timeout)
            const imgData = await loadImageToDataUrl(q.image_url);

            if (cancelRef.current.canceled) break;

            if (imgData) {
              try {
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = 90;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                if (y + pdfHeight > 290) {
                  doc.addPage();
                  y = 10;
                }
                doc.addImage(imgData, "PNG", 10, y, pdfWidth, pdfHeight);
                y += pdfHeight + 5;
              } catch (err) {
                console.error("Ошибка при вставке картинки в PDF:", err);
                // ignore, count step anyway
              }
            } else {
              // couldn't load image -> skip but count step
              console.warn(
                "Не удалось загрузить изображение или оно таймаутнуло:",
                q.image_url
              );
            }
            updateProgress(1);
            setPdfProgress((p) => ({ ...p, statusText: "Генерация PDF..." }));
          }
        }

        y += 5;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      }

      if (cancelRef.current.canceled) {
        setPdfProgress((p) => ({
          ...p,
          statusText: "Отменено пользователем",
          canceled: true,
        }));
        // do not save file when cancelled
        return;
      }

      // finalize
      setPdfProgress((p) => ({ ...p, statusText: "Подготовка файла..." }));
      // small delay to ensure UI updated
      await new Promise((res) => setTimeout(res, 120));
      doc.save(`book_${bookId}_responses.pdf`);
      setPdfProgress((p) => ({
        ...p,
        statusText: "Готово",
        percent: 100,
        etaSeconds: 0,
      }));
      // Hide progress after a short delay
      setTimeout(() => {
        setPdfProgress((p) => ({ ...p, visible: false }));
      }, 1200);
    } catch (err) {
      console.error("Ошибка при генерации PDF:", err);
      setPdfProgress((p) => ({
        ...p,
        statusText: "Ошибка при генерации PDF",
        visible: true,
      }));
    }
  };

  const cancelPdf = () => {
    cancelRef.current.canceled = true;
    setPdfProgress((p) => ({ ...p, statusText: "Отмена...", canceled: true }));
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
      {/* Прогресс-модал (фиксированный центр) */}
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
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
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
                        setPdfProgress((p) => ({ ...p, visible: false }))
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
                    const bookResponses = responses.filter(
                      (r) => r.book_id === book.id
                    );

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
                            onClick={() => generatePDF(book.id)}
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
