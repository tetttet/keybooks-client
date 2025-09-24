"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { useUserResponses } from "@/context/UserResponsesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/constants/data";
import { loadQuestions } from "@/constants/questions";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";

/*
  CreateFlow.tsx
  ----------------
  Один файл, который показывает пошаговый (step-by-step) поток:
   1) Выбор получателя (target)
   2) Создание книги (создаётся от имени user)
   3) Заполнение вопросов + прикрепление фото к каждому вопросу

  Как использовать:
  - Поместите файл в нужную папку (например: components/create/CreateFlow.tsx)
  - Импорт: import CreateFlow from '@/components/create/CreateFlow';
  - Использование: <CreateFlow user={user} refreshUser={refreshUser} onDone={() => {}} />

  Зависимости: useBooks (контекст для создания книг), useUserResponses (контекст для responses),
  loadQuestions (функция для загрузки вопросов из .txt), API_URL.

  Примечание: функция createBook должна возвращать созданную книгу с полем `id`.
*/

type TargetKey =
  | "mother"
  | "father"
  | "girlfriend"
  | "boyfriend"
  | "colleague"
  | "friend"
  | "husband"
  | "wife"
  | "parents";

const TARGET_LABELS: Record<TargetKey, string> = {
  mother: "Мама",
  father: "Папа",
  girlfriend: "Девушка",
  boyfriend: "Парень",
  colleague: "Коллега",
  friend: "Друг",
  husband: "Муж",
  wife: "Жена",
  parents: "Родители",
};

