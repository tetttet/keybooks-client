"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StepContainer from "@/components/ui/StepContainer";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/constants/data";
import {
  loadQuestions,
  PropsInterface,
  TARGET_FILES,
} from "@/constants/questions";
import { QuestionAnswer } from "@/context/ResponsesContext";
import { useImages } from "@/context/ImagesContext";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const Step3 = ({
  target,
  onClose,
  onCreated,
  createResponse,
  user_id,
  answers,
  setAnswers,
}: PropsInterface) => {
  const t = useTranslations("All.step.stepThree");
  const b = useTranslations("User.QuestionsForm");

  const { images, addImage, deleteImage } = useImages();

  const [questions, setQuestions] = useState<
    { id: number; question: string }[]
  >([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // описание фото
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQ(true);
      const fileName = TARGET_FILES[target] || "generic.txt";
      const loaded = await loadQuestions(fileName);
      setQuestions(loaded);
      setLoadingQ(false);
    };
    fetchQuestions();
  }, [target]);

  const handleChange = useCallback(
    (id: number, value: string) => {
      setAnswers((prev: QuestionAnswer[]) => {
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
    [questions, setAnswers]
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
      await createResponse(user_id, target, { questions: answers });
      console.log("Response created", user_id, target, { questions: answers });

      const res = await fetch(`${API_URL}/users/${user_id}/credit`, {
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

  const handleFileSelect = (file: File) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    addImage(previewUrl, `Page ${currentStep + 1}: ${desc}`);
    setDesc("");
  };

  if (loadingQ) return <p>Loading...</p>;

  if (showSummary) {
    return (
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>{b("yourAnswers")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {answers.map((a) => (
            <div key={a.id} className="space-y-1">
              <p className="font-medium">{a.question}</p>
              <p className="text-gray-600">{a.answer}</p>
            </div>
          ))}

          <div className="mt-6">
            <h4 className="font-semibold">{t("imagesSummary")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={img.url}
                    alt={img.description || "User Image"}
                    width={200}
                    height={200}
                    className="object-cover rounded-md"
                  />
                  <p className="text-xs mt-1">{img.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleBack}>
              {b("back")}
            </Button>
            <Button onClick={handleSubmit}>{b("saveAndCharge")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentStep];
  const currentAnswer = answers.find((a) => a.id === question.id)?.answer || "";

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      <StepContainer>
        <h3 className="text-base font-medium mb-2 text-left">{t("header")}</h3>

        {/* превью страницы */}
        <div className="px-4 sm:px-10 lg:px-28 py-10 bg-[#131927] h-[350px] flex items-center justify-center">
          <div className="bg-white h-[320px] shadow-md max-w-[200px] w-full flex flex-col justify-between p-6">
            <p className="text-black font-medium text-left text-[6px]">
              {question.question}
            </p>
            <p className="text-gray-700 text-[8px] whitespace-pre-wrap text-left mt-4 flex-1">
              {currentAnswer || ""}
            </p>
            <div className="flex justify-between text-[6px] text-black mt-4">
              <span>A Thousand Little Moments</span>
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
              target: b(`targets.${target}`),
            })}
          </p>
          <p>{question.question}</p>
        </div>
      </StepContainer>

      {/* поле ввода ответа */}
      <div className="flex justify-center w-full px-0 lg:px-4 -mt-6">
        <div className="px-0 lg:px-6 rounded-2xl w-full max-w-2xl bg-gradient-to-t from-[#eef2fb] to-[#f4f7ff]">
          <div className="bg-white rounded-xl py-6 px-6 shadow-lg">
            <div className="text-left">
              <label className="block text-sm font-medium mb-1">
                {t("anw")}
              </label>
              <Textarea
                placeholder={t("answerPlaceholder")}
                value={currentAnswer}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className="h-40 border-white focus:border-white focus:ring-0 -ml-3 -mt-2"
              />

              {/* форма для фото */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  {t("addImage")}
                </label>

                {/* Dropzone */}
                <div
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer p-6"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="fileUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500">
                      {t("dragDropOrClick")}
                    </span>
                    <Button type="button" variant="outline" className="mt-2">
                      {t("chooseFile")}
                    </Button>
                  </label>
                </div>

                {/* Описание фото */}
                <Input
                  type="text"
                  placeholder={t("descPlaceholder")}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full mt-3"
                />

                {/* галерея фоток только этой страницы */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {images
                    .filter((img) =>
                      img.description?.startsWith(`Page ${currentStep + 1}:`)
                    )
                    .map((img, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <Image
                          src={img.url}
                          alt={img.description || "User Image"}
                          width={150}
                          height={150}
                          className="object-cover w-full h-32"
                        />
                        <p className="text-xs px-2 py-1 bg-gray-50">
                          {img.description}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1"
                          onClick={() => deleteImage(idx)}
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0 && !showSummary}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {b("back")}
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === questions.length - 1
                    ? b("checkAnswers")
                    : b("next")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
