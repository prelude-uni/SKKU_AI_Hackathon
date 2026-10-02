// src/app/tasks/[taskId]/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import MicroMissionModal from '@/components/MicroMissionModal';
import StuckReportModal from '@/components/StuckReportModal';
import { TaskStatus, SupportedLanguage } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  Globe, 
  Zap, 
  Link as LinkIcon, 
  FileText, 
  MessageSquare,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = (params?.taskId as string) || 'tsk_001';
  const { tasks, currentUser, addChatMessage, updateTaskStatus, t, language } = useApp();

  const task = tasks.find(t => t.task_id === taskId) || tasks[0];

  // Modals state
  const [showMicroMission, setShowMicroMission] = useState(false);
  const [showStuckReport, setShowStuckReport] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Deliverable input
  const [newDeliverable, setNewDeliverable] = useState('');
  const [deliverablesList, setDeliverablesList] = useState<string[]>(task.deliverables || []);

  // Full Document Translation Toggle
  const [isDocTranslated, setIsDocTranslated] = useState(false);
  // Chat Inline Translation active states: commentId -> boolean
  const [inlineTranslations, setInlineTranslations] = useState<Record<string, boolean>>({});

  const toggleInlineTranslation = (commentId: string) => {
    setInlineTranslations(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addChatMessage(task.task_id, chatInput);
    setChatInput('');
  };

  const handleAddDeliverable = () => {
    if (!newDeliverable.trim()) return;
    setDeliverablesList(prev => [...prev, newDeliverable]);
    setNewDeliverable('');
  };

  // Translations mockup for the task document
  const docTranslations = {
    en: {
      title: 'Benchmark 3 Similar Services & Create Core Differentiation Table',
      description: 'Investigate bottleneck resolution and notification methods of 3 similar collaboration tools (Notion, Slack, Miro) and extract 3 unique value propositions.',
      dod: 'Submit comparative table of 3 domestic/international services with Notion link',
    },
    zh: {
      title: '竞品调研：对比3款同类协作工具并提炼核心差异点',
      description: '调研国内外3款类似协作服务 (Notion, Slack, Miro) 的卡点解决机制与提醒方式，提炼出我们产品的3大差异化亮点。',
      dod: '完成3款同类产品核心功能对比表并提交Notion文档链接',
    }
  };

  const displayTitle = isDocTranslated && language !== 'ko' 
    ? (docTranslations[language as 'en' | 'zh']?.title || task.title)
    : task.title;

  const displayDesc = isDocTranslated && language !== 'ko'
    ? (docTranslations[language as 'en' | 'zh']?.description || task.description)
    : task.description;

  const displayDod = isDocTranslated && language !== 'ko'
    ? (docTranslations[language as 'en' | 'zh']?.dod || task.definition_of_done)
    : task.definition_of_done;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <Link
          href={`/projects/${task.project_id}/dashboard`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>대시보드로 돌아가기</span>
        </Link>

        {/* Global Doc Translation Button */}
        <button
          id="toggle-doc-translation-btn"
          onClick={() => setIsDocTranslated(!isDocTranslated)}
          className="btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            background: isDocTranslated ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: isDocTranslated ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)',
            color: isDocTranslated ? '#818cf8' : 'var(--text-main)',
          }}
        >
          <Globe size={15} />
          <span>{isDocTranslated ? '원문 보기' : `${t.translateDoc} (${language.toUpperCase()})`}</span>
        </button>
      </div>

      {/* Task Main Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative' }}>
        
        {/* Status & Category Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-badge badge-${task.status}`}>
              {task.status}
            </span>
            {task.category && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                {task.category}
              </span>
            )}
          </div>

          {/* Quick Action Buttons: '막혔어요' & '15분 마이크로 미션' */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              id="task-detail-micro-mission-btn"
              onClick={() => setShowMicroMission(true)}
              className="btn-acorn"
              style={{ fontSize: '0.85rem' }}
            >
              <Zap size={16} />
              <span>{t.tasks.microMission}</span>
            </button>

            <button
              id="task-detail-stuck-btn"
              onClick={() => setShowStuckReport(true)}
              className="btn-stuck"
              style={{ fontSize: '0.85rem' }}
            >
              <ShieldAlert size={16} />
              <span>{t.tasks.stuckButton}</span>
            </button>
          </div>
        </div>

        {/* Task Title & Description */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {displayTitle}
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
          {displayDesc}
        </p>

        {/* Bottleneck alert if STUCK */}
        {task.status === 'STUCK' && task.stuck_reason && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                <AlertTriangle size={16} />
                <span>현재 공유된 병목 사유:</span>
              </div>
              <p style={{ color: '#fda4af', fontSize: '0.875rem' }}>
                {task.stuck_reason}
              </p>
            </div>
            <Link
              href={task.mediation_id ? `/mediation/${task.mediation_id}` : '/mediation/med_001'}
              className="btn-primary"
              style={{ fontSize: '0.825rem', background: '#e11d48' }}
            >
              <span>AI 중재방 바로가기</span>
            </Link>
          </div>
        )}

        {/* Task Meta Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
              {t.tasks.assignee}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🐿️</span>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{task.assignee_name}</strong>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
              {t.tasks.dueDate}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}>
              <Clock size={16} color="var(--primary-indigo)" />
              <span>{new Date(task.due_date).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
              과업 상태 관리
            </span>
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.task_id, e.target.value as TaskStatus)}
              style={{
                background: '#0b0f19',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.8rem',
              }}
            >
              <option value="NOT_STARTED">NOT_STARTED (미진행)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (진행 중)</option>
              <option value="STUCK">STUCK (막혔어요)</option>
              <option value="IN_MEDIATION">IN_MEDIATION (중재 중)</option>
              <option value="RESOLVED">RESOLVED (협의 완료)</option>
              <option value="COMPLETED">COMPLETED (완료)</option>
            </select>
          </div>
        </div>

        {/* Definition of Done (DoD) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={18} color="#34d399" />
            <span>{t.tasks.definitionOfDone}</span>
          </h3>
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#a7f3d0',
            fontSize: '0.875rem',
          }}>
            {displayDod}
          </div>
        </div>

        {/* Deliverables Section */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LinkIcon size={18} color="var(--primary-indigo)" />
            <span>{t.tasks.deliverables}</span>
          </h3>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              id="deliverable-input"
              type="text"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              placeholder="Google Docs, Notion, GitHub 링크 또는 파일 URL..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#0b0f19',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            />
            <button
              onClick={handleAddDeliverable}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              등록
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {deliverablesList.map((del, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#818cf8' }}>
                <LinkIcon size={14} />
                <a href={del} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{del}</a>
              </div>
            ))}
            {deliverablesList.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                아직 등록된 결과물이 없습니다.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Task Comments & Real-time Multilingual Translation Section */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary-indigo)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              과업 관련 대화 및 실시간 번역
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🌐 다국어 팀원을 위한 실시간 인라인 번역 지원
          </span>
        </div>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
          {(task.comments || []).map((comment) => {
            const isTranslated = !!inlineTranslations[comment.id];
            const translatedText = comment.translated?.[language as 'en' | 'zh' | 'ko'] || comment.message;

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{comment.user_avatar}</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{comment.user_name}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>{comment.created_at}</span>
                  </div>

                  {/* Inline Translation Toggle Button */}
                  {comment.translated && (
                    <button
                      onClick={() => toggleInlineTranslation(comment.id)}
                      style={{
                        background: isTranslated ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        color: isTranslated ? '#818cf8' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Globe size={12} />
                      <span>{isTranslated ? '원문' : `${language.toUpperCase()} 번역`}</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {isTranslated ? translatedText : comment.message}
                </p>
                {isTranslated && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-indigo)', display: 'block', marginTop: '4px' }}>
                    ✨ AI 실시간 번역 결과
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Send Comment Form */}
        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
          <input
            id="task-chat-input"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="팀원에게 질문하거나 진행 팁을 남기세요 (자동 번역 제공)..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#0b0f19',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.85rem',
            }}
          />
          <button
            id="task-chat-submit"
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 16px' }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Modals */}
      <MicroMissionModal
        isOpen={showMicroMission}
        onClose={() => setShowMicroMission(false)}
        task={task}
      />

      <StuckReportModal
        isOpen={showStuckReport}
        onClose={() => setShowStuckReport(false)}
        task={task}
      />
    </div>
  );
}
