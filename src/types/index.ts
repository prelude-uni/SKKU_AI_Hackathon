// src/types/index.ts

export type TaskStatus = 
  | 'NOT_STARTED'   // 미진행 과업
  | 'IN_PROGRESS'   // 정상 진행 중
  | 'STUCK'         // '막혔어요' 클릭 또는 체크인으로 병목 감지된 상태
  | 'IN_MEDIATION'  // AI 중재방에서 협의안 논의 대기/진행 중인 상태
  | 'RESOLVED'      // 협의안 수락으로 일정/역할 재조정 완료
  | 'COMPLETED';    // 완료 기준 충족 및 결과물 등록 완료

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  acorns: number; // 보유 도토리 개수
  isCurrentUser?: boolean;
}

export interface Task {
  task_id: string;
  project_id: string;
  assignee_id: string;
  assignee_name?: string;
  title: string;
  description?: string;
  due_date: string;
  definition_of_done: string; // 완료 기준 (DoD)
  status: TaskStatus;
  deliverables: string[];
  created_at: string;
  category?: 'RESEARCH' | 'DEVELOPMENT' | 'DESIGN' | 'DOCUMENTATION';
  stuck_reason?: string;
  mediation_id?: string;
  micro_missions?: MicroMission[];
  comments?: TaskComment[];
}

export interface MicroMission {
  id: string;
  title: string;
  step: number;
  duration_minutes: number;
  completed: boolean;
  reward_acorn: number;
  user_input?: string;
}

export interface TaskComment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  message: string;
  created_at: string;
  translated?: {
    en?: string;
    zh?: string;
    ko?: string;
  };
}

export interface Project {
  project_id: string;
  name: string;
  description: string;
  invite_code: string;
  members: User[];
  created_at: string;
  deadline: string;
  tasks_count: number;
  completed_tasks_count: number;
  stuck_tasks_count: number;
}

export interface MediationOption {
  id: string;
  title: string;
  description: string;
  summary: string;
  changes: {
    deadline_adjustment?: string;
    scope_reduction?: string;
    reassigned_to?: string;
    acorn_transfer?: number;
  };
  votes: string[]; // user ids
}

export interface MediationRoom {
  mediation_id: string;
  project_id: string;
  task_id: string;
  task_title: string;
  stuck_member_id: string;
  stuck_member_name: string;
  reason: string;
  status: 'PENDING' | 'IN_DISCUSSION' | 'PROPOSED' | 'RESOLVED';
  created_at: string;
  member_statements: {
    user_id: string;
    user_name: string;
    statement: string;
    available_hours?: string;
    timestamp: string;
    translated?: {
      en?: string;
      zh?: string;
      ko?: string;
    };
  }[];
  proposed_options: MediationOption[];
  selected_option_id?: string;
  chat_messages: TaskComment[];
}

export interface AcornTransaction {
  transaction_id: string;
  project_id: string;
  receiver_id: string;
  receiver_name: string;
  giver_id: string;
  giver_name: string;
  reason: 'MEDIATION_TASK_REDUCED' | 'HELPED_STUCK_TEAMMATE' | 'MICRO_MISSION_COMPLETED' | 'EMERGENCY_BACKUP';
  acorn_count: number;
  status: 'ACTIVE' | 'USED';
  created_at: string;
}

export type SupportedLanguage = 'ko' | 'en' | 'zh';
