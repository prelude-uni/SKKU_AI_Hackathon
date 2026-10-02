// src/components/views/ChecklistView.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface ChecklistViewProps {
  onNavigate?: (path: string) => void;
}

export default function ChecklistView({ onNavigate }: ChecklistViewProps) {
  const { tasks, currentProject, currentUser, generateAIChecklist, reportStuck } = useApp();
  const [noticeText, setNoticeText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);

  const projectTasks = tasks.filter(t => t.project_id === currentProject?.project_id);

  // Group tasks by milestones
  const phase1Tasks = projectTasks.filter(t => t.category === 'RESEARCH' || t.title.includes('주제'));
  const phase2Tasks = projectTasks.filter(t => t.category === 'DOCUMENTATION' || t.title.includes('자료'));
  const phase3Tasks = projectTasks.filter(t => t.category === 'DESIGN' || t.title.includes('분석'));
  const phase4Tasks = projectTasks.filter(t => t.category === 'DEVELOPMENT' || t.title.includes('PPT') || t.title.includes('발표'));

  const phases = [
    { name: '1단계: 기획 및 프레임워크 수립', tasks: phase1Tasks, completedText: '1/2 완료' },
    { name: '2단계: 시장 및 경쟁사 자료조사', tasks: phase2Tasks, completedText: '0/3 완료' },
    { name: '3단계: 분석 및 인사이트 도출', tasks: phase3Tasks, completedText: '0/3 완료' },
    { name: '4단계: 최종 결과물 제작 및 발표', tasks: phase4Tasks, completedText: '0/2 완료' },
  ];

  const handleGenerate = async () => {
    if (!noticeText.trim() || !currentProject) return;
    setIsGenerating(true);
    await generateAIChecklist(noticeText, currentProject.project_id);
    setIsGenerating(false);
    setShowGenerated(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-full bg-forest-spruce-subtle text-forest-spruce-deep text-[11px] font-semibold">완료</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-semibold">진행 중</span>;
      case 'STUCK':
        return <span className="px-2 py-0.5 rounded-full bg-attention-rose-subtle text-attention-rose text-[11px] font-semibold">도움 필요</span>;
      case 'IN_MEDIATION':
        return <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-semibold">합의 대기</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">시작 전</span>;
    }
  };

  return (
    <>
      {/* Back Link */}
      <button
        onClick={() => onNavigate && onNavigate('dashboard')}
        className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        대시보드로 돌아가기
      </button>

      <h1 className="font-headline text-headline-lg text-on-surface font-bold tracking-tight mb-1">
        팀 체크리스트
      </h1>
      <p className="text-body-md text-on-surface-variant mb-6">
        회의록이나 과제 공지사항을 넣으면 AI가 단계별 과업과 추천 일정을 자동으로 정리해드립니다.
      </p>

      {/* Notice Input Section */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            과제 안내 및 회의록 입력
          </h2>
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-tertiary">auto_awesome</span>
            AI 파싱 활성화됨
          </span>
        </div>

        {/* File Upload Area */}
        <div className="mb-4">
          <span className="text-body-sm text-on-surface font-medium mb-2 block">참고자료 및 공지 파일 첨부</span>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center bg-surface-container-low/30">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">cloud_upload</span>
            <p className="text-body-sm text-on-surface-variant">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-label-sm text-text-tertiary-color">PDF, HWP, DOCX, TXT (최대 30MB)</p>
          </div>
          <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px] text-primary">description</span>
            <span className="text-body-sm text-on-surface font-mono">경영전략론_중간과제_가이드라인.pdf</span>
            <span className="text-label-sm text-on-surface-variant ml-1">3.4MB</span>
            <button className="ml-auto text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-sm text-on-surface font-medium">회의록 또는 메모 직접 입력</span>
            <span className="text-label-sm text-on-surface-variant">마크다운/개조식 텍스트 자동 인식</span>
          </div>
          <textarea
            className="w-full min-h-[180px] p-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-text-tertiary-color focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none resize-none transition-all"
            placeholder="3월 24일 1차 킥오프 회의록:&#10;- 4월 5일까지 민지가 국내외 모빌리티 기업 비즈니스 모델 자료 조사&#10;- 분석 프레임워크는 준혁이가 4월 8일까지 SWOT 및 3C 템플릿 제작&#10;- 인터뷰 질문지 작성 및 인터뷰 대상자 섭외는 현우가 담당 (기한 미정)&#10;- 최종 PPT 디자인 및 발표는 서연이가 총괄"
            value={noticeText}
            onChange={e => setNoticeText(e.target.value)}
          ></textarea>
          <div className="flex items-center justify-between mt-2">
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary">lightbulb</span>
              명시되지 않은 담당자나 기한은 AI가 초안 생성 후 &apos;미배정&apos;으로 제안합니다.
            </p>
            <span className="text-label-sm text-on-surface-variant">{noticeText.length} / 2,000자</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-md font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            {isGenerating ? 'AI 분석 중...' : 'AI 체크리스트 생성하기'}
          </button>
        </div>
      </div>

      {/* Generated Checklist */}
      {(showGenerated || projectTasks.length > 0) && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  AI 추천 초안 검토중
                </span>
                <span className="text-label-sm text-on-surface-variant">v1.2 · 방금 업데이트됨</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                강의계획서 및 가이드라인 문서를 바탕으로 단계별 마일스톤과 과업을 자동 구조화했습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-medium transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                초안 다시 생성
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-sm font-bold transition-all shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span>
                체크리스트 확정
              </button>
            </div>
          </div>

          {/* Phase Groups */}
          <div className="space-y-6">
            {phases.map((phase, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                      {idx === 0 ? 'expand_more' : 'chevron_right'}
                    </span>
                    <h3 className="font-headline text-headline-sm text-on-surface font-bold">{phase.name}</h3>
                    <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                      {phase.completedText}
                    </span>
                  </div>
                  {idx === 0 && (
                    <span className="text-label-sm text-on-surface-variant">완료된 과업 접기 (1개 접힘)</span>
                  )}
                </div>

                <div className="space-y-2 ml-7">
                  {phase.tasks.length > 0 ? phase.tasks.map(task => (
                    <div
                      key={task.task_id}
                      className={`p-3 rounded-xl border transition-colors ${
                        task.status === 'COMPLETED' || task.status === 'RESOLVED'
                          ? 'bg-surface-container-low/30 border-surface-container'
                          : task.status === 'STUCK'
                          ? 'bg-surface-container-lowest border-primary-fixed ring-1 ring-primary/10'
                          : 'bg-surface-container-lowest border-default-divider hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={task.status === 'COMPLETED' || task.status === 'RESOLVED'}
                            readOnly
                            className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                          />
                          <div>
                            <p className={`text-body-md font-medium ${
                              task.status === 'COMPLETED' || task.status === 'RESOLVED'
                                ? 'line-through text-on-surface-variant'
                                : 'text-on-surface'
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-label-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '기한 미정'}</span>
                              {task.definition_of_done && (
                                <>
                                  <span className="material-symbols-outlined text-[14px]">subdirectory_arrow_right</span>
                                  <span className="truncate max-w-[300px]">완료 기준: {task.definition_of_done}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {task.assignee_name ? (
                            <span className="flex items-center gap-1 text-label-sm text-on-surface">
                              <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                                {task.assignee_name.charAt(0)}
                              </span>
                              {task.assignee_name}
                            </span>
                          ) : (
                            <span className="text-label-sm text-text-tertiary-color flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">person_add</span>
                              미배정
                            </span>
                          )}
                          {getStatusBadge(task.status)}
                          {task.status === 'STUCK' && (
                            <button className="text-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">forum</span>
                              중재방 보기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-3 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant text-center">
                      <p className="text-body-sm text-on-surface-variant">이 단계의 과업이 없습니다</p>
                    </div>
                  )}
                  <button className="flex items-center gap-1 px-3 py-1.5 text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    과업 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showGenerated && projectTasks.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl p-12 shadow-sm text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3 block">assignment</span>
          <h3 className="font-headline text-headline-sm text-on-surface font-bold mb-2">
            생성된 과업 항목이 없습니다
          </h3>
          <p className="text-body-md text-on-surface-variant mb-4">
            자료를 입력하고 생성 버튼을 누르면 기획, 자료조사, 분석, 제작 단계별 과업이 여기에 생성됩니다.
          </p>
          <div className="flex items-center justify-center gap-6 text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              일정 자동 산출
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
              담당자 자동 매핑
            </span>
          </div>
        </div>
      )}
    </>
  );
}
