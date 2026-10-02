// src/components/views/ChecklistView.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';

interface ChecklistViewProps {
  onNavigate?: (path: string) => void;
}

interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  definition_of_done: string;
  category: 'RESEARCH' | 'DEVELOPMENT' | 'DESIGN' | 'DOCUMENTATION';
  estimated_duration: string;
  recommended_role: string;
  isEditing?: boolean;
}

interface GeneratedPhase {
  phase_number: number;
  phase_name: string;
  tasks: GeneratedTask[];
}

export default function ChecklistView({ onNavigate }: ChecklistViewProps) {
  const { currentProject, currentUser, addTasks } = useApp();

  // Input states
  const [noticeText, setNoticeText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [projectSummary, setProjectSummary] = useState<string>('');
  const [phases, setPhases] = useState<GeneratedPhase[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // File drop / select handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sample prompt filler
  const fillSampleText = () => {
    setNoticeText(`[경영정보시스템 3조 1차 회의록 - 중간발표 대비]
- 일시: 2026년 4월 2일 19:00
- 주제: 국내 플랫폼 기업 ESG 정량지표 진단 및 지속가능 비즈니스 모델 제안
- 주요 마감: 4월 25일 중간발표 및 최종 슬라이드 제출
- 논의 내용:
  1. 국내 대표 플랫폼 3사(네이버, 카카오, 당근)의 최근 2개년 ESG 보고서 정량 데이터 수집 및 비교 분석
  2. 환경(E), 사회(S), 지배구조(G) 지표별 벤치마킹 매트릭스 도출
  3. 플랫폼 기업 특화 ESG 신규 비즈니스 모델(BM) 전략 2건 제안
  4. 20분 발표 분량의 시각화 슬라이드 덱 제작 및 발표 대본 작성`);
  };

  // Call /api/ai/checklist
  const handleGenerate = async () => {
    if (!noticeText.trim() && !selectedFile) {
      alert('회의록 텍스트를 입력하거나 분석할 파일(PDF, 이미지, 문서)을 업로드해 주세요.');
      return;
    }

    setIsGenerating(true);
    setRegisteredSuccess(false);

    try {
      const formData = new FormData();
      if (noticeText) formData.append('text', noticeText);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || '체크리스트 생성에 실패했습니다.');
      }

      setModelUsed(json.modelUsed || 'gemini-3.8-flash');
      setProjectSummary(json.data?.project_summary || '');

      const parsedPhases: GeneratedPhase[] = (json.data?.phases || []).map((p: any, pIdx: number) => ({
        phase_number: p.phase_number || pIdx + 1,
        phase_name: p.phase_name || `${pIdx + 1}단계`,
        tasks: (p.tasks || []).map((t: any, tIdx: number) => ({
          id: `task_${pIdx}_${tIdx}_${Date.now()}`,
          title: t.title || '새 과업',
          description: t.description || '',
          definition_of_done: t.definition_of_done || '완료 기준 미정',
          category: t.category || 'RESEARCH',
          estimated_duration: t.estimated_duration || '2일',
          recommended_role: t.recommended_role || '팀원',
          isEditing: false,
        })),
      }));

      setPhases(parsedPhases);
      setHasGenerated(true);
    } catch (err: any) {
      console.error(err);
      alert(`오류: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Task editing functions
  const toggleEditTask = (phaseIdx: number, taskId: string) => {
    setPhases(prev =>
      prev.map((phase, pI) => {
        if (pI !== phaseIdx) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map(t => (t.id === taskId ? { ...t, isEditing: !t.isEditing } : t)),
        };
      })
    );
  };

  const updateTaskField = (
    phaseIdx: number,
    taskId: string,
    field: keyof GeneratedTask,
    value: any
  ) => {
    setPhases(prev =>
      prev.map((phase, pI) => {
        if (pI !== phaseIdx) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map(t => (t.id === taskId ? { ...t, [field]: value } : t)),
        };
      })
    );
  };

  const deleteTask = (phaseIdx: number, taskId: string) => {
    setPhases(prev =>
      prev.map((phase, pI) => {
        if (pI !== phaseIdx) return phase;
        return {
          ...phase,
          tasks: phase.tasks.filter(t => t.id !== taskId),
        };
      })
    );
  };

  const addTaskToPhase = (phaseIdx: number) => {
    const newTask: GeneratedTask = {
      id: `task_new_${Date.now()}`,
      title: '새 세부 과업',
      description: '작업 내용 및 가이드를 입력하세요.',
      definition_of_done: '구체적인 산출물 형태 명시',
      category: 'RESEARCH',
      estimated_duration: '1일',
      recommended_role: currentUser.name,
      isEditing: true,
    };

    setPhases(prev =>
      prev.map((phase, pI) => {
        if (pI !== phaseIdx) return phase;
        return {
          ...phase,
          tasks: [...phase.tasks, newTask],
        };
      })
    );
  };

  // Register all customized tasks to actual AppContext tasks state
  const handleApplyToProject = () => {
    if (!currentProject) return;

    const allNewTasks: Task[] = [];
    let counter = 0;

    phases.forEach((phase) => {
      phase.tasks.forEach((t) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (counter + 1) * 3);

        allNewTasks.push({
          task_id: `tsk_ai_${Date.now()}_${counter++}`,
          project_id: currentProject.project_id,
          assignee_id: currentUser.id,
          assignee_name: currentUser.name,
          title: t.title,
          description: t.description,
          due_date: dueDate.toISOString(),
          definition_of_done: t.definition_of_done,
          status: 'NOT_STARTED',
          deliverables: [],
          created_at: new Date().toISOString(),
          category: t.category,
        });
      });
    });

    addTasks(allNewTasks);
    setRegisteredSuccess(true);
  };

  const totalGeneratedCount = phases.reduce((acc, p) => acc + p.tasks.length, 0);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Link */}
      <div>
        <button
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer group py-1"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <span>대시보드로 돌아가기</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-headline-xl text-on-surface font-bold tracking-tight">
            팀 체크리스트
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            Gemini 3.8 Flash 연동
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          과제 공지사항, 강의계획서 파일(PDF/이미지) 또는 회의록을 입력하면 AI가 마일스톤과 완료 기준(DoD)을 자동 도출합니다.
        </p>
      </div>

      {/* Notice & File Input Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-surface-container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full"></span>
            공지사항 파일 업로드 &amp; 회의록 입력
          </h2>
          <button
            onClick={fillSampleText}
            className="text-label-sm text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            예시 회의록 채우기
          </button>
        </div>

        {/* Drag & Drop File Upload Area */}
        <div className="mb-5">
          <label className="text-label-md text-on-surface font-semibold mb-2 block">
            참고자료 및 공지 파일 첨부 (선택)
          </label>
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-primary bg-primary-fixed/20 scale-[0.99]'
                : 'border-outline-variant bg-surface-container-low/40 hover:bg-surface-container-low/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="material-symbols-outlined text-[36px] text-primary">
              cloud_upload
            </span>
            <p className="text-label-md font-semibold text-on-surface">
              클릭하거나 파일을 드래그하여 업로드하세요
            </p>
            <p className="text-body-sm text-on-surface-variant">
              PDF 강의계획서, 에타/LMS 공지 캡처 이미지, 텍스트 문서 (최대 30MB)
            </p>
          </div>

          {/* Selected File Badge */}
          {selectedFile && (
            <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-primary-fixed/25 border border-primary/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  {selectedFile.type.startsWith('image/')
                    ? 'image'
                    : selectedFile.name.endsWith('.pdf')
                    ? 'picture_as_pdf'
                    : 'description'}
                </span>
                <span className="text-label-md font-semibold text-on-surface font-mono">
                  {selectedFile.name}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-on-surface-variant hover:text-error p-1 rounded-full cursor-pointer"
                title="파일 제거"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-label-md text-on-surface font-semibold">
              회의록 또는 공지 텍스트 직접 입력
            </label>
            <span className="text-label-sm text-on-surface-variant">
              자유로운 개조식 텍스트 자동 파싱
            </span>
          </div>
          <textarea
            className="w-full min-h-[160px] p-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none resize-none transition-all"
            placeholder="예시:&#10;- 4월 10일까지 민지가 국내외 모빌리티 기업 비즈니스 모델 조사&#10;- 분석 프레임워크는 준혁이가 4월 15일까지 SWOT 및 3C 템플릿 제작&#10;- 4월 25일 최종 발표 PPT 제작 및 발표는 현우가 담당"
            value={noticeText}
            onChange={e => setNoticeText(e.target.value)}
          ></textarea>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary">psychology</span>
            <span>Gemini 3.8 Flash가 완료 기준(DoD)과 추천 분담을 함께 도출합니다.</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!noticeText.trim() && !selectedFile)}
            className="btn-primary flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            type="button"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Gemini 3.8 Flash가 분석 중...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>AI 체크리스트 자동 생성</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generated Checklist Result & Editable View */}
      {hasGenerated && (
        <section className="flex flex-col space-y-6 pt-2">
          {/* Summary Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-primary-fixed/30 via-surface-container-lowest to-secondary-fixed/20 border border-primary/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-primary font-bold text-label-md">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <span>AI 프로젝트 분석 요약</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-primary text-label-sm font-semibold border border-primary/20">
                {modelUsed}
              </span>
            </div>
            <p className="text-body-md text-on-surface leading-relaxed font-medium">
              {projectSummary}
            </p>
            <div className="mt-3 flex items-center gap-4 text-label-sm text-on-surface-variant border-t border-primary/10 pt-2">
              <span>총 {phases.length}단계 마일스톤</span>
              <span>•</span>
              <span>총 {totalGeneratedCount}개 세부 과업 생성됨</span>
              <span>•</span>
              <span className="text-secondary font-semibold">각 과업을 클릭하여 자유롭게 수정할 수 있습니다</span>
            </div>
          </div>

          {/* Success Banner if Registered */}
          {registeredSuccess && (
            <div className="p-4 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-label-md">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                <span>{totalGeneratedCount}개의 과업이 팀 프로젝트에 성공적으로 등록되었습니다!</span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="px-3 py-1 rounded-lg bg-surface-container-lowest text-secondary font-bold text-label-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                대시보드에서 확인하기 ➔
              </button>
            </div>
          )}

          {/* Phase Groups */}
          <div className="space-y-6">
            {phases.map((phase, pIdx) => (
              <div
                key={phase.phase_number}
                className="rounded-2xl bg-surface-container-lowest p-5 border border-surface-container shadow-sm space-y-4"
              >
                {/* Phase Header */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold text-label-sm">
                      {phase.phase_number}
                    </span>
                    <h3 className="font-headline text-headline-sm text-on-surface font-bold">
                      {phase.phase_name}
                    </h3>
                    <span className="text-label-sm text-on-surface-variant">
                      ({phase.tasks.length}개 과업)
                    </span>
                  </div>

                  <button
                    onClick={() => addTaskToPhase(pIdx)}
                    className="inline-flex items-center gap-1 text-label-sm text-primary hover:text-primary-container font-semibold transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    과업 추가
                  </button>
                </div>

                {/* Tasks List in this Phase */}
                <div className="space-y-3">
                  {phase.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.isEditing
                          ? 'border-primary ring-2 ring-primary/10 bg-primary-fixed/10'
                          : 'border-surface-container bg-surface-container-low/40 hover:bg-surface-container-low/80'
                      }`}
                    >
                      {task.isEditing ? (
                        /* Edit Mode */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                                과업명
                              </label>
                              <input
                                type="text"
                                value={task.title}
                                onChange={e => updateTaskField(pIdx, task.id, 'title', e.target.value)}
                                className="w-full p-2 text-label-md font-semibold rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                                카테고리
                              </label>
                              <select
                                value={task.category}
                                onChange={e => updateTaskField(pIdx, task.id, 'category', e.target.value)}
                                className="w-full p-2 text-label-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
                              >
                                <option value="RESEARCH">RESEARCH (자료조사)</option>
                                <option value="DEVELOPMENT">DEVELOPMENT (개발/실행)</option>
                                <option value="DESIGN">DESIGN (디자인/기획)</option>
                                <option value="DOCUMENTATION">DOCUMENTATION (문서화)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-primary block mb-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">flag</span>
                              완료 기준 (DoD: Definition of Done)
                            </label>
                            <input
                              type="text"
                              value={task.definition_of_done}
                              onChange={e => updateTaskField(pIdx, task.id, 'definition_of_done', e.target.value)}
                              className="w-full p-2 text-label-md rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                                예상 소요 기간
                              </label>
                              <input
                                type="text"
                                value={task.estimated_duration}
                                onChange={e => updateTaskField(pIdx, task.id, 'estimated_duration', e.target.value)}
                                className="w-full p-2 text-label-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                                추천 담당 역할
                              </label>
                              <input
                                type="text"
                                value={task.recommended_role}
                                onChange={e => updateTaskField(pIdx, task.id, 'recommended_role', e.target.value)}
                                className="w-full p-2 text-label-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => deleteTask(pIdx, task.id)}
                              className="px-3 py-1 rounded-lg text-error hover:bg-error-container/30 text-label-sm cursor-pointer"
                              type="button"
                            >
                              삭제
                            </button>
                            <button
                              onClick={() => toggleEditTask(pIdx, task.id)}
                              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-semibold hover:bg-primary-container cursor-pointer"
                              type="button"
                            >
                              수정 완료
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant">
                                {task.category}
                              </span>
                              <span className="text-[12px] text-outline">
                                ⏳ {task.estimated_duration}
                              </span>
                              <span className="text-[12px] text-tertiary font-medium">
                                👤 {task.recommended_role}
                              </span>
                            </div>

                            <h4 className="font-headline text-headline-sm text-on-surface font-bold">
                              {task.title}
                            </h4>

                            {task.description && (
                              <p className="text-body-sm text-on-surface-variant">
                                {task.description}
                              </p>
                            )}

                            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-body-sm text-on-surface flex items-start gap-2">
                              <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                                task_alt
                              </span>
                              <div>
                                <span className="font-semibold text-primary mr-1">완료 기준(DoD):</span>
                                <span>{task.definition_of_done}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 pt-1">
                            <button
                              onClick={() => toggleEditTask(pIdx, task.id)}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              title="과업 수정"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => deleteTask(pIdx, task.id)}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                              title="과업 삭제"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action: Apply to Project */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-tier-2 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-headline text-headline-sm text-on-surface font-bold">
                수정 완료된 체크리스트를 팀플 과업에 등록할까요?
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                등록 즉시 팀 대시보드와 과업 목록에 반영되어 팀원들과 실시간으로 진행 상황을 공유할 수 있습니다.
              </p>
            </div>

            <button
              onClick={handleApplyToProject}
              className="btn-primary text-label-md px-6 py-3 shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              <span>내 팀플에 과업으로 등록하기 ({totalGeneratedCount}개)</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
