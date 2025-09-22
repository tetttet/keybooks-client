import jsPDF from "jspdf";

export interface Question {
  id: string | number;
  question: string;
  answer?: string | null;
}

export interface Answers {
  questions: Question[];
}

export interface Response {
  id: number;
  user_id: string;
  target: string;
  answers: Answers;
}

export interface UserData {
  id: string;
  username: string;
}

export const downloadResponsePDF = (r: Response, users: Record<string, UserData>) => {
  const doc = new jsPDF();
  doc.setFontSize(11);

  doc.text(`User Name: ${users[r.user_id]?.username || "—"}`, 10, 10);
  doc.text(`For Who: ${r.target}`, 10, 20);

  let y = 30;
  const pageHeight = doc.internal.pageSize.height;

  r.answers.questions.forEach((q: Question) => {
    const questionText = `${q.question}:`;
    const answerText = q.answer || "—";
    const splitAnswer = doc.splitTextToSize(answerText, 180);

    doc.text(questionText, 10, y);
    y += 7;

    splitAnswer.forEach((line: string) => {
      if (y > pageHeight - 10) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 12, y);
      y += 6;
    });

    y += 1;
  });

  doc.save(
    `response_${users[r.user_id]?.username || "unknown"}_${r.target}_${r.id}.pdf`
  );
};
