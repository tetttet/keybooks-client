"use client";
import { API_URL } from "@/constants/data";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface Book {
  id: string;
  title: string;
  author: string;
  bookcover?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface BooksContextType {
  books: Book[];
  error: string | null;
  loading: boolean;
  fetchBooks: (userId: string) => Promise<void>;
  createBook: (
    data: Omit<Book, "id" | "created_at" | "updated_at">
  ) => Promise<Book | null>;
  updateBook: (
    id: string,
    data: Partial<Omit<Book, "id" | "user_id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  clearError: () => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Unexpected error");
    }
    setTimeout(() => setError(null), 5000);
  };

  const fetchBooks = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books/user/${userId}`);
      if (!res.ok) throw new Error("Ошибка при загрузке книг");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(
    async (
      data: Omit<Book, "id" | "created_at" | "updated_at">
    ): Promise<Book | null> => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/books`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка при создании книги");
        const newBook: Book = await res.json();
        console.log("Created Book:", newBook);
        setBooks((prev) => [newBook, ...prev]);
        return newBook; 
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBook = useCallback(
    async (
      id: string,
      data: Partial<Omit<Book, "id" | "user_id" | "created_at" | "updated_at">>
    ) => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/books/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Ошибка при обновлении книги");
        const updated = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Ошибка при удалении книги");
      await res.json();
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return (
    <BooksContext.Provider
      value={{
        books,
        error,
        loading,
        fetchBooks,
        createBook,
        updateBook,
        deleteBook,
        clearError,
      }}
    >
      {children}

      {/* UI ошибок */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          <span>⚠️ {error}</span>
          <button
            onClick={clearError}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✖
          </button>
        </div>
      )}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within BooksProvider");
  }
  return context;
};
