// src/app/projects/[id]/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import CharacterCheckin from '@/components/CharacterCheckin';
import AIChecklistModal from '@/components/AIChecklistModal';
import MicroMissionModal from '@/components/MicroMissionModal';
import StuckReportModal from '@/components/StuckReportModal';
import AcornRankWidget from '@/components/AcornRankWidget';
import { Task, TaskStatus } from '@/types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  ArrowRight, 
  Plus, 
  Share2, 
  Calendar,
  MessageSquareText,
  Filter,
  CheckSquare,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || 'prj_team_sync_01';
  const { projects, tasks, currentUser, updateTaskStatus, t } = useApp();

  const project = projects.find(p => p.project_id === projectId) || projects[0];
  const projectTasks = tasks.filter(t => t.project_id === projectId);

  // Modals state
  const [showAIChecklist, setShowAIChecklist] = useState(false);
  const [selectedTaskForMission, setSelectedTaskForMission] = useState<Task | undefined>(undefined);
  const [selectedTaskForStuck, setSelectedTaskForStuck] = useState<Task | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter tasks
  const myTasks = projectTasks.filter(t => t.assignee_id === currentUser.id);
  const urgentTasks = projectTasks.filter(t => t.status === 'STUCK' || t.status === 'IN_MEDIATION');

  const filteredTeamTasks = projectTasks.filter(t => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'MINE') return t.assignee_id === currentUser.id;
    if (filterCategory === 'STUCK') return t.status === 'STUCK' || t.status === 'IN_MEDIATION';
    if (filterCategory === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'NOT_STARTED':
        return <span className="status-badge badge-NOT_STARTED">미진행</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge badge-IN_PROGRESS">진행 중</span>;
      case 'STUCK':
        return <span className="status-badge badge-STUCK">🚨 막혔어요</span>;
      case 'IN_MEDIATION':
        return <span className="status-badge badge-IN_MEDIATION">⚖️ AI 중재 중</span>;
      case 'RESOLVED':
        return <span className="status-badge badge-RESOLVED">✨ 협의 완료</span>;
      case 'COMPLETED':
        return <span className="status-badge badge-COMPLETED">✅ 완료</span>;
      default:
        return null;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.invite_code);
    alert(`초대 코드 [${project.invite_code}]가 클립보드에 복사되었습니다!`);
  };

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="glass-panel" style={{
        padding: '1.5rem 1.75rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
            }}>
              PROJECT DASHBOARD
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              생성일: 2026.10.01
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {project.name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {project.description}
          </p>
        </div>

        {/* Header Actions & Invite Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="copy-invite-code-btn"
            onClick={handleCopyCode}
            className="btn-secondary"
            style={{ fontSize: '0.825rem' }}
          >
            <Share2 size={15} />
            <span>초대 코드: {project.invite_code}</span>
          </button>

          <button
            id="dashboard-open-ai-checklist"
            onClick={() => setShowAIChecklist(true)}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            <span>{t.tasks.generateAIChecklist}</span>
          </button>
        </div>
      </div>

      {/* 🐿️ 다람이 캐릭터 안부 체크인 배너 (Character Check-in) */}
      <CharacterCheckin
        onOpenMicroMission={() => {
          const stuckTask = myTasks.find(t => t.status === 'STUCK') || myTasks[0];
          setSelectedTaskForMission(stuckTask);
        }}
        onOpenStuckReport={() => {
          const target = myTasks[0] || projectTasks[0];
          setSelectedTaskForStuck(target);
        }}
        onOpenMediationRoom={() => {
          router.push('/mediation/med_001');
        }}
      />

      {/* Main Grid: Left (Tasks) & Right (Acorns + Stats) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(300px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Tasks Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 🚨 1. 도움 요청 / 합의 대기 섹션 (Urgent Bottlenecks) */}
          {urgentTasks.length > 0 && (
            <div className="glass-panel" style={{
              padding: '1.25rem',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              background: 'linear-gradient(135deg, rgba(31, 18, 28, 0.8) 0%, rgba(17, 24, 39, 0.85) 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#fb7185" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                    {t.tasks.helpRequests} ({urgentTasks.length})
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>
                  상호부조 협의 필요
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {urgentTasks.map(task => (
                  <div
                    key={task.task_id}
                    id={`urgent-task-${task.task_id}`}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {getStatusBadge(task.status)}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          담당: {task.assignee_name}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                        {task.title}
                      </h4>
                      {task.stuck_reason && (
                        <p style={{ fontSize: '0.775rem', color: '#fda4af', lineHeight: '1.4' }}>
                          💬 병목 원인: {task.stuck_reason}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {task.status === 'STUCK' && (
                        <button
                          id={`start-micro-mission-${task.task_id}`}
                          onClick={() => setSelectedTaskForMission(task)}
                          className="btn-acorn"
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          <Zap size={14} />
                          <span>15분 미션 재시동</span>
                        </button>
                      )}
                      <Link
                        href={task.mediation_id ? `/mediation/${task.mediation_id}` : `/tasks/${task.task_id}`}
                        id={`open-mediation-${task.task_id}`}
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                      >
                        <MessageSquareText size={14} />
                        <span>AI 중재방 입장</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 📋 2. 팀 전체 체크리스트 (Team Tasks) */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="var(--primary-indigo)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  {t.tasks.teamTasks}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  ({projectTasks.length}개)
                </span>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '8px' }}>
                {[
                  { id: 'ALL', label: '전체' },
                  { id: 'MINE', label: '내 할 일' },
                  { id: 'STUCK', label: '병목/중재' },
                  { id: 'COMPLETED', label: '완료' },
                ].map((f) => (
                  <button
                    key={f.id}
                    id={`filter-btn-${f.id}`}
                    onClick={() => setFilterCategory(f.id)}
                    style={{
                      background: filterCategory === f.id ? 'var(--primary-indigo)' : 'transparent',
                      color: filterCategory === f.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTeamTasks.map((task) => (
                <div
                  key={task.task_id}
                  id={`task-item-${task.task_id}`}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    {/* Quick Complete / Status Toggle Checkbox */}
                    <button
                      onClick={() => {
                        const nextStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
                        updateTaskStatus(task.task_id, nextStatus);
                      }}
                      style={{
                        marginTop: '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: task.status === 'COMPLETED' ? 'none' : '2px solid var(--border-subtle)',
                        background: task.status === 'COMPLETED' ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="완료 상태 토글"
                    >
                      {task.status === 'COMPLETED' && <CheckCircle2 size={16} color="#fff" />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {getStatusBadge(task.status)}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          마감: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                        {task.category && (
                          <span style={{ fontSize: '0.675rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                            {task.category}
                          </span>
                        )}
                      </div>

                      <Link href={`/tasks/${task.task_id}`} style={{ textDecoration: 'none' }}>
                        <h4 style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: task.status === 'COMPLETED' ? 'var(--text-muted)' : '#fff',
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                          marginBottom: '4px',
                        }}>
                          {task.title}
                        </h4>
                      </Link>

                      <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        🎯 완료 기준(DoD): {task.definition_of_done}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Assignee & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', display: 'block' }}>
                        {task.assignee_name}
                      </span>
                    </div>

                    <Link
                      href={`/tasks/${task.task_id}`}
                      id={`view-task-detail-${task.task_id}`}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      <span>상세</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Acorn Mutual Aid + Project Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 도토리(Acorn) 상호부조 원장 위젯 */}
          <AcornRankWidget projectId={projectId} />

          {/* Project Summary Card */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              프로젝트 진행 현황
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>전체 과업</span>
                <strong style={{ color: '#fff' }}>{projectTasks.length}개</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>완료 과업</span>
                <strong style={{ color: '#34d399' }}>
                  {projectTasks.filter(t => t.status === 'COMPLETED').length}개
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>정체/중재 건</span>
                <strong style={{ color: '#fb7185' }}>{urgentTasks.length}건</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', lineHeight: '1.4' }}>
                  💡 <strong>팀플 가이드 팁</strong>: 정체된 과업은 지적하지 않고 15분 마이크로 미션으로 분해하거나 AI 중재방에서 해결책을 합의합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <AIChecklistModal
        isOpen={showAIChecklist}
        onClose={() => setShowAIChecklist(false)}
        projectId={projectId}
      />

      <MicroMissionModal
        isOpen={!!selectedTaskForMission}
        onClose={() => setSelectedTaskForMission(undefined)}
        task={selectedTaskForMission}
      />

      <StuckReportModal
        isOpen={!!selectedTaskForStuck}
        onClose={() => setSelectedTaskForStuck(undefined)}
        task={selectedTaskForStuck}
      />
    </div>
  );
}
