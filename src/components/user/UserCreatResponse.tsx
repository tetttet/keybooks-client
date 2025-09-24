"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useUserResponses } from "@/context/UserResponsesContext"; // твой новый контекст
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/constants/data";
import { loadQuestions } from "@/constants/questions";
import { ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  user: User;
  book_id: string;
  target:
    | "mother"
    | "father"
    | "girlfriend"
    | "boyfriend"
    | "colleague"
    | "friend"
    | "husband"
    | "wife"
    | "parents";
  onClose: () => void;
  onCreated?: () => void;
}

const TARGET_FILES: Record<string, string> = {
  girlfriend: "girlfriend.txt",
  boyfriend: "boyfriend.txt",
  mother: "mother.txt",
  father: "father.txt",
  colleague: "colleague.txt",
  friend: "friend.txt",
  husband: "husband.txt",
  wife: "wife.txt",
  parents: "parents.txt",
};

interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  image_url?: string;
}

const UserCreateResponse = ({ user, book_id, target, onClose, onCreated }: Props) => {
  const { createResponse } = useUserResponses();
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [questions, setQuestions] = useState<{ id: number; question: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const t = useTranslations("User.QuestionsForm");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const fileName = TARGET_FILES[target] || "generic.txt";
      const loaded = await loadQuestions(fileName);
      setQuestions(loaded);
      setLoading(false);
    };
    fetchQuestions();
  }, [target]);

  const handleChangeAnswer = useCallback(
    (id: number, value: string) => {
      setAnswers((prev) => {
        const idx = prev.findIndex((a) => a.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx].answer = value;
          return copy;
        }
        const question = questions.find((q) => q.id === id)?.question || "";
        return [...prev, { id, question, answer: value }];
      });
    },
    [questions]
  );

  const handleAttachImage = (id: number, url: string) => {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].image_url = url;
        return copy;
      }
      const question = questions.find((q) => q.id === id)?.question || "";
      return [...prev, { id, question, answer: "", image_url: url }];
    });
    setTempImageUrl("");
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep((prev) => prev + 1);
    else setShowSummary(true);
  };

  const handleBack = () => {
    if (showSummary) setShowSummary(false);
    else if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await createResponse(user.id, book_id, target, { questions: answers });
      const res = await fetch(`${API_URL}/users/${user.id}/credit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: -1 }),
      });
      if (!res.ok) throw new Error("Failed to deduct credit");
      onCreated?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error while deducting credit");
    }
  };

  if (loading) return <p>{t("loading")}</p>;

  if (showSummary) {
    return (
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>{t("yourAnswers")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {answers.map((a) => (
            <div key={a.id} className="space-y-1 border-b pb-2">
              <p className="font-medium">{a.question}</p>
              <p className="text-gray-600">{a.answer}</p>
              {a.image_url && (
                <img
                  src={a.image_url}
                  alt="Attached"
                  className="max-h-40 rounded-md mt-2"
                />
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleBack}>
              {t("back")}
            </Button>
            <Button onClick={handleSubmit}>{t("saveAndCharge")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentStep];
  const answer =
    answers.find((a) => a.id === question.id)?.answer || "";
  const imageUrl =
    answers.find((a) => a.id === question.id)?.image_url || "";

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>
          {t("questionXofY", {
            current: currentStep + 1,
            total: questions.length,
            target: t(`targets.${target}`),
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="block mb-1 font-medium">{question.question}</label>
        <Input
          value={answer}
          onChange={(e) => handleChangeAnswer(question.id, e.target.value)}
          placeholder={t("yourAnswer")}
        />

        {/* Фото */}
        <div className="space-y-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Answer photo"
              className="max-h-40 rounded-md"
            />
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAttachImage(question.id, tempImageUrl)}
            >
              <ImagePlus className="w-4 h-4 mr-1" /> {t("addPhoto")}
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 && !showSummary}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
          <Button onClick={handleNext}>
            {currentStep === questions.length - 1
              ? t("checkAnswers")
              : t("next")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCreateResponse;
