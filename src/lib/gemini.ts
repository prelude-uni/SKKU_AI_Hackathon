// src/lib/gemini.ts
import { callAiChatCompletion, ChatMessage } from './ai';

export { callAiChatCompletion };

/**
 * Gemini 호환용 텍스트/JSON 생성 래퍼
 */
export async function generateContentWithFallback(
  prompt: string | ChatMessage[],
  config?: { responseMimeType?: string; temperature?: number }
) {
  const messages: ChatMessage[] = Array.isArray(prompt)
    ? prompt
    : [{ role: 'user', content: prompt }];

  const res = await callAiChatCompletion({
    model: 'gemini-3.8-flash',
    messages,
    response_format: config?.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined,
    temperature: config?.temperature,
  });

  return {
    modelName: res.model,
    text: res.content,
  };
}
