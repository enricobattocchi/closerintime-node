import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "#closerintime",
    template: "%s #closerintime",
  },
  description: "Visualize the time between historical events.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "closerintime",
    description: "Visualize the time between historical events.",
    siteName: "closerintime",
  },
  twitter: {
    card: "summary",
    title: "closerintime",
    description: "Visualize the time between historical events.",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B2252",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
