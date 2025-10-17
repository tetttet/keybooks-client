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
  /**
   * Возвращает книги для конкретного пользователя (синхронно).
   * Используйте getBooks(userId) в компонентах.
   */
  getBooks: (userId: string) => Book[];
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

/**
 * booksByUser: Record<userId, Book[]>
 * Это предотвращает "утекание" книг одного пользователя в список другого.
 */
export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [booksByUser, setBooksByUser] = useState<Record<string, Book[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Unexpected error");
    }
    // авто-скрытие через 5s
    setTimeout(() => setError(null), 5000);
  };

  const getBooks = useCallback(
    (userId: string) => {
      return booksByUser[userId] ?? [];
    },
    [booksByUser]
  );

  const fetchBooks = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books/user/${userId}`);
      if (!res.ok) throw new Error("Ошибка при загрузке книг");
      const data: Book[] = await res.json();
      setBooksByUser((prev) => ({ ...prev, [userId]: data }));
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
        if (!res.ok) {
          // попытаемся получить текст ошибки из ответа
          let msg = "Ошибка при создании книги";
          try {
            const j = await res.json();
            if (j?.message) msg = j.message;
          } catch {}
          throw new Error(msg);
        }
        const newBook: Book = await res.json();
        const ownerId = newBook.user_id ?? data.user_id;
        if (!ownerId) {
          // если нигде нет user_id — просто логируем и добавляем в общий массив под 'unknown'
          console.warn("createBook: no user_id in response or request");
        }
        setBooksByUser((prev) => {
          const prevList = prev[ownerId] ?? [];
          return { ...prev, [ownerId]: [newBook, ...prevList] };
        });
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
        if (!res.ok) {
          let msg = "Ошибка при обновлении книги";
          try {
            const j = await res.json();
            if (j?.message) msg = j.message;
          } catch {}
          throw new Error(msg);
        }
        const updated: Book = await res.json();

        // Определяем владельца: берем из ответа (лучше всего), иначе ищем в prev state
        const ownerId = updated.user_id;
        if (ownerId) {
          setBooksByUser((prev) => {
            const list = prev[ownerId] ?? [];
            const newList = list.map((b) => (b.id === id ? updated : b));
            return { ...prev, [ownerId]: newList };
          });
        } else {
          // fallback: ищем везде по id и обновляем первую найденную запись
          setBooksByUser((prev) => {
            const next: Record<string, Book[]> = {};
            for (const [uid, arr] of Object.entries(prev)) {
              next[uid] = arr.map((b) =>
                b.id === id ? { ...b, ...updated } : b
              );
            }
            return next;
          });
        }
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
      if (!res.ok) {
        let msg = "Ошибка при удалении книги";
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }
      // API может вернуть { success: true } или удалённый объект — не полагаемся на это, просто удаляем локально
      setBooksByUser((prev) => {
        const next: Record<string, Book[]> = {};
        for (const [uid, arr] of Object.entries(prev)) {
          const filtered = arr.filter((b) => b.id !== id);
          next[uid] = filtered;
        }
        return next;
      });
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
        getBooks,
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
