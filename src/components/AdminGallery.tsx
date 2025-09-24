"use client";

import React, { useEffect, useState } from "react";
import { useBooks, Book } from "@/context/BooksContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  useUserResponses,
  UserResponse,
  Question,
} from "@/context/UserResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/context/AuthContext";
import { API_URL } from "@/constants/data";
import Image from "next/image";

const AdminGallery = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { books, fetchBooks } = useBooks();
  const { responses, fetchResponses } = useUserResponses();
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    {}
  );

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/all`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    users.forEach((user) => fetchBooks(user.id));
  }, [users, fetchBooks]);

  // отсортируй и оставь только тех у кого role !== 'admin'
  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .sort((a, b) => a.username.localeCompare(b.username));

  useEffect(() => {
    books.forEach((book) => fetchResponses(book.user_id, book.id));
  }, [books, fetchResponses]);

  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const toggleBook = (bookId: string) => {
    setExpandedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  const generatePDF = async (bookId: string) => {
    const bookResponses = responses.filter((r) => r.book_id === bookId);
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = 190; // ширина страницы с отступами (210 - 20)
    let y = 10;

    for (const r of bookResponses) {
      doc.setFontSize(12);
      const targetLines = doc.splitTextToSize(`Answer: ${r.target}`, pageWidth);
      doc.text(targetLines, 10, y);
      y += targetLines.length * 6; // перенос по высоте
      y += 2;

      for (const q of r.answers.questions) {
        doc.setFontSize(10);

        const questionLines = doc.splitTextToSize(
          `Question: ${q.question}`,
          pageWidth
        );
        if (y + questionLines.length * 5 > 290) {
          doc.addPage();
          y = 10;
        }
        doc.text(questionLines, 10, y);
        y += questionLines.length * 5 + 2;

        const answerLines = doc.splitTextToSize(
          `Answer: ${q.answer}`,
          pageWidth
        );
        if (y + answerLines.length * 5 > 290) {
          doc.addPage();
          y = 10;
        }
        doc.text(answerLines, 10, y);
        y += answerLines.length * 5 + 2;

        if (q.image_url) {
          try {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = q.image_url;
            await new Promise<void>((resolve) => {
              img.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL("image/png");

                const pageHeight = 290; // mm
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = 90;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (y + pdfHeight > pageHeight) {
                  doc.addPage();
                  y = 10;
                }

                doc.addImage(imgData, "PNG", 10, y, pdfWidth, pdfHeight);
                y += pdfHeight + 5;
                resolve();
              };
            });
          } catch (err) {
            console.error("Ошибка при вставке картинки в PDF", err);
          }
        }
      }

      y += 5;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    }

    doc.save(`book_${bookId}_responses.pdf`);
  };

  return (
    <div className="space-y-6 p-6">
      {filteredUsers.map((user) => {
        const userBooks = books.filter((b) => b.user_id === user.id);

        return (
          <div key={user.id} className="border rounded-lg shadow-md">
            {/* Пользователь */}
            <button
              onClick={() => toggleUser(user.id)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold rounded-t-lg"
            >
              {user.username} {user.credit && `(${user.role})`}
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
                        {/* Книга */}
                        <div className="flex items-center justify-between bg-gray-50 border-b rounded-t-lg">
                          <button
                            onClick={() => toggleBook(book.id)}
                            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 font-medium rounded-t-md"
                          >
                            {book.title} — {book.author}
                          </button>
                          <button
                            onClick={() => generatePDF(book.id)}
                            className="px-10 py-1 mr-4 bg-blue-600 whitespace-nowrap text-white rounded hover:bg-blue-700"
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
