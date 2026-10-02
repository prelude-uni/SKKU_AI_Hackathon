// src/app/projects/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Plus, Key, ArrowRight, Calendar, Users, CheckCircle2, AlertTriangle, Sparkles, Folder } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, createProject, joinProject, setCurrentProjectId, t } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // New project form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-10-15');

  // Join code form
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const p = createProject(newName, newDesc, newDeadline);
    setNewName('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const success = joinProject(joinCode);
    if (success) {
      setJoinCode('');
      setJoinError(false);
      setShowJoinModal(false);
    } else {
      setJoinError(true);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '12px' }}>
              <Sparkles size={14} color="#818cf8" />
              <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#a5b4fc' }}>
                대학생 지능형 팀플 지원 플랫폼
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              막힌 상태를 쉽게 알리고, 다음 행동으로 전환합니다
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: '1.5' }}>
              마감 독촉 대신 캐릭터가 중립적으로 안부를 묻고, 거대한 과업을 15분 마이크로 미션으로 분해하여 다시 시작을 돕습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="open-create-project-btn"
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>{t.createProject}</span>
            </button>

            <button
              id="open-join-project-btn"
              onClick={() => setShowJoinModal(true)}
              className="btn-secondary"
            >
              <Key size={18} />
              <span>{t.joinProject}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects List Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Folder size={20} color="var(--primary-indigo)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
            {t.activeProjects}
          </h2>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-muted)',
          }}>
            {projects.length}개
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {projects.map((project) => {
          const progressPercent = project.tasks_count > 0 
            ? Math.round((project.completed_tasks_count / project.tasks_count) * 100) 
            : 0;

          return (
            <Link
              key={project.project_id}
              href={`/projects/${project.project_id}/dashboard`}
              onClick={() => setCurrentProjectId(project.project_id)}
              id={`project-card-${project.project_id}`}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--acorn-gold)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}>
                    코드: {project.invite_code}
                  </span>
                  
                  {project.stuck_tasks_count > 0 && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fb7185',
                      background: 'rgba(244, 63, 94, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                    }}>
                      <AlertTriangle size={12} />
                      <span>병목 {project.stuck_tasks_count}건</span>
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: '1.4' }}>
                  {project.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                  {project.description}
                </p>
              </div>

              <div>
                {/* Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>진행률</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{progressPercent}%</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #6366f1, #34d399)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Footer Metadata */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.775rem',
                  color: 'var(--text-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      <span>{project.members.length}명</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      <span>~10.06</span>
                    </span>
                  </div>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-indigo)', fontWeight: 600 }}>
                    <span>대시보드</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#131b2e' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              새 팀플 프로젝트 생성
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '6px' }}>팀플 명</label>
                <input
                  id="create-project-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 성균관대 AI 해커톤 팀플"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '6px' }}>프로젝트 설명</label>
                <textarea
                  id="create-project-desc"
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="프로젝트의 목적과 목표를 간단히 작성하세요..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '6px' }}>최종 마감일</label>
                <input
                  id="create-project-deadline"
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">취소</button>
                <button id="create-project-submit" type="submit" className="btn-primary">팀플 생성</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Project Modal */}
      {showJoinModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', padding: '2rem', background: '#131b2e' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              초대 코드로 팀플 참여
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              팀원이 공유해 준 6자리 초대 코드를 입력하세요.
            </p>
            <form onSubmit={handleJoin}>
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  id="join-code-input"
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="예: SKKU26 또는 CAP991"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#0b0f19',
                    border: joinError ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                  }}
                />
                {joinError && (
                  <p style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: '6px', textAlign: 'center' }}>
                    유효하지 않은 초대 코드입니다. 다시 확인해 주세요.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn-secondary">취소</button>
                <button id="join-project-submit" type="submit" className="btn-primary">참여하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
