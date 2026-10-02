// src/lib/mockData.ts
import { Project, Task, User, MediationRoom, AcornTransaction } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'usr_me',
    name: '김성균 (나)',
    email: 'sungkyun@skku.edu',
    avatar: '🐿️',
    role: '팀장 / AI 모델링',
    acorns: 5,
    isCurrentUser: true,
  },
  {
    id: 'usr_jieun',
    name: '이지은',
    email: 'jieun@skku.edu',
    avatar: '🦊',
    role: '데이터 엔지니어링',
    acorns: 5,
  },
  {
    id: 'usr_alex',
    name: 'Alex Johnson',
    email: 'alex.j@exchange.skku.edu',
    avatar: '🦉',
    role: 'Frontend / UI/UX',
    acorns: 5,
  },
  {
    id: 'usr_minsu',
    name: '박민수',
    email: 'minsu.park@skku.edu',
    avatar: '🐻',
    role: 'Backend / Serving',
    acorns: 5,
  },
];

export const mockProjects: Project[] = [
  {
    project_id: 'prj_team_sync_01',
    name: '성균관대 AI 해커톤 - 팀플 가이드 (Team Sync)',
    description: '작업 병목을 즉각 해소하고 상호부조 도토리 시스템으로 완성하는 AI 협업 플랫폼',
    invite_code: 'SKKU26',
    members: mockUsers,
    created_at: '2026-10-01T09:00:00Z',
    deadline: '2026-10-06T23:59:00Z',
    tasks_count: 5,
    completed_tasks_count: 2,
    stuck_tasks_count: 1,
  },
  {
    project_id: 'prj_capstone_02',
    name: '컴퓨터공학과 캡스톤디자인 - 캠퍼스 LLM 도우미',
    description: '교내 정보 질의응답 및 시설 예약 자동화 AI 어시스턴트 개발',
    invite_code: 'CAP991',
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    created_at: '2026-09-15T10:00:00Z',
    deadline: '2026-11-20T18:00:00Z',
    tasks_count: 8,
    completed_tasks_count: 4,
    stuck_tasks_count: 0,
  }
];

