// src/components/views/MediationView.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface MediationViewProps {
  onNavigate?: (path: string) => void;
}

export default function MediationView({ onNavigate }: MediationViewProps) {
  const { mediationRooms, currentUser, currentProject, addMediationChatMessage, acceptMediationOption } = useApp();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeMediation = mediationRooms.find(
    m => m.project_id === currentProject?.project_id && (m.status === 'IN_DISCUSSION' || m.status === 'PROPOSED')
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMediation?.chat_messages.length]);

  const handleSend = () => {
    if (!chatInput.trim() || !activeMediation) return;
    addMediationChatMessage(activeMediation.mediation_id, chatInput);
    setChatInput('');
  };

  if (!activeMediation) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4">forum</span>
        <h2 className="font-headline text-headline-md text-on-surface font-bold mb-2">활성 중재 세션이 없습니다</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-md">
          팀원이 과업 진행 중 &apos;막혔어요&apos; 버튼을 누르면 AI 소통 중재방이 자동으로 생성됩니다.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <header className="flex flex-col gap-2 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
            <span>{currentProject?.name}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-tertiary font-medium">AI 소통 중재방</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-on-surface bg-surface-container px-2.5 py-0.5 rounded-full">
              {activeMediation.task_title} 중재 세션
            </span>
          </nav>
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>대시보드로 돌아가기</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-headline text-headline-md text-on-surface tracking-tight">
                AI 소통 중재방: {activeMediation.task_title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                중재 조율 중 (협의안 검토)
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-3xl">
              팀원 간의 부담 없는 솔직한 소통을 위해 <span className="font-semibold text-primary">AI 도토리</span>가 작업 병목을 경청하고 최적의 역할·기한·도토리 보상을 다정하게 조율해 드립니다.
            </p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden" style={{ height: '720px' }}>
        {/* Chat Top Bar */}
        <div className="px-4 py-3.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest p-1 shadow-sm ring-1 ring-outline-variant/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="28" height="28">
                <defs>
                  <linearGradient id="ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706"/>
                    <stop offset="100%" stopColor="#B45309"/>
                  </linearGradient>
                  <linearGradient id="ac" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78350F"/>
                    <stop offset="100%" stopColor="#451A03"/>
                  </linearGradient>
                </defs>
                <path d="M50 18 C50 12, 56 10, 58 8" stroke="#451A03" strokeWidth="4" strokeLinecap="round" fill="none"/>
                <path d="M26 34 C26 25, 74 25, 74 34 C74 39, 26 39, 26 34 Z" fill="url(#ac)"/>
                <path d="M28 36 C28 58, 40 76, 50 82 C60 76, 72 58, 72 36 Z" fill="url(#ab)"/>
                <circle cx="43" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                <circle cx="57" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                <path d="M47 57 Q50 60 53 57" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-headline-sm text-on-surface font-bold">도토리 AI 소통 중재 스트림</h2>
                <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-semibold">실시간 중재 진행 중</span>
              </div>
              <p className="text-[12px] text-on-surface-variant">
                과업: <span className="font-medium text-on-surface">{activeMediation.task_title}</span> (기존 마감: 오늘 23:59 · 진척도 35%)
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[12px] text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
            암호화 기록 및 도토리 원장 연동
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest/50">
          {/* Timestamp Divider */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
              오늘 18:25 중재 세션 시작
            </span>
          </div>

          {/* Chat Messages */}
          {activeMediation.chat_messages.map((msg, idx) => {
            const isAI = msg.user_id === 'darami_bot';
            const isMe = msg.user_id === currentUser.id;

            return (
              <div key={msg.id || idx} className={`flex items-start gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {isAI ? (
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low p-1 shadow-sm ring-1 ring-outline-variant/30 shrink-0 mt-0.5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
                      <defs>
                        <linearGradient id={`ab${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#D97706"/>
                          <stop offset="100%" stopColor="#B45309"/>
                        </linearGradient>
                      </defs>
                      <path d="M26 34 C26 25, 74 25, 74 34 C74 39, 26 39, 26 34 Z" fill="#451A03"/>
                      <path d="M28 36 C28 58, 40 76, 50 82 C60 76, 72 58, 72 36 Z" fill={`url(#ab${idx})`}/>
                      <circle cx="43" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                      <circle cx="57" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                      <path d="M47 57 Q50 60 53 57" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold mt-0.5 shadow-sm ${
                    isMe ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface'
                  }`}>
                    {msg.user_name.charAt(0)}
                  </div>
                )}

                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                    <span className={`text-label-sm font-semibold ${isAI ? 'text-primary font-bold' : 'text-on-surface'}`}>
                      {msg.user_name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{msg.created_at}</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl text-body-sm leading-relaxed shadow-sm ${
                    isAI
                      ? 'rounded-tl-sm bg-surface-container-low text-on-surface border border-outline-variant/20'
                      : isMe
                      ? 'rounded-tr-sm bg-primary-fixed text-on-primary-fixed'
                      : 'rounded-tl-sm bg-surface-container text-on-surface'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Agreement Card in Chat */}
          {activeMediation.proposed_options.length > 0 && (
            <div className="flex items-start gap-3 max-w-[96%]">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed p-1 shadow-sm ring-1 ring-primary/30 shrink-0 mt-0.5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
                  <path d="M26 34 C26 25, 74 25, 74 34 C74 39, 26 39, 26 34 Z" fill="#451A03"/>
                  <path d="M28 36 C28 58, 40 76, 50 82 C60 76, 72 58, 72 36 Z" fill="#D97706"/>
                  <circle cx="43" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                  <circle cx="57" cy="50" r="3" fill="#FFF" opacity="0.95"/>
                  <path d="M47 57 Q50 60 53 57" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <div className="space-y-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-label-sm font-bold text-primary">도토리 AI 중재자</span>
                  <span className="text-[10px] text-on-primary-fixed bg-primary-fixed px-2 py-0.5 rounded-full font-semibold">공식 중재 협의안 제안</span>
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest shadow-md border-2 border-primary-fixed">
                  {/* Agreement Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px] text-primary">assignment_turned_in</span>
                      <div>
                        <h3 className="font-headline text-headline-sm text-on-surface font-bold">과업 일정 및 역할 재조정 협의안</h3>
                        <span className="text-[11px] text-on-surface-variant">병목 해소와 공정 기여를 반영한 최적안입니다.</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold shrink-0">
                      검토 필요
                    </span>
                  </div>

                  {/* Proposal Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
                    {activeMediation.proposed_options.map((opt, i) => (
                      <div key={opt.id} className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                          i === 0 ? 'bg-surface-container-high text-on-surface-variant' : 'bg-secondary-fixed text-on-secondary-fixed'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-on-surface-variant">{opt.title.split(':')[0]}</span>
                          <p className="text-[13px] font-medium text-on-surface mt-0.5">{opt.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const opt = activeMediation.proposed_options[1] || activeMediation.proposed_options[0];
                        acceptMediationOption(activeMediation.mediation_id, opt.id);
                      }}
                      className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      협의안 수락하기
                    </button>
                    <button className="py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-medium transition-colors flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      조건 수정 요청
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-3.5 py-2 shadow-sm border border-outline-variant/30">
            <button aria-label="파일 첨부" className="text-on-surface-variant hover:text-on-surface transition-colors p-1" type="button">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <input
              className="w-full bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
              placeholder="도토리 AI 또는 팀원들에게 협의안 관련 의견을 남겨주세요..."
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold hover:bg-tertiary-fixed-dim transition-colors shrink-0" title="톤앤매너 다듬기" type="button">
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
              톤앤매너 다듬기
            </button>
            <button
              onClick={handleSend}
              aria-label="메시지 전송"
              className="w-8 h-8 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors shrink-0 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
          <div className="flex items-center justify-between px-1 text-[11px] text-on-surface-variant">
            <span>💡 팁: AI가 팀원의 감정을 해치지 않는 공손하고 명확한 비즈니스 커뮤니케이션으로 자동 교정합니다.</span>
            <span className="font-code text-code-sm">Markdown 지원</span>
          </div>
        </div>
      </div>
    </>
  );
}
