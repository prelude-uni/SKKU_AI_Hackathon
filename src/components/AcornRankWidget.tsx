// src/components/AcornRankWidget.tsx
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Award, ArrowUpRight, HelpCircle } from 'lucide-react';

export default function AcornRankWidget({ projectId }: { projectId: string }) {
  const { getTopAcornBackups, acornLedger, t } = useApp();
  const sortedMembers = getTopAcornBackups(projectId);

  const projectTxs = acornLedger.filter(tx => tx.project_id === projectId);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🌰</span>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              {t.acornRanking.title}
            </h4>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {t.acornRanking.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Top Priority Backup Banner */}
      {sortedMembers.length > 0 && sortedMembers[0].acorns > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            fontSize: '1.5rem',
            background: 'rgba(245, 158, 11, 0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {sortedMembers[0].avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--acorn-gold)' }}>
                {sortedMembers[0].name}
              </span>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 700,
                background: 'var(--acorn-gold)',
                color: '#000',
                padding: '1px 6px',
                borderRadius: '10px',
              }}>
                {t.acornRanking.topCandidate}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              팀의 배려를 받아 도토리 {sortedMembers[0].acorns}개를 보유 중이며, 다음 병목 발생 시 가장 먼저 지원을 제공합니다.
            </p>
          </div>
        </div>
      )}

      {/* Member Acorn List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedMembers.map((member, index) => (
          <div
            key={member.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', width: '16px' }}>
                {index + 1}
              </span>
              <span style={{ fontSize: '1.1rem' }}>{member.avatar}</span>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {member.name}
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginLeft: '6px' }}>
                  {member.role}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: member.acorns > 0 ? 'var(--acorn-gold)' : 'var(--text-subtle)' }}>
                {member.acorns}개
              </span>
              <span style={{ fontSize: '0.9rem' }}>🌰</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Mutual Aid Logs */}
      {projectTxs.length > 0 && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
            최근 상호부조 기록
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {projectTxs.slice(0, 2).map((tx) => (
              <div key={tx.transaction_id} style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>• {tx.receiver_name}님이 일정 배려로 도토리 +{tx.acorn_count} 획득</span>
                <span style={{ color: 'var(--text-subtle)' }}>기여 대기 중</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
