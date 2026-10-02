// src/components/views/AcornWalletView.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface AcornWalletViewProps {
  onNavigate?: (path: string) => void;
}

export default function AcornWalletView({ onNavigate }: AcornWalletViewProps) {
  const { currentUser, currentProject, acornLedger } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'RECEIVED' | 'GIVEN'>('ALL');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'record-1': true, // First item expanded by default
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Preset rich records matching the design system
  const historyRecords = [
    {
      id: 'record-1',
      date: '2026.04.03',
      type: 'RECEIVED',
      typeLabel: '도움받음 +1',
      partnerName: '김민지',
      partnerRole: '조장',
      taskTitle: '[자료조사] 경쟁 서비스 자료조사 및 비교표 정리',
      summary: '“민지가 경쟁 서비스 핵심 3사 자료 선정을 도와줬어요.”',
      aiSummary: '경쟁사 3곳에 대한 시장 점유율 데이터 보완 및 분석 템플릿 정리 완료. 기존 담당 분량 중 해외 레퍼런스 수집 항목(25%)을 민지가 인수하여 마감일 내 상호 제출을 성공적으로 달성했습니다.',
      completedAt: '2026년 4월 3일 16:30 양측 완료 확인',
      hasMediationDoc: true,
    },
    {
      id: 'record-2',
      date: '2026.04.01',
      type: 'GIVEN',
      typeLabel: '도움제공 −1',
      partnerName: '백지훈',
      partnerRole: '조원',
      taskTitle: '[발표준비] 중간 보고서 발표 초안 작성 및 슬라이드 구조화',
      summary: '“지훈의 발표 초안을 함께 검토하고 피드백하여 흐름을 정돈했어요.”',
      aiSummary: '발표 슬라이드 12p의 흐름을 재구성하고 논리적 비약을 보완. 발표 대본 및 예상 질문 5개를 함께 도출하여 리허설 준비를 마쳤습니다.',
      completedAt: '2026.04.01 19:10 완료',
      hasMediationDoc: true,
    },
    {
      id: 'record-3',
      date: '2026.03.28',
      type: 'RECEIVED',
      typeLabel: '도움받음 +1',
      partnerName: '정수빈',
      partnerRole: '조원',
      taskTitle: '[현장조사] 대학생 타겟 사용자 심층 인터뷰 내용 분석',
      summary: '“수빈이 음성 녹취 3회차 텍스트 변환 및 인터뷰 내용을 함께 정리해줬어요.”',
      aiSummary: '1시간 분량의 녹취록 텍스트 분석 및 키워드 클러스터링 지원. 사용자 고통 지점(Pain Point) 4개를 명확히 도출하여 보고서에 반영 완료했습니다.',
      completedAt: '2026.03.28 21:40 완료',
      hasMediationDoc: false,
    },
    {
      id: 'record-4',
      date: '2026.03.22',
      type: 'RECEIVED',
      typeLabel: '도움받음 +1',
      partnerName: '최현우',
      partnerRole: '조원',
      taskTitle: '[시장분석] 모빌리티 플랫폼 비즈니스 모델(BM) 비교 분석',
      summary: '“현우가 플랫폼 BM 비교 분석에 필요한 그래프 및 수치 자료를 보완해줬어요.”',
      aiSummary: '국내외 4개 모빌리티 업체의 수익 모델 및 거래액 추이 데이터 시각화 작업 분담. 깔끔한 비교 차트 3종 생성 및 수치 검증을 마쳤습니다.',
      completedAt: '2026.03.22 14:15 완료',
      hasMediationDoc: false,
    },
  ];

  const filteredRecords = historyRecords.filter(r => {
    if (filterType === 'RECEIVED') return r.type === 'RECEIVED';
    if (filterType === 'GIVEN') return r.type === 'GIVEN';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link & Header Area */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-label-md group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span>대시보드로 돌아가기</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {currentProject?.name || '경영학원론 4조 · ESG 경영전략'}
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <h1 className="font-headline text-headline-xl text-on-surface tracking-tight font-bold">
            도토리 주머니 &amp; 기록
          </h1>
          <p className="text-body-md text-on-surface-variant">
            주고받은 도움 내역과 현재 보유한 도토리를 투명하고 편안하게 확인하세요.
          </p>
        </div>
      </div>

      {/* My Acorn Pocket Card (Hero Element) */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-tier-1">
        {/* Ambient Warm Tone Glow Behind Graphic */}
        <div className="absolute -right-8 -top-8 w-60 h-60 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -bottom-6 w-44 h-44 rounded-full bg-surface-container-low/60 blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Acorn Balance & Visual Representation */}
          <div className="flex items-start gap-4">
            {/* Acorn Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shadow-sm shrink-0">
              <span aria-label="도토리 주머니" className="text-3xl select-none" role="img">
                🌰
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-md text-on-surface-variant tracking-wide uppercase font-medium">
                내 도토리 주머니
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-[44px] leading-none text-primary font-bold tracking-tight">
                  {currentUser.acorns}개
                </span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-low">
                  {Array.from({ length: Math.min(currentUser.acorns, 8) }).map((_, i) => (
                    <span key={i} className="text-base select-none" title={`보유 도토리 ${i + 1}`}>
                      🌰
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                도움을 받으면 쌓이고, 다른 팀원을 도우면 자연스럽게 줄어들어요.
              </p>
            </div>
          </div>

          {/* Right: Sub-summary metric (No ranking, neutral state) */}
          <div className="flex items-center gap-4 self-start md:self-auto bg-surface-container-low/70 px-4 py-3 rounded-xl border border-surface-container">
            <div className="flex flex-col">
              <span className="text-label-sm text-outline">최근 협업 상태</span>
              <span className="font-headline text-headline-sm text-on-surface flex items-center gap-1.5 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-secondary">handshake</span>
                상호 지원 원활
              </span>
            </div>
            <div className="h-8 w-[1px] bg-surface-container-highest"></div>
            <div className="flex flex-col">
              <span className="text-label-sm text-outline">누적 교환 건수</span>
              <span className="font-headline text-headline-sm text-on-surface mt-0.5 font-semibold">
                총 {historyRecords.length}건 완료
              </span>
            </div>
          </div>
        </div>

        {/* Helpful Rule Tooltip / Hint Box */}
        <div className="relative z-10 mt-5 pt-4 flex items-start gap-3 bg-surface-container rounded-xl p-4 text-on-surface">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-label-md text-on-surface font-semibold">도토리 배분 원칙</span>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              AI는 도움 후보를 찾을 때 각자의 현재 업무량과 가능한 역할을 먼저 살피고, 그중 도토리가 많은 사람을 우선 검토해 공평한 균형을 맞춰요. (도움 완료 시점에 기록에 자동 반영됩니다)
            </p>
          </div>
        </div>
      </section>

      {/* Help History Section */}
      <section className="flex flex-col space-y-4">
        {/* Section Top Bar */}
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-headline-lg text-on-surface font-bold">도움 기록</h2>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm">
              총 {filteredRecords.length}건
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded text-label-sm font-medium transition-colors ${
                  filterType === 'ALL'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterType('RECEIVED')}
                className={`px-2.5 py-1 rounded text-label-sm font-medium transition-colors ${
                  filterType === 'RECEIVED'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                도움받음 (+)
              </button>
              <button
                onClick={() => setFilterType('GIVEN')}
                className={`px-2.5 py-1 rounded text-label-sm font-medium transition-colors ${
                  filterType === 'GIVEN'
                    ? 'bg-surface-container-lowest text-secondary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                도움제공 (-)
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-outline text-label-sm pl-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                완료된 도움만 표시됩니다
              </span>
            </div>
          </div>
        </div>

        {/* History Cards Stack */}
        <div className="flex flex-col space-y-3">
          {filteredRecords.map(record => {
            const isExpanded = !!expandedItems[record.id];
            const isReceived = record.type === 'RECEIVED';

            return (
              <article
                key={record.id}
                className="rounded-xl bg-surface-container-lowest p-4 shadow-sm hover:shadow-tier-2 transition-all border border-surface-container"
              >
                {/* Main Line */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2">
                  <div className="flex items-start md:items-center gap-2 flex-wrap">
                    <span className="font-code text-code-sm text-outline">{record.date}</span>
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${
                        isReceived
                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <span>{record.typeLabel}</span>
                      <span className="text-xs">🌰</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm">
                      상대: {record.partnerName} ({record.partnerRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-outline text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                      <span>중재 합의 완료</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(record.id)}
                      className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-label-sm transition-colors py-1 pl-2 cursor-pointer"
                      type="button"
                    >
                      <span>{isExpanded ? '접기' : '상세 보기'}</span>
                      <span className="material-symbols-outlined text-[18px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Task & Summary Statement */}
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-headline-sm text-on-surface hover:text-primary cursor-pointer transition-colors font-semibold">
                      {record.taskTitle}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant">
                    {record.summary}
                  </p>
                </div>

                {/* Expanded AI Accordion Area */}
                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-surface-container">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-tertiary">
                        <span className="material-symbols-outlined text-[18px]">psychology</span>
                        <span className="text-label-md font-semibold">AI 소통 중재 요약</span>
                      </div>
                      <span className="font-code text-code-sm text-outline">{record.completedAt}</span>
                    </div>
                    <p className="text-body-sm text-on-surface bg-surface-container-lowest p-3 rounded-lg leading-relaxed border border-surface-container">
                      {record.aiSummary}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onNavigate && onNavigate('checklist')}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-container text-label-md font-medium transition-colors cursor-pointer"
                        >
                          <span>관련 과업 보기</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                        </button>
                        {record.hasMediationDoc && (
                          <button
                            onClick={() => onNavigate && onNavigate('mediation')}
                            className="inline-flex items-center gap-1 text-tertiary hover:text-on-tertiary-fixed-variant text-label-md font-medium transition-colors cursor-pointer"
                          >
                            <span>협의안 원문 보기</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                          </button>
                        )}
                      </div>
                      <span className="text-label-sm text-outline">
                        도토리 주머니 {isReceived ? '+1' : '-1'} 반영됨
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Calculation Footnote (Subtle reassurance card) */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-on-surface-variant text-label-sm border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
            <span>
              도토리 누적 산출: 기본 배정(2) + 도움받음(3) − 도움제공(1) ={' '}
              <strong className="text-on-surface font-bold">현재 {currentUser.acorns}개 보유</strong>
            </span>
          </div>
          <div className="text-outline">상대방 완료 승인 시 실시간 동기화</div>
        </div>
      </section>
    </div>
  );
}
