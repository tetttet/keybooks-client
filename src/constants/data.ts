export const recipients = [
  "Girlfriend",
  "Boyfriend",
  "Wife",
  "Husband",
  "Mother",
  "Father",
  "Brother",
  "Friend",
  "Colleague",
];

export const MS_recipients = [
  "Teman Wanita",
  "Teman Lelaki",
  "Isteri",
  "Suami",
  "Ibu",
  "Bapa",
  "Abang",
  "Kawan",
  "Rakan Sekerja",
];

export interface Target {
  name: string;
  image: string;
}
export const coverDesigns: Target[] = [
  { name: "Бело-голубой", image: "/bg/1.png" },
  { name: "Золотой", image: "/bg/2.png" },
  { name: "Розовый", image: "/bg/3.png" },
  { name: "Тёмный", image: "/bg/4.png" },
];
export const MS_coverDesigns: Target[] = [
  { name: "Biru Muda", image: "/bg/1.png" },
  { name: "Emas", image: "/bg/2.png" },
  { name: "Merah Jambu", image: "/bg/3.png" },
  { name: "Gelap", image: "/bg/4.png" },
];

export const whatsappNumber = "60165777740";
export const API_URL = "https://keybooks-server.vercel.app/api";
export const NEXT_URL = "https://keybooks-client.vercel.app";
