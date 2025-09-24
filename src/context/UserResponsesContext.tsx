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
  responses: UserResponse[];
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
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // получить все ответы по user + book
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
        setResponses(data);
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

  // создать новый response
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
        setResponses((prev) => [...prev, data]);
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

  // обновить response
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
        setResponses((prev) => prev.map((r) => (r.id === id ? updated : r)));
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

  // удалить response
  const deleteResponse = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/user-responses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete response");
      setResponses((prev) => prev.filter((r) => r.id !== id));
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
        responses,
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
