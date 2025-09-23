import { Instagram } from "lucide-react";
import React from "react";

const reviews = [
  "I surprised my best friend with this book. She was speechless! She kept saying how special it felt to see our memories in print something she’ll treasure forever.",
  "He surprised me with our story in a book. I’ll never forget it. Thank you Keybooks❤️",
  "I gave the book to my mom, and she couldn’t stop smiling. She told me this was the most beautiful present she’s ever had, because it came straight from the heart.",
  "She cried. She smiled. She said it was the best gift ever 🥰🥰🥰",
  "We made a book for our parents, and when they read it, they both teared up. It brought back so many memories and reminded us all of the love in our family.",
  "I wanted to give my girlfriend something more than just a gift something she could treasure forever. When she opened the book, I saw tears in her eyes and the biggest smile and cry. She told me this was the most special surprise of her life.",

  "Saya hadiahkan buku ini kepada ibu saya. Dia sangat terharu, katanya setiap halaman membuatnya merasa kembali ke masa lalu bersama keluarga. Ia menyimpannya dengan penuh kasih sayang di ruang tamu.",
  "Creating this book for my brother’s wedding was the best decision ever. Everyone flipped through it during the reception, laughing and crying at the same time. It turned into the highlight of the evening.",
  "Bila suami saya buka buku ini, dia terus diam lama sambil tersenyum. Dia kata setiap kata dalam buku itu terasa begitu jujur, dan ia akan menjadi kenangan yang tidak ternilai sepanjang hidup kami.",
  "I gifted this book to my father on his birthday. He told me it was more than just a present it was a legacy of love and memories he can hold on to forever.",
];

//https://www.instagram.com/keybooks.my?igsh=djZ4a294eDR5YTRn

const Review = () => {
  return (
    <>
      <div className="bg-[#f3f4f7]">
        <div className="flex gap-4 overflow-x-auto px-4 snap-x scrollbar-none">
          {reviews.map((text, idx) => (
            <div
              key={idx}
              className="snap-center shrink-0 w-72 h-36 bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center"
            >
              <p className="text-gray-700 text-xs leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#f3f4f7] pb-10">
        <button className="flex justify-center w-full">
          <a
            href="https://www.instagram.com/keybooks.my"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white max-w-md mx-auto mt-6 px-4 py-2 rounded-2xl text-sm border border-gray-200 font-medium hover:bg-gray-100 flex items-center gap-2"
          >
            Больше отзывов в Instagram
            <Instagram className="w-6 h-6 text-black" size={16} />
          </a>
        </button>
      </div>
    </>
  );
};

export default Review;