/* ------------------ Stepper UI ------------------ */
const Stepper: React.FC<{ steps: string[]; active: number }> = ({
  steps,
  active,
}) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm
              ${
                i === active
                  ? "bg-blue-600 text-white"
                  : i < active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {i + 1}
          </div>
          <div
            className={`text-sm ${
              i === active ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------ UserChooseTarget ------------------ */
const UserChooseTarget: React.FC<{
  target: TargetKey | null;
  setTarget: (t: TargetKey | null) => void;
  onNext?: () => void;
}> = ({ target, setTarget, onNext }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Кого вы хотите поздравить?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(TARGET_LABELS).map((k) => {
            const key = k as TargetKey;
            const active = target === key;
            return (
              <button
                key={k}
                onClick={() => setTarget(key)}
                className={`border rounded-lg p-3 text-center hover:shadow-sm transition ${
                  active
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="font-medium">{TARGET_LABELS[key]}</div>
                <div className="text-xs text-gray-500">{key}</div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onNext} disabled={!target}>
            Далее
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* ------------------ UserCreateBook ------------------ */
const UserCreateBookCard: React.FC<{
  user: User;
  onCreated: (bookId: string) => void;
}> = ({ user, onCreated }) => {
  const { createBook, loading } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookcover, setBookcover] = useState("");
  const [busy, setBusy] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setBusy(true);
      const payload = { title, author, bookcover, user_id: user.id };
      // предполагается, что createBook возвращает созданную книгу
      type CreatedBook = { id?: string; _id?: string };
      type CreateBookPayload = {
        title: string;
        author: string;
        bookcover: string;
        user_id: string;
      };
      const created = (await createBook(payload as CreateBookPayload)) as
        | CreatedBook
        | undefined;
      const id = created?.id || created?._id || null;
      if (!id) {
        // если createBook не вернул id, попытка получить id из created.result
        throw new Error(
          "CreateBook did not return created book id. Check your context."
        );
      }
      setSuccessId(id);
      onCreated(id);
      // очистка
      setTitle("");
      setAuthor("");
      setBookcover("");
    } catch (err) {
      console.error(err);
      alert((err as Error)?.message || "Ошибка при создании книги");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Создать книгу</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Название</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Автор</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Обложка (URL)</label>
            <Input
              value={bookcover}
              onChange={(e) => setBookcover(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={loading || busy}
              className="flex items-center"
            >
              {loading || busy ? "Создание..." : "Создать книгу"}
            </Button>
            {successId && (
              <div className="text-sm text-green-600">
                Книга создана (id: {successId})
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

/* ------------------ UserCreateResponse ------------------ */
interface QItem {
  id: number;
  question: string;
}
interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  image_url?: string;
}

const UserCreateResponseCard: React.FC<{
  user: User;
  bookId: string;
  target: TargetKey;
  onClose?: () => void;
  onCreated?: () => void;
}> = ({ user, bookId, target, onClose, onCreated }) => {
  const { createResponse } = useUserResponses();
  const [questions, setQuestions] = useState<QItem[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const file = `${target}.txt`;
      const loaded = await loadQuestions(file);
      setQuestions(loaded);
      setLoading(false);
    };
    fetch();
  }, [target]);

  const handleChange = useCallback(
    (id: number, value: string) => {
      setAnswers((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx].answer = value;
          return copy;
        }
        const q = questions.find((qq) => qq.id === id)?.question || "";
        return [...prev, { id, question: q, answer: value }];
      });
    },
    [questions]
  );

  const attachImage = (id: number, url: string) => {
    if (!url) return;
    setAnswers((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].image_url = url;
        return copy;
      }
      const q = questions.find((qq) => qq.id === id)?.question || "";
      return [...prev, { id, question: q, answer: "", image_url: url }];
    });
    setTempImageUrl("");
  };

  const removeImage = (id: number) => {
    setAnswers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, image_url: undefined } : p))
    );
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep((s) => s + 1);
    else setShowSummary(true);
  };
  const handleBack = () => {
    if (showSummary) setShowSummary(false);
    else if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    try {
      await createResponse(user.id, bookId, target, { questions: answers });
      // списание кредита (если у вас такая логика на бэке)
      const res = await fetch(`${API_URL}/users/${user.id}/credit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: -1 }),
      });
      if (!res.ok) throw new Error("Не удалось списать кредит");
      onCreated?.();
      onClose?.();
      alert("Ответы сохранены!");
    } catch (err) {
      console.error(err);
      alert((err as Error)?.message || "Ошибка при сохранении ответов");
    }
  };

  if (loading) return <div>Загрузка вопросов...</div>;

  if (showSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Проверьте ответы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {answers.map((a) => (
              <div key={a.id} className="border-b pb-2">
                <div className="font-medium">{a.question}</div>
                <div className="text-sm text-gray-700">{a.answer}</div>
                {a.image_url && (
                  <div className="mt-2 relative">
                    <img
                      src={a.image_url}
                      alt="photo"
                      className="max-h-40 rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleBack}>
              Назад
            </Button>
            <Button onClick={handleSubmit}>Сохранить и списать кредит</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = questions[currentStep];
  const currentAnswer = answers.find((a) => a.id === q.id);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          Вопрос {currentStep + 1} из {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="font-medium">{q.question}</div>
          <Input
            value={currentAnswer?.answer || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />

          <div className="space-y-2">
            {currentAnswer?.image_url && (
              <div className="relative inline-block">
                <img
                  src={currentAnswer.image_url}
                  alt="preview"
                  className="max-h-36 rounded"
                />
                <button
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                  onClick={() => removeImage(q.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Вставьте URL изображения"
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => attachImage(q.id, tempImageUrl)}
              >
                <ImagePlus className="w-4 h-4 mr-1" /> Добавить фото
              </Button>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 && !showSummary}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Назад
            </Button>
            <Button onClick={handleNext}>
              {currentStep === questions.length - 1
                ? "Проверить ответы"
                : "Далее"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ------------------ Главный компонент CreateFlow ------------------ */
const CreateFlow: React.FC<{
  user: User;
  refreshUser: () => Promise<void>;
  onDone?: () => void;
}> = ({ user, refreshUser, onDone }) => {
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState<TargetKey | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);

  const steps = ["Кому", "Книга", "Ответы"];

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Stepper steps={steps} active={step} />

      {step === 0 && (
        <UserChooseTarget
          target={target}
          setTarget={(t) => setTarget(t)}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <div>
          <UserCreateBookCard
            user={user}
            onCreated={(id) => {
              setBookId(id);
              setStep(2);
            }}
          />
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Назад
            </Button>
          </div>
        </div>
      )}

      {step === 2 && target && bookId && (
        <div>
          <UserCreateResponseCard
            user={user}
            bookId={bookId}
            target={target}
            onClose={() => {
              // вернуться к началу или закрыть
              setStep(0);
              setTarget(null);
              setBookId(null);
              onDone?.();
            }}
            onCreated={async () => {
              // обновляем данные пользователя (например, кредиты)
              await refreshUser();
            }}
          />
          <div className="flex justify-between mt-4">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Назад к созданию книги
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFlow;
