import type { AIService } from '../../types/ai';

/**
 * Abstraction for AI responses.
 * UI depends on this interface — swap MockAIService for BackendAIService later
 * without rewriting screens.
 */
export type { AIService };
