import type { Metadata } from "next";

const baseMetadata: Metadata = {
  title: {
    default: "KeyBooks — Personalized and Custom-Made Books",
    template: "%s | KeyBooks",
  },
  description:
    "KeyBooks creates beautiful personalized books for every occasion. From custom storybooks and unique gifts to professional editions, we turn your ideas into timeless books.",
  keywords: [
    "personalized books",
    "custom books",
    "gift books",
    "custom storybooks",
    "photo books",
    "KeyBooks",
    "book design",
    "unique gifts",
    "bespoke publishing",
    "customized printing",
  ],
  icons: {
    icon: "/icon.jpg",
  },
  openGraph: {
    title: "KeyBooks — Personalized and Custom-Made Books",
    description:
      "Discover KeyBooks: a service where we design and create personalized books tailored just for you. Perfect for gifts, stories, and special memories.",
    url: "https://keybooks.com",
    siteName: "KeyBooks",
    images: [
      {
        url: "/icon.jpg",
        width: 512,
        height: 512,
        alt: "KeyBooks Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyBooks — Personalized and Custom-Made Books",
    description:
      "KeyBooks creates unique personalized books for gifts, stories, and unforgettable moments.",
    images: ["/icon.jpg"],
  },
};

export function generateMetadata(overrides: Metadata = {}): Metadata {
  return {
    ...baseMetadata,
    ...overrides,
    title: overrides.title !== undefined ? overrides.title : baseMetadata.title,
    openGraph: {
      ...baseMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...overrides.twitter,
    },
  };
}
