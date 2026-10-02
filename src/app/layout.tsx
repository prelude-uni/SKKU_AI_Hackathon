// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: '도토리 | AI 팀플 중재 플랫폼',
  description: '대학생 팀 프로젝트 작업 병목 해소와 상호부조 도토리 시스템을 통한 지능형 협업 지원 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-body text-body-md text-on-surface antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
