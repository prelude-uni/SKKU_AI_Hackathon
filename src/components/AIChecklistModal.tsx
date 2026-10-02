// src/components/AIChecklistModal.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, X, Check, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function AIChecklistModal({ isOpen, onClose, projectId }: AIChecklistModalProps) {
  const { generateAIChecklist } = useApp();
  const [noticeText, setNoticeText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const sampleNotice = `[인공지능응용 캡스톤 프로젝트 2차 과제 공지]
1. 주제: LLM 또는 컴퓨터 비전을 활용한 실용 협업/생활 보조 서비스 개발
2. 요구사항:
- 기존 상용 서비스 3종 벤치마킹 및 차별화 지표 비교표 제출
- 시스템 아키텍처 다이어그램 및 데이터 파이프라인 명세
- 프로토타입 UI 와이어프레임 및 실제 모델 추론 API 연동 테스트
3. 마감: 다음 주 월요일 23:59까지 GitHub 저장소 및 시연 영상 링크 제출`;

  const handleInsertSample = () => {
    setNoticeText(sampleNotice);
  };

  const handleGenerate = async () => {
    if (!noticeText.trim()) return;
    setIsGenerating(true);

    // AI 분해 시뮬레이션 딜레이
    setTimeout(async () => {
      await generateAIChecklist(noticeText, projectId);
      setIsGenerating(false);
      setSuccess(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setSuccess(false);
        setNoticeText('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '2rem',
        background: '#131b2e',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              AI 체크리스트 자동 생성
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              과제 공지, 회의록 메모를 1~2시간 단위 마이크로 실행 과업으로 자동 분해합니다.
            </p>
          </div>
        </div>

        <div style={{ margin: '1.25rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
              과제 공지문 또는 회의록 텍스트
            </label>
            <button
              onClick={handleInsertSample}
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary-indigo)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '6px',
                padding: '3px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              예시 텍스트 불러오기
            </button>
          </div>
          <textarea
            id="ai-checklist-input"
            rows={7}
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            placeholder="교수님 과제 공지문, 팀 회의록 텍스트, 요구사항 메모 등을 붙여넣으세요..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(11, 15, 25, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <span>💡</span>
          <span>AI 엔진이 15분~2시간 단위의 구체적인 DoD(완료 기준)와 함께 담당자를 자동 배정합니다.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isGenerating}
          >
            취소
          </button>
          <button
            id="ai-checklist-submit-btn"
            onClick={handleGenerate}
            disabled={!noticeText.trim() || isGenerating}
            className="btn-primary"
            style={{
              opacity: !noticeText.trim() || isGenerating ? 0.6 : 1,
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>AI가 과업 분해 중...</span>
              </>
            ) : success ? (
              <>
                <Check size={16} color="#34d399" />
                <span>체크리스트 등록 완료!</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>마이크로 과업 분해하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
