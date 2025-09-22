interface Question {
  id: number;
  question: string;
}
// utils/loadQuestions.ts
export async function loadQuestions(fileName: string): Promise<Question[]> {
  try {
    const res = await fetch(`/questions/${fileName}`);
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
