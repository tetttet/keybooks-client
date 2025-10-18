"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import { UserResponse } from "@/context/UserResponsesContext";

export type PDFProgress = {
  visible: boolean;
  percent: number;
  processed: number;
  total: number;
  etaSeconds: number | null;
  statusText?: string;
  canceled?: boolean;
};

export const usePDFGenerator = () => {
  const [pdfProgress, setPdfProgress] = useState<PDFProgress>({
    visible: false,
    percent: 0,
    processed: 0,
    total: 0,
    etaSeconds: null,
    statusText: "",
    canceled: false,
  });

  const cancelRef = useRef(false);

  // Загрузка изображения в data URL
  const loadImageToDataUrl = async (
    url: string,
    timeout = 8000
  ): Promise<string | null> => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) return null;

      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // Загрузка TTF и регистрация шрифта
  const loadFont = async (doc: jsPDF) => {
    try {
      const fontUrl = "/fonts/Roboto-VariableFont_wdth,wght.ttf";
      const res = await fetch(fontUrl);
      const buffer = await res.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // Конвертируем массив в base64 пакетно
      let binary = "";
      const chunkSize = 0x8000; // 32KB за раз
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }

      const base64 = btoa(binary);
      doc.addFileToVFS("Roboto.ttf", base64);
      doc.addFont("Roboto.ttf", "Roboto", "normal");
      doc.setFont("Roboto", "normal");
    } catch (e) {
      console.error("Не удалось загрузить шрифт:", e);
    }
  };

  const generatePDF = async (bookId: string, responses: UserResponse[]) => {
    cancelRef.current = false;

    setPdfProgress({
      visible: true,
      percent: 0,
      processed: 0,
      total: 0,
      etaSeconds: null,
      statusText: "Подсчитываем элементы...",
      canceled: false,
    });

    const bookResponses = responses.filter((r) => r.book_id === bookId);
    if (!bookResponses.length) {
      setPdfProgress((p) => ({
        ...p,
        statusText: "Нет ответов",
        visible: true,
      }));
      setTimeout(() => setPdfProgress((p) => ({ ...p, visible: false })), 1600);
      return;
    }

    let totalSteps = 0;
    for (const r of bookResponses) {
      totalSteps += 1;
      for (const q of r.answers.questions) {
        totalSteps += 2;
        if (q.image_url) totalSteps += 1;
      }
      totalSteps += 1;
    }

    setPdfProgress((p) => ({
      ...p,
      total: totalSteps,
      statusText: "Генерация PDF...",
    }));

    const doc = new jsPDF("p", "mm", "a4");
    await loadFont(doc); // ✅ регистрация шрифта для кириллицы

    const pageWidth = 190;
    let y = 10;
    const startTime = performance.now();
    let processed = 0;

    const updateProgress = (inc = 1, statusText?: string) => {
      processed += inc;
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const avg = processed > 0 ? elapsed / processed : 0;
      const remain = Math.max(0, totalSteps - processed);
      const eta = remain * avg;
      const percent = Math.min(100, Math.round((processed / totalSteps) * 100));
      setPdfProgress((prev) => ({
        ...prev,
        visible: true,
        percent,
        processed,
        total: totalSteps,
        etaSeconds: isFinite(eta) ? eta : null,
        statusText: statusText ?? prev.statusText ?? "Генерация PDF...",
        canceled: !!cancelRef.current,
      }));
    };

    try {
      for (const r of bookResponses) {
        if (cancelRef.current) break;

        doc.setFontSize(12);
        const targetLines = doc.splitTextToSize(
          `Ответ: ${r.target}`,
          pageWidth
        );
        if (y + targetLines.length * 6 > 290) {
          doc.addPage();
          y = 10;
        }
        doc.text(targetLines, 10, y);
        y += targetLines.length * 6 + 2;
        updateProgress(1);

        for (const q of r.answers.questions) {
          if (cancelRef.current) break;

          doc.setFontSize(10);
          const qLines = doc.splitTextToSize(
            `Вопрос: ${q.question}`,
            pageWidth
          );
          if (y + qLines.length * 5 > 290) {
            doc.addPage();
            y = 10;
          }
          doc.text(qLines, 10, y);
          y += qLines.length * 5 + 2;
          updateProgress(1);

          const aLines = doc.splitTextToSize(`Ответ: ${q.answer}`, pageWidth);
          if (y + aLines.length * 5 > 290) {
            doc.addPage();
            y = 10;
          }
          doc.text(aLines, 10, y);
          y += aLines.length * 5 + 2;
          updateProgress(1);

          if (q.image_url) {
            if (cancelRef.current) break;
            setPdfProgress((p) => ({
              ...p,
              statusText: "Загрузка изображения...",
            }));
            const imgData = await loadImageToDataUrl(q.image_url);
            if (cancelRef.current) break;
            if (imgData) {
              try {
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = 90;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                if (y + pdfHeight > 290) {
                  doc.addPage();
                  y = 10;
                }
                doc.addImage(imgData, "PNG", 10, y, pdfWidth, pdfHeight);
                y += pdfHeight + 5;
              } catch {}
            }
            updateProgress(1);
            setPdfProgress((p) => ({ ...p, statusText: "Генерация PDF..." }));
          }
        }
        y += 5;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      }

      if (cancelRef.current) {
        setPdfProgress((p) => ({
          ...p,
          statusText: "Отменено пользователем",
          canceled: true,
        }));
        setTimeout(
          () => setPdfProgress((p) => ({ ...p, visible: false })),
          900
        );
        return;
      }

      setPdfProgress((p) => ({ ...p, statusText: "Подготовка файла..." }));
      await new Promise((res) => setTimeout(res, 100));
      doc.save(`book_${bookId}_responses.pdf`);
      setPdfProgress((p) => ({ ...p, statusText: "Готово", percent: 100 }));
      setTimeout(() => setPdfProgress((p) => ({ ...p, visible: false })), 1200);
    } catch (err) {
      console.error("Ошибка при генерации PDF:", err);
      setPdfProgress((p) => ({
        ...p,
        statusText: "Ошибка при генерации PDF",
        visible: true,
      }));
    }
  };

  const cancelPdf = () => {
    cancelRef.current = true;
    setPdfProgress((p) => ({ ...p, statusText: "Отмена...", canceled: true }));
  };

  return { pdfProgress, generatePDF, cancelPdf };
};