export const mockTasks: Task[] = [
  {
    task_id: 'tsk_001',
    project_id: 'prj_team_sync_01',
    assignee_id: 'usr_me',
    assignee_name: '김성균 (나)',
    title: '경쟁 서비스 벤치마킹 및 핵심 차별화 비교표 작성',
    description: '국내외 유사 협업 서비스 3종(Notion, Slack, Miro)의 병목 해결 기능 및 알림 방식을 조사하고 우리 서비스만의 차별화 포인트 3가지 도출',
    due_date: '2026-10-04T18:00:00Z',
    definition_of_done: '국내외 유사 서비스 3종 핵심 기능 비교표 작성 및 Notion 링크 제출',
    status: 'STUCK',
    deliverables: [],
    created_at: '2026-10-01T10:00:00Z',
    category: 'RESEARCH',
    stuck_reason: '해외 서비스 유료 티어 기능 접근 제한과 비교 분석 지표 기준이 모호하여 어디서부터 정리해야 할지 막힘',
    mediation_id: 'med_001',
    micro_missions: [
      {
        id: 'mm_001',
        title: 'Step 1: 유사 서비스 1개(Slack)의 알림 방식 단점 딱 1문장 적기',
        step: 1,
        duration_minutes: 10,
        completed: false,
        reward_acorn: 1,
      },
      {
        id: 'mm_002',
        title: 'Step 2: 우리 서비스가 제공할 차별점 키워드 3개 브레인스토밍',
        step: 2,
        duration_minutes: 15,
        completed: false,
        reward_acorn: 1,
      }
    ],
    comments: [
      {
        id: 'c_01',
        user_id: 'usr_me',
        user_name: '김성균 (나)',
        user_avatar: '🐿️',
        message: '지표 기준을 어디까지 잡아야 할지 너무 막연해서 손이 안 가네요 ㅠㅠ',
        created_at: '10분 전',
        translated: {
          en: "I'm overwhelmed because the benchmark criteria are too vague, hard to start :(",
          zh: "由于评估标准太模糊，不知道该从何下手，有点卡住了 ㅠㅠ"
        }
      },
      {
        id: 'c_02',
        user_id: 'usr_alex',
        user_name: 'Alex Johnson',
        user_avatar: '🦉',
        message: 'Don\'t worry Sungkyun! We just need 2 key features to compare: notification style and task splitting.',
        created_at: '5분 전',
        translated: {
          ko: '걱정 마 성균! 알림 스타일이랑 태스크 분해 2가지 핵심 기능만 비교하면 돼.',
          zh: '别担心！我们只需要对比通知形式和任务拆解这两项核心功能就行。'
        }
      }
    ]
  },
  {
    task_id: 'tsk_002',
    project_id: 'prj_team_sync_01',
    assignee_id: 'usr_minsu',
    assignee_name: '박민수',
    title: 'FastAPI 기반 AI 협의안 생성 및 프롬프트 파이프라인 연동',
    description: '사용자 상태 및 제약 조건을 입력받아 객관적 2개 대안을 반환하는 LLM Chain 엔드포인트 구현',
    due_date: '2026-10-05T12:00:00Z',
    definition_of_done: 'POST /api/mediate Swagger 테스트 완료 및 200 OK 응답 검증',
    status: 'IN_PROGRESS',
    deliverables: ['https://github.com/prelude-uni/SKKU_AI_Hackathon'],
    created_at: '2026-10-02T11:00:00Z',
    category: 'DEVELOPMENT',
  },
  {
    task_id: 'tsk_003',
    project_id: 'prj_team_sync_01',
    assignee_id: 'usr_alex',
    assignee_name: 'Alex Johnson',
    title: 'Next.js App Router 대시보드 UI 및 글래스모피즘 디자인 시스템',
    description: '반응형 대시보드 그리드, 다크/라이트 테마 카드, 상태 태그 뱃지 컴포넌트 완성',
    due_date: '2026-10-03T18:00:00Z',
    definition_of_done: 'Vercel Preview 배포 링크 생성 및 모바일 반응형 확인',
    status: 'COMPLETED',
    deliverables: ['https://team-sync-assistant.vercel.app'],
    created_at: '2026-10-01T14:00:00Z',
    category: 'DESIGN',
  },
  {
    task_id: 'tsk_004',
    project_id: 'prj_team_sync_01',
    assignee_id: 'usr_jieun',
    assignee_name: '이지은',
    title: '실제 팀플 갈등 시나리오 데이터셋 수집 및 분류 태깅',
    description: '대학생 커뮤니티(에브리타임) 팀플 지연 사례 30건 분석하여 병목 원인 카테고리화',
    due_date: '2026-10-05T20:00:00Z',
    definition_of_done: 'CSV 데이터셋 30행 구축 및 data/ 디렉터리에 업로드',
    status: 'NOT_STARTED',
    deliverables: [],
    created_at: '2026-10-02T09:00:00Z',
    category: 'RESEARCH',
  },
  {
    task_id: 'tsk_005',
    project_id: 'prj_team_sync_01',
    assignee_id: 'usr_alex',
    assignee_name: 'Alex Johnson',
    title: '다국어 실시간 번역 인터페이스 및 인라인 토글 개발',
    description: '팀원별 선호 언어(한국어/영어/중국어) 자동 감지 및 원문/번역문 토글 렌더링',
    due_date: '2026-10-06T15:00:00Z',
    definition_of_done: '번역 토글 클릭 시 0.2초 이내 부드러운 전환',
    status: 'IN_PROGRESS',
    deliverables: [],
    created_at: '2026-10-02T16:00:00Z',
    category: 'DEVELOPMENT',
  }
];

