"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@/context/AuthContext";
import { useResponses, QuestionAnswer } from "@/context/ResponsesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/constants/data";
import { loadQuestions } from "@/constants/questions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  user: User;
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
  parents: "parents.txt"
};

const QuestionsForm = ({ user, target, onClose, onCreated }: Props) => {
  const { createResponse } = useResponses();
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [questions, setQuestions] = useState<
    { id: number; question: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

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

  const handleChange = useCallback(
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
      await createResponse(user.id, target, { questions: answers });
      const res = await fetch(`${API_URL}/users/${user.id}/credit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: -1 })
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
            <div key={a.id} className="space-y-1">
              <p className="font-medium">{a.question}</p>
              <p className="text-gray-600">{a.answer}</p>
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
  const answer = answers.find((a) => a.id === question.id)?.answer || "";

  return (
    <Card className="space-y-4">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
          <CardTitle className="m-0">
            {t("questionXofY", {
              current: currentStep + 1,
              total: questions.length,
              target: t(`targets.${target}`)
            })}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="block mb-1 font-medium">{question.question}</label>
        <Input
          value={answer}
          onChange={(e) => handleChange(question.id, e.target.value)}
        />
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

export default QuestionsForm;
