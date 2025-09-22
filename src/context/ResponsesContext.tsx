"use client";

import { API_URL } from "@/constants/data";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface QuestionAnswer {
  id: number;
  question: string;
  answer: string | null;
}

export interface UserResponse {
  id: number;
  user_id: string;
  target: string;
  answers: { questions: QuestionAnswer[] };
  created_at: string;
  updated_at: string;
}

interface ResponsesContextType {
  responses: UserResponse[];
  fetchResponses: (userId: string) => Promise<void>;
  fetchAllResponses: () => Promise<void>;
  createResponse: (
    userId: string,
    target: string,
    answers: { questions: QuestionAnswer[] }
  ) => Promise<void>;
  updateResponse: (
    id: number,
    answers: { questions: QuestionAnswer[] }
  ) => Promise<void>;
  deleteResponse: (id: number) => Promise<void>;
}

const ResponsesContext = createContext<ResponsesContextType | undefined>(
  undefined
);

export const ResponsesProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<UserResponse[]>([]);

  // Получить ответы конкретного пользователя
  const fetchResponses = async (userId: string) => {
    const res = await fetch(`${API_URL}/responses?user_id=${userId}`);
    const data = await res.json();
    setResponses(data);
  };

  // Получить все ответы всех пользователей
  const fetchAllResponses = async () => {
    const res = await fetch(`${API_URL}/responses/all`);
    const data = await res.json();
    setResponses(data);
  };

  // Создать новую запись
  const createResponse = async (
    userId: string,
    target: string,
    answers: { questions: QuestionAnswer[] }
  ) => {
    const res = await fetch(`${API_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, target, answers }),
    });
    const data = await res.json();
    setResponses((prev) => [data, ...prev]);
  };

  // Обновить ответы
  const updateResponse = async (
    id: number,
    answers: { questions: QuestionAnswer[] }
  ) => {
    const res = await fetch(`${API_URL}/responses?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResponses((prev) => prev.map((r) => (r.id === id ? data : r)));
  };

  // Удалить запись
  const deleteResponse = async (id: number) => {
    await fetch(`${API_URL}/responses?id=${id}`, { method: "DELETE" });
    setResponses((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ResponsesContext.Provider
      value={{
        responses,
        fetchResponses,
        fetchAllResponses,
        createResponse,
        updateResponse,
        deleteResponse,
      }}
    >
      {children}
    </ResponsesContext.Provider>
  );
};

// Хук для удобного использования
export const useResponses = () => {
  const context = useContext(ResponsesContext);
  if (!context)
    throw new Error("useResponses must be used within ResponsesProvider");
  return context;
};
