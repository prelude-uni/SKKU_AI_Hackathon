// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: '팀플 가이드 | Team Sync & Task Unstuck Assistant',
  description: '대학생 팀 프로젝트 작업 병목 해소와 상호부조 도토리 시스템을 통한 지능형 협업 지원 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
