// src/components/Header.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const { currentUser, currentProject, projects, setCurrentProjectId } = useApp();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const projectRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-header border-b border-surface-container">
      <div className="h-16 w-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo + Project Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {/* Acorn Logo SVG */}
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
                <defs>
                  <linearGradient id="acornBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706"/>
                    <stop offset="100%" stopColor="#B45309"/>
                  </linearGradient>
                  <linearGradient id="acornCap" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78350F"/>
                    <stop offset="100%" stopColor="#451A03"/>
                  </linearGradient>
                  <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </linearGradient>
                </defs>
                <path d="M50 18 C50 12, 56 10, 58 8" stroke="#451A03" strokeWidth="4" strokeLinecap="round" fill="none"/>
                <path d="M52 14 C60 12, 68 16, 66 22 C60 22, 54 18, 52 14 Z" fill="url(#leafGrad)"/>
                <path d="M26 34 C26 25, 74 25, 74 34 C74 39, 26 39, 26 34 Z" fill="url(#acornCap)"/>
                <circle cx="36" cy="32" r="1.5" fill="#92400E" opacity="0.6"/>
                <circle cx="44" cy="30" r="1.5" fill="#92400E" opacity="0.6"/>
                <circle cx="52" cy="30" r="1.5" fill="#92400E" opacity="0.6"/>
                <circle cx="60" cy="32" r="1.5" fill="#92400E" opacity="0.6"/>
                <path d="M28 36 C28 58, 40 76, 50 82 C60 76, 72 58, 72 36 Z" fill="url(#acornBody)"/>
                <circle cx="43" cy="50" r="3" fill="#FFFFFF" opacity="0.95"/>
                <circle cx="57" cy="50" r="3" fill="#FFFFFF" opacity="0.95"/>
                <path d="M47 57 Q50 60 53 57" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M68 28 L70 24 L72 28 L76 30 L72 32 L70 36 L68 32 L64 30 Z" fill="#FBBF24"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-headline-sm text-primary font-bold tracking-tight">도토리</span>
              <span className="text-label-sm bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-medium">
                AI 팀플 중재
              </span>
            </div>
          </div>

          {/* Project Selector with Dropdown */}
          {currentProject && (
            <div ref={projectRef} className="relative hidden sm:block pl-2">
              <button
                onClick={() => setShowProjectDropdown(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
                type="button"
              >
                <span className="text-label-md font-semibold text-on-surface">{currentProject.name}</span>
                <span className="text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-medium">
                  중간발표 D-4
                </span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  {showProjectDropdown ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProjectDropdown && (
                <div className="absolute left-2 top-full mt-1.5 w-72 rounded-xl bg-surface-container-lowest p-2 shadow-tier-3 border border-surface-container z-50">
                  <div className="px-2 py-1.5 text-label-sm text-on-surface-variant font-semibold">
                    참여 중인 팀플 프로젝트
                  </div>
                  <div className="space-y-1">
                    {projects.map(proj => {
                      const isCurrent = proj.project_id === currentProject.project_id;
                      return (
                        <button
                          key={proj.project_id}
                          onClick={() => {
                            setCurrentProjectId(proj.project_id);
                            setShowProjectDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-primary-fixed/40 text-on-surface font-semibold'
                              : 'hover:bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <div>
                            <div className="text-label-md font-medium text-on-surface line-clamp-1">
                              {proj.name}
                            </div>
                            <div className="text-[11px] text-on-surface-variant">
                              코드: {proj.invite_code} · {proj.members.length}명 참여
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="material-symbols-outlined text-[18px] text-primary">
                              check
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications Button & Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifDropdown(prev => !prev)}
              aria-label="알림"
              className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error">
                2
              </span>
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-80 rounded-xl bg-surface-container-lowest p-3 shadow-tier-3 border border-surface-container z-50">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container mb-2">
                  <span className="text-label-md font-bold text-on-surface">알림함</span>
                  <span className="text-[11px] text-primary font-medium">모두 읽음</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-primary-fixed/20 border border-primary/20 text-left">
                    <div className="flex items-center gap-1.5 text-primary text-label-sm font-semibold mb-0.5">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                      AI 소통 중재안 도착
                    </div>
                    <p className="text-[12px] text-on-surface leading-snug">
                      최현우 님이 &apos;경쟁 서비스 자료조사&apos; 분담 협의안에 동의했습니다.
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">10분 전</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low text-left">
                    <div className="flex items-center gap-1.5 text-secondary text-label-sm font-semibold mb-0.5">
                      <span className="material-symbols-outlined text-[16px]">savings</span>
                      도토리 상호부조 완료
                    </div>
                    <p className="text-[12px] text-on-surface leading-snug">
                      백지훈 님에게 발표 준비 지원으로 도토리 1개가 전달되었습니다.
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">2시간 전</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Dropdown */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(prev => !prev)}
              className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-label-sm text-on-primary-fixed font-bold ring-2 ring-secondary">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-label-sm font-semibold text-on-surface">{currentUser.name}</span>
                <span className="text-[11px] text-on-surface-variant">
                  {currentUser.role === 'team_lead' ? '조장' : '조원'} · 🌰 {currentUser.acorns}개
                </span>
              </div>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-surface-container-lowest p-3 shadow-tier-3 border border-surface-container z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-container mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-label-md text-on-primary-fixed font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-label-md font-bold text-on-surface">{currentUser.name}</div>
                    <div className="text-[11px] text-on-surface-variant">{currentUser.email}</div>
                  </div>
                </div>
                <div className="space-y-1 text-label-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant">보유 도토리</span>
                    <span className="text-primary font-bold">🌰 {currentUser.acorns}개</span>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer">
                    프로필 설정
                  </div>
                  <div className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer">
                    로그아웃
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
