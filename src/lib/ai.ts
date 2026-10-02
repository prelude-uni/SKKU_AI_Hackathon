// src/lib/ai.ts

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  response_format?: { type: 'json_object' };
  temperature?: number;
  max_tokens?: number;
}

const DEFAULT_BASE_URL = 'https://factchat-cloud.mindlogic.ai/v1/gateway';
const DEFAULT_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gpt-5.4-mini'];

export function getAiConfig() {
  const apiKey =
    process.env.BAZE_API_KEY ||
    process.env.OPENAI_API_KEY ||
    '';
  const baseURL =
    process.env.BAZE_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    DEFAULT_BASE_URL;
  const defaultModel = process.env.AI_MODEL || DEFAULT_MODEL;

  return { apiKey, baseURL, defaultModel };
}

/**
 * BAZE API Gateway를 통한 Gemini 3.8 Flash 및 LLM 호출 함수
 * (모델 호출 오류 발생 시 자동 대체 모델 폴백 지원)
 */
export async function callAiChatCompletion(options: ChatCompletionOptions) {
  const { apiKey, baseURL, defaultModel } = getAiConfig();
  const modelsToTry = [options.model || defaultModel, ...FALLBACK_MODELS.filter(m => m !== (options.model || defaultModel))];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          response_format: options.response_format,
          temperature: options.temperature ?? 0.3,
          max_tokens: options.max_tokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`[BAZE Gateway HTTP ${response.status}] ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        model,
        content,
        raw: data,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI Gateway] 모델 ${model} 호출 실패: ${err.message}. 다음 대체 모델 시도...`);
    }
  }

  throw lastError || new Error('모든 AI 모델 호출에 실패했습니다.');
}
