"use client";
import { useCallback, useEffect, useState } from "react";
import { QuestionAnswer, useResponses } from "@/context/ResponsesContext";
import { User } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale, useTranslations } from "next-intl";
import { MS_coverDesigns, coverDesigns } from "@/constants/data";
import { Button } from "@/components/ui/button";
import Step1 from "./step/Step1";
import Step2 from "./step/Step2";
import Step3 from "./step/Step3";

interface CreateBookProps {
  user: User;
  refreshUser: () => Promise<void>;
}

const UserMain = ({ user, refreshUser }: CreateBookProps) => {
  const t = useTranslations("User.CreateBook");
  const locale = useLocale();
  const data = locale === "ms" ? MS_coverDesigns : coverDesigns;

  // State
  const [selected, setSelected] = useState<
    | "mother"
    | "father"
    | "girlfriend"
    | "boyfriend"
    | "colleague"
    | "friend"
    | "husband"
    | "wife"
    | "parents"
    | null
  >(null);

  const [design, setDesign] = useState(data[0]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [activeTab, setActiveTab] = useState("step1");

  const { fetchResponses, createResponse } = useResponses();

  // Steps list (чтобы было легко расширять)
  const steps = [
    { id: "step1", label: "Step 1", description: t("step1Desc") },
    { id: "step2", label: "Step 2", description: t("step2Desc") },
    { id: "step3", label: "Step 3", description: t("step3Desc") },
  ];

  const loadResponses = useCallback(async () => {
    await fetchResponses(user.id);
  }, [user.id, fetchResponses]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  const handleBookCreated = async () => {
    await refreshUser();
    setSelected(null);
    await loadResponses();
    setActiveTab("step1");
  };

  if (user.credit <= 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 font-medium">{t("noCredits")}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 py-10 lg:py-0 lg:p-6 ml-0 lg:ml-6 mr-0 lg:mr-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                disabled={
                  (step.id === "step2" && !selected) ||
                  (step.id === "step3" && !design)
                }
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Step1 */}
          <TabsContent value="step1">
            <Step1 selected={selected!} setSelected={setSelected} />
            {selected && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setActiveTab("step2")}>
                  {t("next")}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Step2 */}
          <TabsContent value="step2">
            <Step2
              design={design}
              setDesign={setDesign}
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
            />
            {design && (
              <div className="mt-4 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab("step1")}
                >
                  {t("back")}
                </Button>
                <Button onClick={() => setActiveTab("step3")}>
                  {t("next")}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Step3 */}
          <TabsContent value="step3">
            <Step3
              answers={answers}
              setAnswers={setAnswers}
              target={selected!}
              onClose={() => setSelected(null)}
              onCreated={handleBookCreated}
              user_id={user.id}
              createResponse={createResponse}
            />
            <div className="mt-4 flex justify-start">
              <Button variant="secondary" onClick={() => setActiveTab("step2")}>
                {t("back")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserMain;
