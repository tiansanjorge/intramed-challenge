import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import Providers from "@/app/providers/Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Rick & Morty Challenge",
  description: "Frontend challenge with Next.js, Redux, Tailwind",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-montserrat antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-[#E6E7E3]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
