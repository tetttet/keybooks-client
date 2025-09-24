"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Stepper from "./Stepper";
import UserChooseTarget from "./UserChooseTarget";
import UserCreateBookCard from "./UserCreateBookCard";
import UserCreateResponseCard from "./UserCreateResponseCard";

const CreateFlow: React.FC<{
  user: User;
  refreshUser: () => Promise<void>;
  onDone?: () => void;
}> = ({ user, refreshUser, onDone }) => {
  const t = useTranslations("All.createBook"); // next-intl hook
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);

  const steps = [
    t("stepChooseTarget"),
    t("stepCreateBook"),
    t("stepResponses")
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-center">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} active={step} />
        </CardContent>
      </Card>

      {/* Step 0 */}
      {step === 0 && (
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle>{t("stepChooseTarget")}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserChooseTarget
              target={target}
              setTarget={(t) => setTarget(t)}
              onNext={() => setStep(1)}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle>{t("stepCreateBook")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserCreateBookCard
              user={user}
              onCreated={(id) => {
                setBookId(id);
                setStep(2);
              }}
            />
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(0)}>
                {t("back")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && target && bookId && (
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle>{t("stepResponses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserCreateResponseCard
              user={user}
              bookId={bookId}
              target={target}
              onClose={() => {
                setStep(0);
                setTarget(null);
                setBookId(null);
                onDone?.();
              }}
              onCreated={async () => {
                await refreshUser();
              }}
            />
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                {t("backToBook")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateFlow;
