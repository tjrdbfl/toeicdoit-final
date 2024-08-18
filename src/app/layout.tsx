import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import LayoutWrapper from "./LayoutWrapper";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans_KR({
  preload: false,
  style: "normal",
});

export const metadata: Metadata = {
  title: "Toeicdoit",
  description: "토익 점수 향상을 위한 최고의 선택! 다양한 난이도의 실전 문제와 상세한 해설, 맞춤형 학습 기능을 제공합니다. 지금 바로 시작하세요!", 
  openGraph: {
    title: "Toeicdoit - 토익 문제 풀고 실력 향상!", 
    description: "토익 점수 향상을 위한 최고의 선택! 다양한 난이도의 실전 문제와 상세한 해설, 맞춤형 학습 기능을 제공합니다. 지금 바로 시작하세요!",
    type: "website", 
    url: "https://www.toeicdoit.site", 
    images: [
      {
        url: "/public/images/metadata/main-image.png", 
        width: 1200,
        height: 630,
        alt: "Toeicdoit 대표 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", 
    title: "Toeicdoit - 토익 문제 풀고 실력 향상!",
    description: "토익 점수 향상을 위한 최고의 선택! 다양한 난이도의 실전 문제와 상세한 해설, 맞춤형 학습 기능을 제공합니다. 지금 바로 시작하세요!",
    images: [
      "/public/images/metadata/main-image.png",
    ],
  },
  keywords: [
    "토익", "TOEIC", "토익 문제", "토익 풀기", "토익 공부", "토익 학습", "토익 모의고사", "토익 해설", "토익 점수 향상", 
  ], 
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSans.className}`}>
        <div className="bg-white overflow-hidden">
          <LayoutWrapper>
            {modal}
            {children}
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
