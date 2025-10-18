"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { API_URL } from "@/constants/data";

export interface Question {
  id: number;
  question: string;
  answer: string;
  image_url?: string;
}

export interface UserResponse {
  id: string;
  user_id: string;
  book_id: string;
  target: string;
  answers: {
    questions: Question[];
  };
  created_at: string;
  updated_at: string;
}

interface UserResponsesContextType {
  /** Плоский массив всех ответов (для совместимости с текущим кодом) */
  responses: UserResponse[];
  /** Получить ответы конкретной книги */
  getResponsesForBook: (book_id: string) => UserResponse[];
  loading: boolean;
  error: string | null;
  fetchResponses: (user_id: string, book_id: string) => Promise<void>;
  createResponse: (
    user_id: string,
    book_id: string,
    target: string,
    answers: { questions: Question[] }
  ) => Promise<UserResponse | null>;
  updateResponse: (
    id: string,
    data: Partial<Pick<UserResponse, "target" | "answers">>
  ) => Promise<UserResponse | null>;
  deleteResponse: (id: string) => Promise<boolean>;
}

const UserResponsesContext = createContext<
  UserResponsesContextType | undefined
>(undefined);

export const UserResponsesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // внутренне храним объекты по book_id
  const [responsesByBook, setResponsesByBook] = useState<
    Record<string, UserResponse[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // helper: вернуть плоский массив для совместимости
  const flatResponses = Object.values(responsesByBook).flat();

  const getResponsesForBook = useCallback(
    (book_id: string) => {
      return responsesByBook[book_id] || [];
    },
    [responsesByBook]
  );

  // получить все ответы по user + book и положить их в responsesByBook[book_id]
  const fetchResponses = useCallback(
    async (user_id: string, book_id: string) => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${API_URL}/user-responses/${user_id}/${book_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch responses");
        const data = await res.json();

        // API может возвращать либо массив, либо { responses: [] }
        const arr: UserResponse[] = Array.isArray(data)
          ? data
          : data?.responses ?? [];

        setResponsesByBook((prev) => ({
          ...prev,
          [book_id]: arr,
        }));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // создать новый response и добавить в соответствующий bucket
  const createResponse = useCallback(
    async (
      user_id: string,
      book_id: string,
      target: string,
      answers: { questions: Question[] }
    ) => {
      try {
        setError(null);
        const res = await fetch(`${API_URL}/user-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, book_id, target, answers }),
        });
        if (!res.ok) throw new Error("Failed to create response");
        const data: UserResponse = await res.json();

        setResponsesByBook((prev) => {
          const prevArr = prev[book_id] ?? [];
          return {
            ...prev,
            [book_id]: [...prevArr, data],
          };
        });

        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        return null;
      }
    },
    []
  );

  // обновить response (ищем по id внутри всех buckets) и заменяем его
  const updateResponse = useCallback(
    async (
      id: string,
      data: Partial<Pick<UserResponse, "target" | "answers">>
    ) => {
      try {
        setError(null);
        const res = await fetch(`${API_URL}/user-responses/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update response");
        const updated: UserResponse = await res.json();

        setResponsesByBook((prev) => {
          // найдём bucket, где лежит этот id (если не знаем — пробежим по всем)
          const next: Record<string, UserResponse[]> = {};
          for (const [bookId, arr] of Object.entries(prev)) {
            next[bookId] = arr.map((r) => (r.id === id ? updated : r));
          }
          // если ни в одном не было — возможно новая (на всякий случай добавим)
          const exists = Object.values(next).some((arr) =>
            arr.some((r) => r.id === id)
          );
          if (!exists) {
            const bookId = updated.book_id;
            const prevArr = prev[bookId] ?? [];
            next[bookId] = [...prevArr, updated];
          }
          return next;
        });

        return updated;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        return null;
      }
    },
    []
  );

  // удалить response (по id)
  const deleteResponse = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/user-responses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete response");

      setResponsesByBook((prev) => {
        const next: Record<string, UserResponse[]> = {};
        for (const [bookId, arr] of Object.entries(prev)) {
          next[bookId] = arr.filter((r) => r.id !== id);
        }
        return next;
      });

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return false;
    }
  }, []);

  return (
    <UserResponsesContext.Provider
      value={{
        // плоский массив для совместимости — УДОБЕН, но UI должен лучше использовать getResponsesForBook
        responses: flatResponses,
        getResponsesForBook,
        loading,
        error,
        fetchResponses,
        createResponse,
        updateResponse,
        deleteResponse,
      }}
    >
      {children}
    </UserResponsesContext.Provider>
  );
};

export const useUserResponses = () => {
  const ctx = useContext(UserResponsesContext);
  if (!ctx) {
    throw new Error(
      "useUserResponses must be used within UserResponsesProvider"
    );
  }
  return ctx;
};
