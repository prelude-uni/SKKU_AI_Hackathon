// src/components/MicroMissionModal.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, MicroMission } from '@/types';
import { Sparkles, X, Check, ArrowRight, Zap, Trophy, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MicroMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export default function MicroMissionModal({ isOpen, onClose, task }: MicroMissionModalProps) {
  const { completeMicroMission, currentUser } = useApp();
  const [missionInput, setMissionInput] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [justCompleted, setJustCompleted] = useState(false);

  if (!isOpen) return null;

  // 태스크의 마이크로 미션들 또는 기본 생성 미션
  const defaultMissions: MicroMission[] = [
    {
      id: 'mm_1',
      title: 'Step 1: 머리 비우고 딱 1곳(예: Slack)의 가장 아쉬운 점 1줄 적기 (10분)',
      step: 1,
      duration_minutes: 10,
      completed: false,
      reward_acorn: 1,
    },
    {
      id: 'mm_2',
      title: 'Step 2: 우리 프로젝트에서 꼭 가져가고 싶은 핵심 키워드 3개 적기 (15분)',
      step: 2,
      duration_minutes: 15,
      completed: false,
      reward_acorn: 1,
    }
  ];

  const missions = (task?.micro_missions && task.micro_missions.length > 0) 
    ? task.micro_missions 
    : defaultMissions;

  const currentMission = missions.find(m => m.step === activeStep) || missions[0];

  const handleCompleteStep = () => {
    if (!missionInput.trim()) return;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#8b5cf6', '#10b981']
    });

    setJustCompleted(true);
    if (task) {
      completeMicroMission(task.task_id, currentMission.id, missionInput);
    }

    setTimeout(() => {
      setJustCompleted(false);
      setMissionInput('');
      if (activeStep < missions.length) {
        setActiveStep(prev => prev + 1);
      } else {
        onClose();
      }
    }, 1600);
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
        maxWidth: '560px',
        width: '100%',
        padding: '2rem',
        background: 'linear-gradient(135deg, #18192b 0%, #0f172a 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(245, 158, 11, 0.15)',
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                15분 마이크로 미션 (재시동 루프)
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--acorn-gold)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                다시 시작하기
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              막막할 땐 전체를 다 하려 하지 마세요. 15분 동안 딱 1개만 해결해봐요!
            </p>
          </div>
        </div>

        {/* Step Progress Blocks */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1.5rem',
        }}>
          {missions.map((m, idx) => (
            <div
              key={m.id}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                background: m.completed || activeStep > m.step 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : activeStep === m.step 
                    ? 'rgba(245, 158, 11, 0.25)' 
                    : 'rgba(255, 255, 255, 0.05)',
                border: m.completed || activeStep > m.step 
                  ? '1px solid rgba(16, 185, 129, 0.5)' 
                  : activeStep === m.step 
                    ? '1px solid rgba(245, 158, 11, 0.6)' 
                    : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: m.completed || activeStep > m.step 
                  ? '#34d399' 
                  : activeStep === m.step 
                    ? 'var(--acorn-gold)' 
                    : 'var(--text-subtle)',
              }}
            >
              {m.completed || activeStep > m.step ? <Check size={14} /> : <span>{idx + 1}단계</span>}
              <span>{m.duration_minutes}분 미션</span>
            </div>
          ))}
        </div>

        {/* Current Mission Card */}
        <div style={{
          background: 'rgba(11, 15, 25, 0.6)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--acorn-gold)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
            <Zap size={14} />
            <span>AI 추천 마이크로 액션</span>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: '1.4', marginBottom: '1rem' }}>
            {currentMission.title}
          </p>

          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            간단히 생각나는 대로 적어보세요 (완벽하지 않아도 괜찮아요):
          </label>
          <textarea
            id="micro-mission-input"
            rows={3}
            value={missionInput}
            onChange={(e) => setMissionInput(e.target.value)}
            placeholder="예: Slack은 알림이 너무 자주 와서 피로하고, 정작 과업이 막혔을 때 어떻게 도와줄지 가이드가 없다."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0b0f19',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              resize: 'none',
            }}
          />
        </div>

        {/* Reward Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(245, 158, 11, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>미션 완료 시:</span>
          <span style={{ fontWeight: 700, color: 'var(--acorn-gold)' }}>
            🌰 도토리 +1 적립 & 과업 재시동 (IN_PROGRESS) 복귀
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            나중에 하기
          </button>
          <button
            id="micro-mission-submit-btn"
            onClick={handleCompleteStep}
            disabled={!missionInput.trim() || justCompleted}
            className="btn-acorn"
            style={{
              padding: '10px 18px',
              fontSize: '0.9rem',
              opacity: !missionInput.trim() || justCompleted ? 0.6 : 1,
            }}
          >
            {justCompleted ? (
              <>
                <Check size={16} />
                <span>재시동 성공! 도토리 +1 획득!</span>
              </>
            ) : (
              <>
                <Trophy size={16} />
                <span>15분 미션 완료하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