export const mockMediationRooms: MediationRoom[] = [
  {
    mediation_id: 'med_001',
    project_id: 'prj_team_sync_01',
    task_id: 'tsk_001',
    task_title: '경쟁 서비스 벤치마킹 및 핵심 차별화 비교표 작성',
    stuck_member_id: 'usr_me',
    stuck_member_name: '김성균 (나)',
    reason: '해외 서비스 유료 티어 접근 불가 및 비교 지표 기준 모호로 인한 진행 정체',
    status: 'PROPOSED',
    created_at: '2026-10-03T10:15:00Z',
    member_statements: [
      {
        user_id: 'usr_me',
        user_name: '김성균 (나)',
        statement: '유료 기능까지 다 비교하려니 시간도 부족하고, 당장 모델 파이프라인 작업도 병행해야 해서 과부하가 걸렸습니다.',
        available_hours: '오늘 저녁 1시간 가용',
        timestamp: '10:18',
        translated: {
          en: 'Trying to compare all paid features takes too much time, and I have to work on the model pipeline simultaneously, so I am overloaded.',
          zh: '尝试对比所有付费功能耗费太多时间，同时还要兼顾模型流程，导致负荷过重。'
        }
      },
      {
        user_id: 'usr_jieun',
        user_name: '이지은',
        statement: '데이터셋 조사가 늦어져서 저도 여유는 많지 않지만, 경쟁사 1곳(Notion)은 제가 이미 써봐서 대신 비교 작성해줄 수 있어요!',
        available_hours: '오늘 2시간 추가 가용 가능',
        timestamp: '10:22',
        translated: {
          en: "I'm busy with datasets too, but I already use Notion heavily, so I can take over comparing Notion instead!",
          zh: '我虽然在赶数据集，但我一直在用Notion，我可以负责对比Notion这部分！'
        }
      },
      {
        user_id: 'usr_alex',
        user_name: 'Alex Johnson',
        statement: 'I can quickly fill in the UI comparison for Slack within 30 minutes if you give me the sheet template.',
        available_hours: 'Available 30 mins now',
        timestamp: '10:25',
        translated: {
          ko: '시트 템플릿만 주면 내가 30분 안에 Slack UI 비교 항목을 빠르게 채워줄 수 있어.',
          zh: '如果给我表格模板，我可以在30分钟内快速填好Slack的界面对比。'
        }
      }
    ],
    proposed_options: [
      {
        id: 'opt_a',
        title: '대안 A: 과업 분량 축소 및 핵심 2개 지표 우선 제출',
        summary: '전체 유료 기능 분석을 배제하고, "알림 방식"과 "작업 분해" 2개 핵심 지표에만 집중하여 오늘 자정까지 성균님이 1인 완성',
        description: '타 팀원의 업무 부하 없이, 과업 범위를 필수 핵심 항목으로 60% 축소하여 정체를 해소합니다.',
        changes: {
          scope_reduction: '비교 항목 10개 -> 핵심 2개(알림, 작업분해)로 축소',
          deadline_adjustment: '기존 일정 유지 (오늘 23:59)',
        },
        votes: ['usr_me'],
      },
      {
        id: 'opt_b',
        title: '대안 B: 지은·Alex와 업무 재분담 + 기한 1일 연장 (권장)',
        summary: 'Notion은 이지은, Slack은 Alex가 분담하고, 성균님은 요약본만 취합. 기한을 10월 5일 정오로 18시간 연장하며 성균님에게 도토리 1개 부여',
        description: '가용 시간이 있는 팀원들이 15분씩 분담하고, 배려받은 성균님에게 도토리 1개가 발급되어 추후 긴급 지원 1순위로 기여를 갚습니다.',
        changes: {
          scope_reduction: '성균님 담당: 종합 요약 (Notion은 지은, Slack은 Alex 분담)',
          deadline_adjustment: '10월 5일 12:00 (18시간 연장)',
          reassigned_to: '김성균, 이지은, Alex Johnson 공동 분담',
          acorn_transfer: 1,
        },
        votes: ['usr_jieun', 'usr_alex'],
      }
    ],
    chat_messages: [
      {
        id: 'chat_01',
        user_id: 'usr_me',
        user_name: '김성균 (나)',
        user_avatar: '🐿️',
        message: '다들 제안 확인해주셔서 정말 고마워요. 대안 B로 가면 오늘 밤에 모델 파이프라인에 집중할 수 있을 것 같아요!',
        created_at: '10:30',
        translated: {
          en: 'Thank you all for checking the proposals! If we go with Option B, I can focus on the model pipeline tonight.',
          zh: '非常感谢大家的查看！如果选方案B，我今晚就能集中精力做模型流程了。'
        }
      }
    ]
  }
];

export const mockAcornLedger: AcornTransaction[] = [
  {
    transaction_id: 'acorn_tx_001',
    project_id: 'prj_team_sync_01',
    receiver_id: 'usr_me',
    receiver_name: '김성균 (나)',
    giver_id: 'usr_jieun',
    giver_name: '이지은',
    reason: 'MEDIATION_TASK_REDUCED',
    acorn_count: 1,
    status: 'ACTIVE',
    created_at: '2026-10-02T14:30:00Z',
  },
  {
    transaction_id: 'acorn_tx_002',
    project_id: 'prj_team_sync_01',
    receiver_id: 'usr_me',
    receiver_name: '김성균 (나)',
    giver_id: 'usr_alex',
    giver_name: 'Alex Johnson',
    reason: 'HELPED_STUCK_TEAMMATE',
    acorn_count: 1,
    status: 'ACTIVE',
    created_at: '2026-10-02T19:00:00Z',
  },
  {
    transaction_id: 'acorn_tx_003',
    project_id: 'prj_team_sync_01',
    receiver_id: 'usr_alex',
    receiver_name: 'Alex Johnson',
    giver_id: 'usr_minsu',
    giver_name: '박민수',
    reason: 'MEDIATION_TASK_REDUCED',
    acorn_count: 1,
    status: 'ACTIVE',
    created_at: '2026-10-01T17:00:00Z',
  }
];
