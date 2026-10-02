// src/context/AppContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Task, 
  User, 
  MediationRoom, 
  AcornTransaction, 
  SupportedLanguage,
  TaskStatus,
  MicroMission
} from '@/types';
import { 
  mockProjects, 
  mockTasks, 
  mockUsers, 
  mockMediationRooms, 
  mockAcornLedger 
} from '@/lib/mockData';
import { i18n } from '@/lib/translations';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: typeof i18n['ko'];
  currentUser: User;
  projects: Project[];
  currentProjectId: string;
  setCurrentProjectId: (id: string) => void;
  currentProject: Project | undefined;
  tasks: Task[];
  mediationRooms: MediationRoom[];
  acornLedger: AcornTransaction[];
  createProject: (name: string, description: string, deadline: string) => Project;
  joinProject: (code: string) => boolean;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  reportStuck: (taskId: string, reason: string) => string; // returns mediationId
  completeMicroMission: (taskId: string, missionId: string, inputNotes?: string) => void;
  generateAIChecklist: (rawNoticeText: string, projectId: string) => Promise<Task[]>;
  acceptMediationOption: (mediationId: string, optionId: string) => void;
  addChatMessage: (taskId: string, message: string) => void;
  addMediationStatement: (mediationId: string, statement: string, availableHours: string) => void;
  addMediationChatMessage: (mediationId: string, message: string) => void;
  getTopAcornBackups: (projectId: string) => User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>('ko');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string>('prj_team_sync_01');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [mediationRooms, setMediationRooms] = useState<MediationRoom[]>(mockMediationRooms);
  const [acornLedger, setAcornLedger] = useState<AcornTransaction[]>(mockAcornLedger);

  // 현재 사용자
  const currentUser = users.find(u => u.isCurrentUser) || users[0];
  const currentProject = projects.find(p => p.project_id === currentProjectId);

  const t = i18n[language];

  // 도토리 최다 보유자 우선 배정 알고리즘
  const getTopAcornBackups = (projectId: string): User[] => {
    const project = projects.find(p => p.project_id === projectId);
    if (!project) return [];
    // 도토리 내림차순 정렬
    return [...project.members].sort((a, b) => b.acorns - a.acorns);
  };

  // 프로젝트 생성
  const createProject = (name: string, description: string, deadline: string): Project => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newProject: Project = {
      project_id: `prj_${Date.now()}`,
      name,
      description,
      invite_code: randomCode,
      members: [currentUser],
      created_at: new Date().toISOString(),
      deadline,
      tasks_count: 0,
      completed_tasks_count: 0,
      stuck_tasks_count: 0,
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.project_id);
    return newProject;
  };

  // 초대 코드로 참여
  const joinProject = (code: string): boolean => {
    const target = projects.find(p => p.invite_code.toUpperCase() === code.trim().toUpperCase());
    if (target) {
      if (!target.members.some(m => m.id === currentUser.id)) {
        target.members.push(currentUser);
      }
      setCurrentProjectId(target.project_id);
      return true;
    }
    return false;
  };

  // 태스크 상태 변경
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.task_id === taskId) {
        return { ...task, status };
      }
      return task;
    }));
  };

  // '막혔어요' 클릭 -> STUCK 상태 전이 및 AI 중재방 자동 생성
  const reportStuck = (taskId: string, reason: string): string => {
    const task = tasks.find(t => t.task_id === taskId);
    const mediationId = `med_${Date.now()}`;
    
    // 1. 태스크 상태 STUCK으로 변경
    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          status: 'STUCK',
          stuck_reason: reason,
          mediation_id: mediationId,
        };
      }
      return t;
    }));

    // 2. AI 중재방 생성
    const newMediation: MediationRoom = {
      mediation_id: mediationId,
      project_id: task?.project_id || currentProjectId,
      task_id: taskId,
      task_title: task?.title || '과업 병목 해결 중재',
      stuck_member_id: currentUser.id,
      stuck_member_name: currentUser.name,
      reason,
      status: 'IN_DISCUSSION',
      created_at: new Date().toISOString(),
      member_statements: [
        {
          user_id: currentUser.id,
          user_name: currentUser.name,
          statement: reason,
          available_hours: '현재 집중 어려움 / 병목 해소 필요',
          timestamp: '방금 전',
          translated: {
            en: `Stuck reason: ${reason}`,
            zh: `瓶颈原因: ${reason}`
          }
        }
      ],
      proposed_options: [
        {
          id: 'opt_1',
          title: '대안 1: 과업 범위 50% 축소 및 핵심 최소 기능 우선 완료',
          summary: '복잡한 부가 요구사항을 제외하고, 이번 스프린트 통과에 꼭 필요한 핵심 1개만 오늘 중 완성',
          description: '타 팀원에게 부담을 넘기지 않고 목표치를 현실적으로 조정하여 즉시 재시동을 돕습니다.',
          changes: {
            scope_reduction: '핵심 최소 기능 1개로 범위 축소',
            deadline_adjustment: '기존 일정 유지',
          },
          votes: [currentUser.id],
        },
        {
          id: 'opt_2',
          title: '대안 2: 도토리 최다 보유 팀원과 업무 분담 + 마감 24시간 연장 (권장)',
          summary: '팀 내 백업 팀원(도토리 보유자)이 자료 조사를 지원하고 기한을 하루 연장합니다.',
          description: '상호부조 규칙에 따라 도움을 받는 팀원에게 도토리 +1이 부여되며, 일정을 넉넉히 확보합니다.',
          changes: {
            deadline_adjustment: '마감일 +24시간 연장',
            reassigned_to: '신청자 + 도토리 백업 팀원 공동 진행',
            acorn_transfer: 1,
          },
          votes: [],
        }
      ],
      chat_messages: [
        {
          id: `chat_${Date.now()}`,
          user_id: 'darami_bot',
          user_name: '다람이 (AI 매니저)',
          user_avatar: '🐿️',
          message: `${currentUser.name}님이 과업 진행 중 병목을 공유하셨어요. 감정 소모 없이 합리적인 해결책을 마련해보아요!`,
          created_at: '방금 전',
          translated: {
            en: `${currentUser.name} reported a task bottleneck. Let's find an objective solution together without stress!`,
            zh: `${currentUser.name} 反馈了任务瓶颈。让我们以客观理性的方式共同解决！`
          }
        }
      ]
    };

    setMediationRooms(prev => [newMediation, ...prev]);
    return mediationId;
  };

  // 15분 마이크로 미션 완료 처리 (재시동 게이미피케이션)
  const completeMicroMission = (taskId: string, missionId: string, inputNotes?: string) => {
    setTasks(prev => prev.map(task => {
      if (task.task_id === taskId && task.micro_missions) {
        const updatedMissions = task.micro_missions.map(m => {
          if (m.id === missionId) {
            return { ...m, completed: true, user_input: inputNotes };
          }
          return m;
        });

        // 1개 이상 완료 시 태스크 상태를 IN_PROGRESS로 재시동!
        const hasCompletedOne = updatedMissions.some(m => m.completed);
        const newStatus = (task.status === 'STUCK' && hasCompletedOne) ? 'IN_PROGRESS' : task.status;

        return {
          ...task,
          status: newStatus,
          micro_missions: updatedMissions,
        };
      }
      return task;
    }));

    // 사용자에게 보상 도토리 +1
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, acorns: u.acorns + 1 };
      }
      return u;
    }));
  };

  // AI 체크리스트 자동 생성 (1~2시간 단위 마이크로 태스크로 자동 분해)
  const generateAIChecklist = async (rawNoticeText: string, projectId: string): Promise<Task[]> => {
    // 텍스트 분석 시뮬레이션
    const sampleItems = [
      {
        title: '요구사항 분해 및 평가 지표 정의서 작성',
        category: 'DOCUMENTATION' as const,
        dod: '평가 기준 3가지 및 기술 스택 선정 이유 1페이지 정리',
      },
      {
        title: '핵심 기능 UI 프로토타입 2종 와이어프레임 설계',
        category: 'DESIGN' as const,
        dod: '모바일/데스크톱 뷰 2종 화면 흐름도 완성',
      },
      {
        title: '모듈 인터페이스 정의 및 더미 API 엔드포인트 세팅',
        category: 'DEVELOPMENT' as const,
        dod: 'FastAPI/Next.js 라우트 정의 및 Swagger 연동',
      },
      {
        title: '사례 조사 및 발표자료 뼈대 구성',
        category: 'RESEARCH' as const,
        dod: '기존 한계점 및 해결 솔루션 비교 슬라이드 5장 완성',
      }
    ];

    const newGeneratedTasks: Task[] = sampleItems.map((item, idx) => {
      const now = new Date();
      now.setHours(now.getHours() + (idx + 1) * 6);
      return {
        task_id: `tsk_ai_${Date.now()}_${idx}`,
        project_id: projectId,
        assignee_id: users[idx % users.length].id,
        assignee_name: users[idx % users.length].name,
        title: `[AI 분해] ${item.title}`,
        description: `입력된 과제 공지/회의록을 2시간 단위 액션 아이템으로 변환한 과업입니다:\n"${rawNoticeText.slice(0, 60)}..."`,
        due_date: now.toISOString(),
        definition_of_done: item.dod,
        status: 'NOT_STARTED',
        deliverables: [],
        created_at: new Date().toISOString(),
        category: item.category,
      };
    });

    setTasks(prev => [...newGeneratedTasks, ...prev]);
    return newGeneratedTasks;
  };

  // AI 협의안 수락 -> 상태 RESOLVED, 일정/담당자 갱신, 도토리 원장 반영
  const acceptMediationOption = (mediationId: string, optionId: string) => {
    const mediation = mediationRooms.find(m => m.mediation_id === mediationId);
    if (!mediation) return;

    const chosenOption = mediation.proposed_options.find(o => o.id === optionId);
    if (!chosenOption) return;

    // 1. 중재방 상태 RESOLVED
    setMediationRooms(prev => prev.map(m => {
      if (m.mediation_id === mediationId) {
        return {
          ...m,
          status: 'RESOLVED',
          selected_option_id: optionId,
        };
      }
      return m;
    }));

    // 2. 태스크 상태 RESOLVED & 일정/내용 갱신
    setTasks(prev => prev.map(t => {
      if (t.task_id === mediation.task_id) {
        return {
          ...t,
          status: 'RESOLVED',
          description: `${t.description || ''}\n\n[AI 협의안 반영]: ${chosenOption.summary}`,
        };
      }
      return t;
    }));

    // 3. 도토리 발급 (배려받은 사람에게 도토리 +1)
    if (chosenOption.changes.acorn_transfer) {
      const newTx: AcornTransaction = {
        transaction_id: `acorn_tx_${Date.now()}`,
        project_id: mediation.project_id,
        receiver_id: mediation.stuck_member_id,
        receiver_name: mediation.stuck_member_name,
        giver_id: 'team_aid',
        giver_name: '팀 상호부조',
        reason: 'MEDIATION_TASK_REDUCED',
        acorn_count: chosenOption.changes.acorn_transfer,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };
      setAcornLedger(prev => [newTx, ...prev]);

      // 사용자 도토리 수 갱신
      setUsers(prev => prev.map(u => {
        if (u.id === mediation.stuck_member_id) {
          return { ...u, acorns: u.acorns + chosenOption.changes.acorn_transfer! };
        }
        return u;
      }));
    }
  };

  // 태스크 댓글 추가
  const addChatMessage = (taskId: string, message: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      message,
      created_at: '방금 전',
      translated: {
        en: `[Auto-Translated] ${message}`,
        zh: `[自动翻译] ${message}`,
        ko: message
      }
    };
    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
      }
      return t;
    }));
  };

  // 중재방 팀원 상황 설명 추가
  const addMediationStatement = (mediationId: string, statement: string, availableHours: string) => {
    setMediationRooms(prev => prev.map(m => {
      if (m.mediation_id === mediationId) {
        return {
          ...m,
          member_statements: [
            ...m.member_statements,
            {
              user_id: currentUser.id,
              user_name: currentUser.name,
              statement,
              available_hours: availableHours,
              timestamp: '방금 전',
              translated: {
                en: `[Statement] ${statement}`,
                zh: `[发言] ${statement}`,
                ko: statement
              }
            }
          ]
        };
      }
      return m;
    }));
  };

  // 중재방 채팅 추가
  const addMediationChatMessage = (mediationId: string, message: string) => {
    const newMsg = {
      id: `mchat_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      message,
      created_at: '방금 전',
      translated: {
        en: `[Translated] ${message}`,
        zh: `[翻译] ${message}`,
        ko: message
      }
    };
    setMediationRooms(prev => prev.map(m => {
      if (m.mediation_id === mediationId) {
        return {
          ...m,
          chat_messages: [...m.chat_messages, newMsg]
        };
      }
      return m;
    }));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      currentUser,
      projects,
      currentProjectId,
      setCurrentProjectId,
      currentProject,
      tasks,
      mediationRooms,
      acornLedger,
      createProject,
      joinProject,
      updateTaskStatus,
      reportStuck,
      completeMicroMission,
      generateAIChecklist,
      acceptMediationOption,
      addChatMessage,
      addMediationStatement,
      addMediationChatMessage,
      getTopAcornBackups,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
