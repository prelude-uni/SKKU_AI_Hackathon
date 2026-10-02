// src/components/CharacterCheckin.tsx
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, CheckCircle2, AlertTriangle, Compass, Clock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterCheckinProps {
  onOpenMicroMission: () => void;
  onOpenStuckReport: () => void;
  onOpenMediationRoom: () => void;
}

export default function CharacterCheckin({
  onOpenMicroMission,
  onOpenStuckReport,
  onOpenMediationRoom,
}: CharacterCheckinProps) {
  const { t, updateTaskStatus } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (dismissed) return null;

  const handleInProgress = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
    setFeedbackMsg('멋져요! 무리하지 말고 한 걸음씩 나아가봐요. 다람이가 계속 응원할게요! 🐿️💪');
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  return (
    <div
      id="character-checkin-banner"
      className="glass-panel"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.75) 0%, rgba(17, 24, 39, 0.85) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        position: 'relative',
        boxShadow: '0 8px 30px rgba(139, 92, 246, 0.15)',
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-subtle)',
          cursor: 'pointer',
        }}
        title="닫기"
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Character Avatar */}
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
          flexShrink: 0,
        }} className="animate-darami">
          🐿️
        </div>

        {/* Text Section */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              {t.checkinTitle}
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--acorn-gold)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}>
              부담 없는 3자 체크인
            </span>
          </div>
          <p style={{ fontSize: '0.925rem', color: '#e2e8f0', marginBottom: '0.85rem' }}>
            "{t.checkinPrompt}"
          </p>

          {/* 4 One-touch Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              id="checkin-btn-in-progress"
              onClick={handleInProgress}
              className="btn-secondary"
              style={{ fontSize: '0.825rem', padding: '7px 13px', background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <CheckCircle2 size={15} color="#60a5fa" />
              <span>{t.statusOptions.inProgress}</span>
            </button>

            <button
              id="checkin-btn-need-start"
              onClick={onOpenMicroMission}
              className="btn-secondary"
              style={{ fontSize: '0.825rem', padding: '7px 13px', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <Compass size={15} color="#fbbf24" />
              <span>{t.statusOptions.needStart}</span>
            </button>

            <button
              id="checkin-btn-stuck"
              onClick={onOpenStuckReport}
              className="btn-secondary"
              style={{ fontSize: '0.825rem', padding: '7px 13px', background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <AlertTriangle size={15} color="#fb7185" />
              <span>{t.statusOptions.stuck}</span>
            </button>

            <button
              id="checkin-btn-need-time"
              onClick={onOpenMediationRoom}
              className="btn-secondary"
              style={{ fontSize: '0.825rem', padding: '7px 13px', background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' }}
            >
              <Clock size={15} color="#c084fc" />
              <span>{t.statusOptions.needTime}</span>
            </button>
          </div>

          {/* Feedback message banner if user clicked inProgress */}
          {feedbackMsg && (
            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}>
              {feedbackMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
