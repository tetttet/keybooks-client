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
  "Myself",
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
  "Diri Saya",
];

export interface Target {
  name: string;
  image: string;
}
export const coverDesigns: Target[] = [
  { name: "Stage Mark", image: "/img/stage-mark.png" },
  { name: "Rosé Garden", image: "/img/rose.png" },
  { name: "Sage Bloom", image: "/img/sage.png" },
  { name: "Golden Roses", image: "/img/golden.png" },
  { name: "Midnight Roses", image: "/img/midnight.png" },
  { name: "Ocean Tide", image: "/img/ocean.png" },
  { name: "Baroque Bloom", image: "/img/bara.png" },
  { name: "Dark Ocean", image: "/img/dark.png" },
  { name: "Peace Whisper", image: "/img/peace.png" },
  { name: "Other", image: "/img/ask.jpg" },
];
export const MS_coverDesigns: Target[] = [
  { name: "Tanda Peringkat", image: "/img/stage-mark.png" },
  { name: "Taman Rosé", image: "/img/rose.png" },
  { name: "Bunga Sage", image: "/img/sage.png" },
  { name: "Mawar Emas", image: "/img/golden.png" },
  { name: "Mawar Tengah Malam", image: "/img/midnight.png" },
  { name: "Pasang Laut", image: "/img/ocean.png" },
  { name: "Bunga Baroque", image: "/img/bara.png" },
  { name: "Laut Gelap", image: "/img/dark.png" },
  { name: "Bisikan Damai", image: "/img/peace.png" },
  { name: "Lain-lain", image: "/img/ask.jpg" },
];

export const whatsappNumber = "60165777740";
export const API_URL = "https://keybooks-server.vercel.app/api";
export const NEXT_URL = "https://keybooks-client.vercel.app";
