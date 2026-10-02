// src/app/mediation/[mediationId]/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  Send, 
  Globe, 
  Clock, 
  Users, 
  AlertTriangle, 
  ThumbsUp, 
  Check, 
  FileEdit,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MediationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const mediationId = (params?.mediationId as string) || 'med_001';
  const { 
    mediationRooms, 
    acceptMediationOption, 
    addMediationStatement, 
    addMediationChatMessage, 
    currentUser, 
    language,
    t 
  } = useApp();

  const mediation = mediationRooms.find(m => m.mediation_id === mediationId) || mediationRooms[0];

  // Forms
  const [statementText, setStatementText] = useState('');
  const [availableHours, setAvailableHours] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [justAgreed, setJustAgreed] = useState(false);

  // In-line translation toggles: messageId -> boolean
  const [inlineTranslations, setInlineTranslations] = useState<Record<string, boolean>>({});

  const toggleTranslation = (id: string) => {
    setInlineTranslations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statementText.trim()) return;
    addMediationStatement(mediation.mediation_id, statementText, availableHours || '협의 필요');
    setStatementText('');
    setAvailableHours('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addMediationChatMessage(mediation.mediation_id, chatInput);
    setChatInput('');
  };

  const handleAcceptOption = (optionId: string) => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#8b5cf6', '#10b981', '#f59e0b']
    });
    acceptMediationOption(mediation.mediation_id, optionId);
    setJustAgreed(true);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <Link
          href={`/projects/${mediation.project_id}/dashboard`}
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

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '12px',
          background: mediation.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
          color: mediation.status === 'RESOLVED' ? '#34d399' : '#c084fc',
          border: mediation.status === 'RESOLVED' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
        }}>
          {mediation.status === 'RESOLVED' ? '✅ 전원 합의 완료' : '⚖️ AI 협의 진행 중'}
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(20, 24, 45, 0.9) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
          }}>
            ⚖️
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {t.mediation.title}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              누구의 잘못도 묻지 않습니다. 감정 소모 없이 객관적 사실을 기반으로 합리적인 협의안을 도출합니다.
            </p>
          </div>
        </div>

        {/* Target Task & Reason Card */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '2px' }}>
              중재 대상 과업
            </span>
            <strong style={{ fontSize: '1rem', color: '#fff' }}>
              {mediation.task_title}
            </strong>
            <p style={{ fontSize: '0.825rem', color: '#fb7185', marginTop: '4px' }}>
              🚨 병목 사유: {mediation.reason} ({mediation.stuck_member_name})
            </p>
          </div>

          <Link href={`/tasks/${mediation.task_id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            과업 원문 보기
          </Link>
        </div>
      </div>

      {/* Success Resolution Banner if resolved */}
      {(mediation.status === 'RESOLVED' || justAgreed) && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{ fontSize: '2rem' }}>🎉</div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', marginBottom: '2px' }}>
              {t.mediation.resolvedMessage}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
              {t.mediation.acornAwarded} 배려해준 팀원분들께 감사드리며, 프로젝트 일정과 체크리스트가 최신화되었습니다.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left (AI Proposals & Statements) & Right (Chat) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: AI Proposals & Statements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 🌟 1. AI 지능형 협의안 (1~2개 대안 제시) */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Sparkles size={18} color="#c084fc" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                {t.mediation.aiProposals} (객관적 2개 대안)
              </h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              AI가 각 팀원의 가용 시간과 과업 난이도를 분석하여 감정 배제형 옵션을 생성했습니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mediation.proposed_options.map((opt, idx) => {
                const isSelected = mediation.selected_option_id === opt.id;
                return (
                  <div
                    key={opt.id}
                    id={`mediation-option-${opt.id}`}
                    style={{
                      borderRadius: '12px',
                      padding: '1.25rem',
                      background: isSelected 
                        ? 'rgba(16, 185, 129, 0.12)' 
                        : idx === 1 
                          ? 'rgba(168, 85, 247, 0.1)' 
                          : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected 
                        ? '1px solid #10b981' 
                        : idx === 1 
                          ? '1px solid rgba(168, 85, 247, 0.4)' 
                          : '1px solid var(--border-subtle)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: isSelected ? '#34d399' : '#fff' }}>
                        {opt.title}
                      </h4>
                      {idx === 1 && !isSelected && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--primary-indigo)', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                          AI 추천
                        </span>
                      )}
                      {isSelected && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} />
                          최종 채택안
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {opt.summary}
                    </p>

                    {/* Changes pill list */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                      {opt.changes.scope_reduction && (
                        <span style={{ fontSize: '0.725rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: '#93c5fd' }}>
                          ✂️ {opt.changes.scope_reduction}
                        </span>
                      )}
                      {opt.changes.deadline_adjustment && (
                        <span style={{ fontSize: '0.725rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: '#fed7aa' }}>
                          ⏰ {opt.changes.deadline_adjustment}
                        </span>
                      )}
                      {opt.changes.acorn_transfer && (
                        <span style={{ fontSize: '0.725rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--acorn-gold)', fontWeight: 700 }}>
                          🌰 도움받은 사람 도토리 +{opt.changes.acorn_transfer}
                        </span>
                      )}
                    </div>

                    {/* Action: Accept Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {mediation.status !== 'RESOLVED' && (
                        <button
                          id={`accept-option-btn-${opt.id}`}
                          onClick={() => handleAcceptOption(opt.id)}
                          className={idx === 1 ? 'btn-primary' : 'btn-secondary'}
                          style={{ fontSize: '0.825rem', padding: '7px 14px' }}
                        >
                          <ThumbsUp size={14} />
                          <span>이 대안 수락하기</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 👥 2. 팀원 상황 설명 란 (Member Statements) */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="var(--primary-indigo)" />
              <span>{t.mediation.memberStatements}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
              {mediation.member_statements.map((stmt, idx) => {
                const isTrans = !!inlineTranslations[`stmt_${idx}`];
                const translatedStmt = stmt.translated?.[language as 'en' | 'zh' | 'ko'] || stmt.statement;

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{stmt.user_name}</strong>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>({stmt.available_hours})</span>
                      </div>
                      
                      {stmt.translated && (
                        <button
                          onClick={() => toggleTranslation(`stmt_${idx}`)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isTrans ? '#818cf8' : 'var(--text-muted)',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                          }}
                        >
                          🌐 {isTrans ? '원문' : `${language.toUpperCase()} 번역`}
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {isTrans ? translatedStmt : stmt.statement}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Add Statement Form */}
            <form onSubmit={handleAddStatement} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="statement-input"
                  type="text"
                  required
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="현재 내 가용 상황 또는 지원 가능 범위를 적어주세요..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0b0f19',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.825rem',
                  }}
                />
                <input
                  id="available-hours-input"
                  type="text"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(e.target.value)}
                  placeholder="가용 시간 (예: 오늘 1시간)"
                  style={{
                    width: '160px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0b0f19',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.825rem',
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ fontSize: '0.825rem' }}>
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Real-time Multilingual Chat */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              중재방 실시간 소통
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
              🌐 실시간 다국어 지원
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', marginBottom: '1rem' }}>
            {mediation.chat_messages.map((msg) => {
              const isTrans = !!inlineTranslations[msg.id];
              const text = msg.translated?.[language as 'en' | 'zh' | 'ko'] || msg.message;

              return (
                <div
                  key={msg.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: msg.user_id === 'darami_bot' 
                      ? 'rgba(245, 158, 11, 0.12)' 
                      : 'rgba(255, 255, 255, 0.04)',
                    border: msg.user_id === 'darami_bot' 
                      ? '1px solid rgba(245, 158, 11, 0.3)' 
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>{msg.user_avatar}</span>
                      <strong style={{ fontSize: '0.8rem', color: msg.user_id === 'darami_bot' ? 'var(--acorn-gold)' : '#fff' }}>
                        {msg.user_name}
                      </strong>
                    </div>

                    {msg.translated && (
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isTrans ? '#818cf8' : 'var(--text-muted)',
                          fontSize: '0.675rem',
                          cursor: 'pointer',
                        }}
                      >
                        🌐 {isTrans ? '원문' : `${language.toUpperCase()}`}
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '0.825rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                    {isTrans ? text : msg.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
            <input
              id="mediation-chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="의견이나 격려 메시지를 입력하세요..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#0b0f19',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.825rem',
              }}
            />
            <button id="mediation-chat-submit" type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
