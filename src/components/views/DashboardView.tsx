// src/components/views/DashboardView.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import StuckReportModal from '../StuckReportModal';

interface DashboardViewProps {
  onNavigate: (path: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { tasks, currentUser, mediationRooms, currentProject, acceptMediationOption } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [stuckTaskId, setStuckTaskId] = useState<string | null>(null);

  const projectTasks = tasks.filter(t => t.project_id === currentProject?.project_id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'COMPLETED' || t.status === 'RESOLVED').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressTasks = projectTasks.filter(t => t.status === 'IN_PROGRESS');
  const stuckTasks = projectTasks.filter(t => t.status === 'STUCK' || t.status === 'IN_MEDIATION');
  const doneTasks = projectTasks.filter(t => t.status === 'COMPLETED' || t.status === 'RESOLVED');
  const myTasks = projectTasks.filter(t => t.assignee_id === currentUser.id);

  const activeMediations = mediationRooms.filter(
    m => (m.status === 'IN_DISCUSSION' || m.status === 'PROPOSED') && m.project_id === currentProject?.project_id
  );

  const filters = [
    { key: 'all', label: `전체 과업 (${totalTasks})` },
    { key: 'mine', label: `내 할 일 (${myTasks.length})` },
    { key: 'progress', label: `진행 중 (${inProgressTasks.length})` },
    { key: 'stuck', label: `마감 임박 (${stuckTasks.length})`, isError: true },
    { key: 'mediation', label: `중재/도움 필요 (${activeMediations.length})`, isAI: true },
  ];

  return (
    <>
      {/* ===== Project Banner ===== */}
      <header className="w-full bg-surface-container-lowest rounded-xl p-4 lg:p-6 shadow-sm mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                경영대학 팀플
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-semibold">
                D-4 마감 임박
              </span>
              <span className="text-body-sm text-on-surface-variant font-medium">
                최종 마감: 2025. 05. 24 (토) 23:59
              </span>
            </div>
            <h1 className="font-headline text-headline-lg text-on-surface font-bold tracking-tight">
              경영정보시스템 ESG 기업분석 및 전략 제안 3조
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              국내 플랫폼 대표기업 ESG 경영 성과 진단 및 지속가능 비즈니스 모델 도출 · 발표 자료 제출 대비
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-label-md font-bold text-on-surface">전체 프로젝트 진행률</span>
              <span className="font-headline text-headline-sm font-bold text-primary">{progressPercent}%</span>
              <span className="text-body-sm text-on-surface-variant">(총 {totalTasks}개 중 {completedTasks}개 완료)</span>
            </div>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/70">
              <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-secondary font-bold">1단계 · 완료</span>
                <span className="text-label-sm text-on-surface font-medium truncate">주제 및 기업 선정</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-fixed/40 ring-1 ring-primary/20">
              <span className="material-symbols-outlined text-[20px] text-primary animate-pulse">radio_button_checked</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-primary font-bold">2단계 · 진행 중</span>
                <span className="text-label-sm text-on-surface font-semibold truncate">기업 분석 &amp; 지표 조사</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/70 opacity-75">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">schedule</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-on-surface-variant font-medium">3단계 · 대기</span>
                <span className="text-label-sm text-on-surface font-medium truncate">보고서 및 PPT 제작</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/70 opacity-75">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">mic</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-on-surface-variant font-medium">4단계 · 대기</span>
                <span className="text-label-sm text-on-surface font-medium truncate">시연 및 최종 발표</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Main 2-Column Grid ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT: Tasks & Checklists */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* Filter Chips */}
          <section aria-label="과업 필터" className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-label-sm font-medium shrink-0 shadow-sm transition-colors ${
                  activeFilter === f.key
                    ? 'bg-on-surface text-surface font-semibold'
                    : f.isError
                    ? 'bg-surface-container-lowest hover:bg-surface-container text-error flex items-center gap-1'
                    : f.isAI
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold flex items-center gap-1'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                }`}
                type="button"
              >
                {f.isError && activeFilter !== f.key && <span className="w-1.5 h-1.5 rounded-full bg-error"></span>}
                {f.isAI && activeFilter !== f.key && <span className="material-symbols-outlined text-[15px]">smart_toy</span>}
                {f.label}
              </button>
            ))}
          </section>

          {/* In Progress Tasks */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-secondary text-[13px] font-bold">🏃</span>
                <h3 className="font-headline text-headline-sm text-on-surface font-bold">
                  진행 중인 과업 <span className="text-on-surface-variant font-normal text-body-md">({inProgressTasks.length}건)</span>
                </h3>
              </div>
              <span className="text-label-sm text-secondary font-medium">정상 추진 중</span>
            </div>

            {/* Featured Task Card with AI Proposal */}
            <article className="p-4 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low border border-primary-fixed ring-1 ring-primary/20 transition-colors mb-3 shadow-tier-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2.5">
                  <input className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" type="checkbox" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                        마감 3시간 전
                      </span>
                    </div>
                    <label className="font-headline text-[16px] font-bold text-on-surface block leading-snug cursor-pointer">
                      국내 주요 플랫폼 기업(카카오, 네이버) ESG 보고서 정량지표 비교표 작성
                    </label>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-1 font-medium text-on-surface">
                        <span className="w-4 h-4 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-[10px] font-bold">나</span>
                        이준혁 (나)
                      </span>
                      <span>•</span>
                      <span className="text-error font-semibold">오늘 18:00 마감 (임박)</span>
                      <span>•</span>
                      <span>완료 기준: 스프레드시트 3개년 차트</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold shrink-0">
                  <span className="material-symbols-outlined text-[13px]">handshake</span>
                  AI 협의안 대기
                </span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-primary text-[15px]">🌰</span>
                  <p className="text-[12px] text-on-surface font-medium truncate">
                    AI 제안: 최현우 님이 네이버 파트 분담 지원 (1🌰 전달 / 마감 18시간 연장)
                  </p>
                </div>
                <button
                  className="shrink-0 px-3.5 py-1.5 rounded-md bg-primary text-on-primary hover:bg-primary-container text-label-sm font-semibold transition-colors shadow-sm"
                  type="button"
                >
                  협의안 확인하기 (수락 대기)
                </button>
              </div>
            </article>

            {/* Second Task */}
            <article className="p-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <input className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" type="checkbox" />
                  <div>
                    <label className="font-headline text-[15px] font-semibold text-on-surface block leading-snug cursor-pointer">
                      최종 발표용 PPT 마스터 템플릿 제작
                    </label>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-label-sm text-on-surface-variant">
                      <span className="font-medium text-on-surface">최현우</span>
                      <span>•</span>
                      <span>05.22 (목) 18:00</span>
                      <span>•</span>
                      <span>완료 기준: 16:9 비율 25장 슬라이드 템플릿</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 w-48">
                      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-[11px] text-primary font-bold">40%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStuckTaskId('tsk_ppt')}
                  className="shrink-0 px-2.5 py-1 rounded-md bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary text-[12px] font-medium transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">help_outline</span>
                  <span>&apos;막혔어요&apos;</span>
                </button>
              </div>
            </article>
          </div>

          {/* Completed Tasks */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container text-secondary text-[14px]">✓</span>
                <h3 className="font-headline text-headline-sm text-on-surface font-bold">
                  완료된 과업 <span className="text-on-surface-variant font-normal text-body-md">(7건 중 최근 2건)</span>
                </h3>
              </div>
              <button className="text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1 font-medium" type="button">
                <span>전체 보기</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/40 text-on-surface-variant">
                <div className="flex items-center gap-2 line-through">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span className="text-body-sm font-medium">주제 선정 및 지도교수님 사전 컨펌</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">김민지 · 05.15 완료</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/40 text-on-surface-variant">
                <div className="flex items-center gap-2 line-through">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span className="text-body-sm font-medium">팀원별 R&amp;R 분장 및 회의록 업로드</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">이준혁 · 05.16 완료</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Mediation Panel */}
        <aside className="xl:col-span-5 flex flex-col gap-4">
          {/* AI Mediation & Pending Agreements */}
          {activeMediations.length > 0 && (
            <section className="bg-gradient-to-b from-primary-fixed/25 to-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                  </span>
                  <div>
                    <h2 className="font-headline text-headline-sm text-on-surface font-bold leading-tight">
                      AI 소통 중재 &amp; 합의 대기
                    </h2>
                    <span className="text-[11px] text-primary font-bold">
                      {activeMediations.length}건의 역할 재조정 제안이 도착했습니다
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold animate-pulse">
                  응답 대기
                </span>
              </div>

              {/* AI Proposal Box */}
              <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm mb-3">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-surface-container">
                  <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
                  <span className="text-label-md font-bold text-on-surface">과업 일정 및 역할 재조정 협의안</span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="p-2 rounded bg-surface-container-low text-label-sm">
                    <div className="font-bold text-on-surface mb-0.5">과업: 국내 플랫폼 기업 ESG 정량지표 비교표</div>
                    <div className="text-on-surface-variant">기존: 이준혁 단독 (05.20 18:00 마감 · 자료조사 분량 과다로 부담)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary-fixed/30 space-y-1 text-[12px] text-on-surface">
                    <div className="font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                      AI 자동 중재 제안:
                    </div>
                    <p>1. <strong>최현우</strong> 님이 <strong>&apos;네이버 정량 지표&apos;</strong>를 대신 조사 (최현우 님 여유도 85%, 도토리 3개)</p>
                    <p>2. 최종 제출 기한을 <strong>05.21 (수) 12:00</strong>로 18시간 연장</p>
                    <p>3. 수락시 이준혁 님이 도토리 <strong>🌰 1개</strong>를 최현우 님에게 전달</p>
                  </div>
                </div>

                {/* Team Responses */}
                <div className="space-y-1.5 pb-3 mb-3 border-b border-surface-container">
                  <div className="text-label-sm text-on-surface-variant font-bold mb-1">팀원 동의 현황 (2/3 완료)</div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 font-semibold text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      이준혁 (나)
                    </span>
                    <span className="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">수락 대기중</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[15px] text-secondary">check</span>
                      최현우 (분담 지원자)
                    </span>
                    <span className="text-[11px] font-medium text-secondary">수락 완료</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[15px] text-secondary">check</span>
                      김민지 (조장)
                    </span>
                    <span className="text-[11px] font-medium text-secondary">승인 완료</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeMediations[0]) {
                        const option = activeMediations[0].proposed_options[1]; // 권장 옵션
                        if (option) acceptMediationOption(activeMediations[0].mediation_id, option.id);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-bold text-center shadow transition-all"
                    type="button"
                  >
                    합의안 최종 수락하기
                  </button>
                  <button className="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-medium transition-colors" type="button">
                    수정 요청
                  </button>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* Stuck Report Modal */}
      {stuckTaskId && (
        <StuckReportModal
          isOpen={true}
          task={tasks.find(t => t.task_id === stuckTaskId)}
          onClose={() => setStuckTaskId(null)}
        />
      )}
    </>
  );
}
