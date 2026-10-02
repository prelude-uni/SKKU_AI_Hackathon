// src/components/Sidebar.tsx
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { path: 'dashboard', label: '팀플 대시보드', icon: 'space_dashboard' },
  { path: 'checklist', label: '체크리스트', icon: 'checklist' },
  { path: 'mediation', label: 'AI 소통 중재방', icon: 'smart_toy', badgeType: 'error' as const },
  { path: 'acorn', label: '도토리 주머니', icon: 'savings', badgeType: 'count' as const },
];

export default function Sidebar({ activePath, onNavigate }: SidebarProps) {
  const { currentProject, mediationRooms, currentUser } = useApp();

  const activeMediations = mediationRooms.filter(m => m.status === 'IN_DISCUSSION' || m.status === 'PROPOSED');

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 bg-surface-container-low shadow-sidebar z-40 flex flex-col justify-between overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        {/* Project Info Card */}
        {currentProject && (
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-tier-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-label-sm text-primary font-semibold tracking-wider uppercase">Project Info</span>
              <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                {currentProject.members.length}명 참여 중
              </span>
            </div>
            <p className="font-headline text-headline-sm text-on-surface font-semibold line-clamp-1">
              경영학원론 4조
            </p>
            <p className="text-body-sm text-on-surface-variant line-clamp-1 mb-2">
              {currentProject.description}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-label-sm text-on-surface-variant">
              <span>
                팀장 <strong className="text-on-surface font-semibold">김민지</strong>
              </span>
              <span className="text-secondary font-medium">조율 활성화</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-1">
          <span className="px-2 text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider mb-1">
            Workspace
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map(item => {
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left w-full ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[20px] ${
                      item.path === 'mediation' && !isActive ? 'text-tertiary' : ''
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {/* Badges */}
                  {item.path === 'mediation' && activeMediations.length > 0 && (
                    <span className="text-label-sm bg-error text-on-error px-2 py-0.5 rounded-full">
                      {activeMediations.length}건
                    </span>
                  )}
                  {item.path === 'acorn' && (
                    <span className="text-label-sm text-primary font-semibold">
                      {currentUser.acorns}개
                    </span>
                  )}
                  {item.path === 'dashboard' && isActive && (
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Team Members Status */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              팀원 현황 & 도토리
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface cursor-pointer">
              info
            </span>
          </div>
          <div className="space-y-1.5">
            {currentProject?.members.map(member => {
              const isMe = member.id === currentUser.id;
              const statusText = isMe ? '중재중' : member.acorns >= 3 ? '자료조사' : member.acorns >= 2 ? '여유' : '지원가능';
              const statusColor = isMe ? 'text-primary' : member.acorns >= 3 ? 'text-tertiary' : member.acorns >= 2 ? 'text-on-surface-variant' : 'text-secondary';

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    isMe
                      ? 'bg-surface-container-lowest/90 ring-1 ring-primary/20'
                      : 'bg-surface-container-lowest/60 hover:bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-label-sm font-semibold ${
                      isMe
                        ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                        : 'bg-surface-container text-on-surface ring-1 ring-secondary'
                    }`}>
                      {isMe ? '나' : member.name.charAt(0)}
                    </div>
                    <span className={`text-body-sm font-medium text-on-surface ${isMe ? 'font-bold' : ''}`}>
                      {member.name} {isMe ? '(나)' : member.role === 'team_lead' ? '(조장)' : '(조원)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-medium ${statusColor}`}>{statusText}</span>
                    <span className={`text-label-sm text-primary ${isMe ? 'font-bold' : 'font-semibold'}`}>
                      🌰 {member.acorns}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom AI Tip */}
      <div className="p-4 border-t border-outline-variant/30">
        <div className="p-3 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-tertiary">lightbulb</span>
            <span className="text-label-sm font-semibold">AI 중재 팁</span>
          </div>
          <p className="text-[12px] leading-snug text-on-surface-variant">
            작업이 막히면 언제든 <strong className="text-tertiary font-medium">&apos;막혔어요&apos;</strong>를 눌러보세요. 상처 없는 건강한 협의안을 AI가 제안합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
