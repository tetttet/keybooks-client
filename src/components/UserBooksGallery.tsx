"use client";

import React, { useEffect } from "react";
import { useBooks, Book } from "@/context/BooksContext";
import {
  useUserResponses,
  UserResponse,
  Question,
} from "@/context/UserResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface UserBooksGalleryProps {
  user_id: string;
}

const UserBooksGallery: React.FC<UserBooksGalleryProps> = ({ user_id }) => {
  const {
    getBooks,
    fetchBooks,
    loading: booksLoading,
    error: booksError,
  } = useBooks();

  const {
    responses,
    fetchResponses,
    loading: responsesLoading,
    error: responsesError,
  } = useUserResponses();

  // Загружаем книги пользователя
  useEffect(() => {
    if (user_id) {
      fetchBooks(user_id);
    }
  }, [user_id, fetchBooks]);

  const books = getBooks(user_id);

  // Загружаем ответы для всех книг
  useEffect(() => {
    if (books.length) {
      Promise.all(books.map((book) => fetchResponses(user_id, book.id))).catch(
        console.error
      );
    }
  }, [books, user_id, fetchResponses]);

  if (booksLoading || responsesLoading)
    return <p className="text-gray-500">Загрузка...</p>;

  if (booksError)
    return (
      <p className="text-red-500">Ошибка при загрузке книг: {booksError}</p>
    );

  if (responsesError)
    return (
      <p className="text-red-500">
        Ошибка при загрузке ответов: {responsesError}
      </p>
    );

  if (!books.length) return <p>Книг пока нет.</p>;

  return (
    <div className="space-y-8">
      {books.map((book: Book) => {
        const bookResponses: UserResponse[] = responses.filter(
          (r) => r.book_id === book.id
        );

        return (
          <Card key={book.id} className="shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{book.title}</CardTitle>
              <p className="text-gray-500">Автор: {book.author}</p>
            </CardHeader>

            <CardContent>
              {book.bookcover && (
                <Image
                  src={book.bookcover}
                  alt="Обложка книги"
                  className="w-96 h-auto rounded-md mb-4"
                  width={500}
                  height={300}
                />
              )}

              {bookResponses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookResponses.map((response) => (
                    <Card key={response.id} className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          Ответ: {response.target}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(response.answers?.questions) &&
                        response.answers.questions.length ? (
                          response.answers.questions.map((q: Question) => (
                            <div key={q.id} className="mb-4 border-b pb-2">
                              <p className="font-medium">{q.question}</p>
                              {q.answer && (
                                <p className="text-gray-700 mb-2">{q.answer}</p>
                              )}
                              {q.image_url && (
                                <Image
                                  width={400}
                                  height={300}
                                  src={q.image_url}
                                  alt="question image"
                                  className="rounded-md w-full object-cover max-h-48"
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">Нет вопросов</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Ответов пока нет.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserBooksGallery;
