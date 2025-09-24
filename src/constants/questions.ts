import { QuestionAnswer } from "@/context/ResponsesContext";

interface Question {
  id: number;
  question: string;
}
// utils/loadQuestions.ts
export async function loadQuestions(fileName: string): Promise<Question[]> {
  try {
    const res = await fetch(`${window.location.origin}/questions/${fileName}`);
    const text = await res.text();
    return text
      .split("\n")
      .filter(Boolean)
      .map((line, index) => ({ id: index + 1, question: line }));
  } catch (err) {
    console.error("Ошибка при загрузке вопросов:", err);
    return [];
  }
}

export interface PropsInterface {
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
  answers: QuestionAnswer[];
  setAnswers: (
    value: QuestionAnswer[] | ((prev: QuestionAnswer[]) => QuestionAnswer[])
  ) => void;
  createResponse: (
    user_id: string,
    target: string,
    data: { questions: QuestionAnswer[] }
  ) => Promise<void>;
  onCreated?: () => void;
  user_id: string;
}
export const TARGET_FILES: Record<string, string> = {
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
