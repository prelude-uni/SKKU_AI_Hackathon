// src/app/api/ai/checklist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callAiChatCompletion, ChatMessage } from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let inputText = '';
    let fileName = '';
    let imageBase64Url = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      inputText = (formData.get('text') as string) || '';
      const file = formData.get('file') as File | null;

      if (file && file.size > 0) {
        fileName = file.name;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type || 'application/octet-stream';

        if (mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
          const textFromFile = buffer.toString('utf-8');
          inputText = `${inputText}\n\n[첨부 문서 (${fileName}) 내용]:\n${textFromFile}`;
        } else if (mimeType.startsWith('image/')) {
          imageBase64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;
        } else if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
          // PDF 파일 텍스트 추출 시도 또는 바이너리 데이터 전달
          const textPreview = buffer.toString('utf-8').replace(/[^\x20-\x7E\uAC00-\uD7A3\n\r\t]/g, ' ').slice(0, 4000);
          inputText = `${inputText}\n\n[첨부 PDF 문서 (${fileName}) 추출 텍스트]:\n${textPreview}`;
        }
      }
    } else {
      const body = await req.json();
      inputText = body.text || '';
      if (body.image) {
        imageBase64Url = body.image;
      }
    }

    if (!inputText.trim() && !imageBase64Url) {
      return NextResponse.json(
        { error: '회의록/공지사항 텍스트를 입력하거나 분석할 파일(PDF, 이미지, 문서)을 업로드해 주세요.' },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 대학생 팀 프로젝트를 지원하는 지능형 협업 관리 AI 어시스턴트 '도토리 AI'입니다.
제공된 과제 공지사항, 강의계획서, 회의록 또는 첨부 문서를 정밀 분석하여, 학생들이 모호함 없이 즉시 실행할 수 있는 체계적인 마일스톤 체크리스트를 생성해야 합니다.

[작성 지침]
1. 전체 프로젝트 흐름을 3~4개의 순차적인 마일스톤(단계)으로 구조화하세요. (예: 1단계 기획 및 프레임워크 수립, 2단계 자료조사 및 분석, 3단계 핵심 결과물 제작, 4단계 최종 검토 및 발표)
2. 각 단계마다 실질적으로 수행해야 할 핵심 세부 과업을 2~3개씩 도출하세요.
3. 각 과업에는 반드시 모호하지 않은 객관적 '완료 기준(DoD: Definition of Done)'을 명시하세요. (예: "경쟁사 3곳의 핵심 기능 비교표가 포함된 Notion 공유 링크 제출", "Vercel 배포 URL 생성 및 모바일 반응형 검증")
4. 카테고리는 'RESEARCH', 'DEVELOPMENT', 'DESIGN', 'DOCUMENTATION' 중 하나로 분류하세요.
5. 팀원들이 역할을 분담하기 쉽도록 '추천 역할'과 '예상 기간'을 산출하세요.

반드시 아래 JSON 규격으로만 응답하세요:
{
  "project_summary": "프로젝트의 핵심 목표 및 주요 분석 요약 (2~3문장)",
  "phases": [
    {
      "phase_number": 1,
      "phase_name": "1단계: 기획 및 프레임워크 수립",
      "tasks": [
        {
          "title": "[기획] 주제 선정 및 분석 프레임워크 확정",
          "description": "팀 프로젝트 주제 범위 설정 및 교수님 피드백 반영을 위한 기획안 작성",
          "definition_of_done": "A4 2장 분량의 주제 제안서 작성 및 지도교수 승인 완료",
          "category": "RESEARCH",
          "estimated_duration": "3일",
          "recommended_role": "팀장 / 기획"
        }
      ]
    }
  ]
}`;

    const userMessageContent: any = imageBase64Url
      ? [
          { type: 'text', text: `[문서/회의록 내용]:\n${inputText || '첨부된 이미지 속 공지사항/회의록을 분석하여 체크리스트를 생성해 주세요.'}` },
          { type: 'image_url', image_url: { url: imageBase64Url } },
        ]
      : `[문서/회의록 내용]:\n${inputText}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessageContent },
    ];

    const result = await callAiChatCompletion({
      model: 'gemini-3.8-flash',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    let parsedData;
    try {
      parsedData = JSON.parse(result.content);
    } catch (parseError) {
      const cleanJson = result.content.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return NextResponse.json({
      success: true,
      modelUsed: result.model,
      data: parsedData,
      analyzedFile: fileName || undefined,
    });
  } catch (error: any) {
    console.error('Checklist API Error:', error);
    return NextResponse.json(
      {
        error: error.message || '체크리스트 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
