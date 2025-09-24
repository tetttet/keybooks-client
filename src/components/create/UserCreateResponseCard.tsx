"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useUserResponses } from "@/context/UserResponsesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/constants/data";
import { loadQuestions } from "@/constants/questions";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import StepContainer from "../ui/StepContainer";
import { useTranslations } from "next-intl";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

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
  target: string;
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
  const b = useTranslations("User.QuestionsForm");
  const t = useTranslations("All.responsesForm");
  const [title, setTitle] = useState("Untitled");

  useEffect(() => {
    if (bookId) {
      getBookTitle(bookId).then((t) => setTitle(t));
    }
  }, [bookId]);

  const getBookTitle = async (bookId: string) => {
    try {
      const res = await fetch(`${API_URL}/books/${bookId}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const data = await res.json();
      return data.title || "Untitled";
    } catch (err) {
      console.error(err);
      return "Untitled";
    }
  };
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
          <CardTitle>
            {t("check")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {answers.map((a) => (
              <div key={a.id} className="border-b pb-2">
                <div className="font-medium">{a.question}</div>
                <div className="text-sm text-gray-700">{a.answer}</div>
                {a.image_url && (
                  <div className="mt-2 relative">
                    <Image
                      width={160}
                      height={160}
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
              <ArrowLeft className="w-4 h-4 mr-1" /> {t("back")}
            </Button>
            <Button onClick={handleSubmit}>
              {t("saveAndDeduct")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = questions[currentStep];
  const currentAnswer = answers.find((a) => a.id === q.id);

  return (
    <Card>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-col items-center text-center space-y-8 py-10">
            <StepContainer>
              {/* превью страницы */}
              <div className="px-4 sm:px-10 lg:px-28 py-10 bg-[#131927] h-[350px] flex items-center justify-center">
                <div className="bg-white h-[320px] shadow-md max-w-[200px] w-full flex flex-col justify-between p-6">
                  <p className="text-black font-medium text-left text-[6px]">
                    {q.question}
                  </p>
                  <p className="text-gray-700 text-[8px] whitespace-pre-wrap text-left mt-4 flex-1">
                    {currentAnswer?.answer || ""}
                  </p>
                  <div className="flex justify-between text-[6px] text-black mt-4">
                    <span>{title || ""}</span>
                    <span>
                      {b("page", {
                        current: currentStep + 1,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-white text-left mt-2">
                <p className="mb-2">
                  {b("questionXofY", {
                    current: currentStep + 1,
                    total: questions.length,
                    target: b(`targets.${target.toLowerCase()}`),
                  })}
                </p>
                <p>{q.question}</p>
              </div>
            </StepContainer>

            {/* поле ввода ответа */}
            <div className="flex justify-center w-full px-0 lg:px-4 -mt-12">
              <div className="px-0 lg:px-6 rounded-2xl w-full max-w-2xl bg-gradient-to-t from-[#eef2fb] to-[#f4f7ff]">
                <div className="bg-white rounded-xl py-6 px-6 shadow-lg">
                  <div className="text-left">
                    <label className="block text-sm font-medium mb-1">
                      {t("ans")}
                    </label>
                    <Textarea
                      placeholder={t("ansPlaceholder")}
                      value={currentAnswer?.answer || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="h-40 border-white focus:border-white focus:ring-0 -ml-3 -mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {currentAnswer?.image_url && (
              <div className="relative inline-block">
                <Image
                  src={currentAnswer.image_url}
                  alt="preview"
                  className="max-h-36 rounded"
                  width={160}
                  height={160}
                />
                <button
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                  onClick={() => removeImage(q.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <ImageUploader
              onUploaded={(url, public_id) => attachImage(q.id, url)}
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 && !showSummary}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> {t("back")}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === questions.length - 1
                ? t("check")
                : t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCreateResponseCard;
