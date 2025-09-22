"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // состояние загрузки
  const { login } = useAuth();
  const t = useTranslations("All.login");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // включаем загрузку
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col sm:flex-row lg:h-screen">
      {/* Левая часть - форма */}
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 bg-[#0d2523] p-8 sm:p-12">
        <h1 className="text-3xl font-bold mb-6 text-white text-center mt-16 lg:mt-0">
          {t("title")}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 text-white"
        >
          <div>
            <Label htmlFor="username" className="mb-2">
              {t("username")}
            </Label>
            <Input
              id="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // блокируем поле во время загрузки
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 bg-white text-black hover:bg-gray-200 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">{t("loading")}</span>
            ) : (
              t("loginButton")
            )}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>

      {/* Правая часть - картинка */}
      <div className="w-full sm:w-1/2 h-64 sm:h-auto">
        <Image
          width={800}
          height={1000}
          src="/bg/login-illustration.jpg"
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
