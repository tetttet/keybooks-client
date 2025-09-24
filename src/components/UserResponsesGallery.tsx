"use client";

import React, { useEffect } from "react";
import {
  useUserResponses,
  UserResponse,
  Question,
} from "@/context/UserResponsesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface UserResponsesGalleryProps {
  user_id: string;
  book_id: string;
}

const UserResponsesGallery: React.FC<UserResponsesGalleryProps> = ({
  user_id,
  book_id,
}) => {
  const { responses, fetchResponses, loading, error } = useUserResponses();

  useEffect(() => {
    fetchResponses(user_id, book_id);
  }, [user_id, book_id, fetchResponses]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;
  if (!responses.length) return <p>Ответов пока нет.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {responses.map((response: UserResponse) => (
        <Card key={response.id} className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ответ на книгу
            </CardTitle>
            <p className="text-sm text-gray-500">Цель: {response.target}</p>
          </CardHeader>
          <CardContent>
            {response.answers.questions.map((q: Question) => (
              <div key={q.id} className="mb-4 border-b pb-2">
                <p className="font-medium">{q.question}</p>
                <p className="text-gray-700 mb-2">{q.answer}</p>
                {q.image_url && (
                  <Image
                    src={q.image_url}
                    alt="question image"
                    className="rounded-md w-full object-cover max-h-64"
                    width={500}
                    height={300}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserResponsesGallery;
