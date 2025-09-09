import type { CodeDiff, ReviewResult } from '../core/reviewer'

export interface AiProviderConfig {
  provider: 'openai'
  model: string
  apiKey?: string
  baseUrl?: string
  temperature?: number
  maxTokens?: number
  review?: {
    prompts?: {
      system?: string
      review?: string
      summary?: string
    }
  }
}

export interface AiProvider {
  /**
   * 审查代码差异
   */
  reviewCode: (diff: CodeDiff) => Promise<ReviewResult>

  /**
   * 生成审查总结
   */
  generateSummary: (results: ReviewResult[]) => Promise<string>

}
