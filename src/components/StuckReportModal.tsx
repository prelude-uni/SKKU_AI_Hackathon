// src/components/StuckReportModal.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';
import { AlertTriangle, X, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StuckReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export default function StuckReportModal({ isOpen, onClose, task }: StuckReportModalProps) {
  const router = useRouter();
  const { reportStuck } = useApp();
  const [selectedReasonCategory, setSelectedReasonCategory] = useState<string>('범위와 요구사항이 모호해요');
  const [additionalNote, setAdditionalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const reasonCategories = [
    { id: 'vague', title: '범위와 요구사항이 모호해요', icon: '❓', desc: '어디서부터 어떤 형식으로 정리해야 할지 막막함' },
    { id: 'resource', title: '자료 또는 툴 접근이 제한적이에요', icon: '🔒', desc: '유료 데이터, 권한, API 제한 등 외부 요인' },
    { id: 'time', title: '개인 일정/시험으로 시간이 부족해요', icon: '⏰', desc: '가용 시간 부족으로 마감 기한 조정 필요' },
    { id: 'technical', title: '기술적 오류/난관에 부딪혔어요', icon: '⚠️', desc: '코드 에러나 라이브러리 호환성 문제' },
  ];

  const handleSubmit = () => {
    if (!task) return;
    setIsSubmitting(true);

    const fullReason = `${selectedReasonCategory}${additionalNote ? ` - ${additionalNote}` : ''}`;
    const mediationId = reportStuck(task.task_id, fullReason);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      router.push(`/mediation/${mediationId}`);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1f1422 0%, #111827 100%)',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(244, 63, 94, 0.2)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)',
          }}>
            🛟
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                심리적 부담 없는 '막혔어요' 공유
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              누구나 막힐 수 있어요. 비난 대신 AI가 객관적 해결 대안을 마련해 드립니다.
            </p>
          </div>
        </div>

        {/* Task Title Highlight */}
        {task && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: '#e2e8f0',
          }}>
            <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>대상 과업:</span>
            <strong>{task.title}</strong>
          </div>
        )}

        {/* Reason Selector */}
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
          어떤 부분이 가장 막히시나요? (중립적 상태 수렴)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
          {reasonCategories.map((rc) => {
            const isSelected = selectedReasonCategory === rc.title;
            return (
              <div
                key={rc.id}
                id={`stuck-reason-${rc.id}`}
                onClick={() => setSelectedReasonCategory(rc.title)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{rc.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isSelected ? '#fb7185' : '#fff' }}>
                    {rc.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rc.desc}
                  </div>
                </div>
                {isSelected && <CheckCircle2 size={18} color="#fb7185" />}
              </div>
            );
          })}
        </div>

        {/* Optional details note */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            추가 설명 (선택 사항):
          </label>
          <input
            id="stuck-additional-note"
            type="text"
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            placeholder="예: 해외 유료 툴 결제가 필요하거나, 비교 지표 템플릿이 필요해요"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#0b0f19',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            취소
          </button>
          <button
            id="stuck-submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-stuck"
            style={{ fontSize: '0.9rem' }}
          >
            <span>AI 중재방 개설 및 팀원 공유</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
