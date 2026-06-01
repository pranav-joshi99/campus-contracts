/**
 * GET /api/v2/take/:assessmentId/interview/context  (candidate JWT)
 *
 * Single-fetch session-start payload for the orchestrator + TTS pre-render
 * path. Window A producer, Windows B + D consumers.
 *
 * Pulled verbatim at platform-api SHA 58230e1 (Round 8.2 final).
 *
 * Round 9 evolution flagged: NUMBER_OF_ADAPTIVE_QUESTIONS deprecated alias
 * for max_questions_cap (CTO ack 2026-06-01). The interview-context
 * response surfaces both names through Round 9; Round 10 drops the alias.
 */
import { z } from 'zod'

export const InterviewContextResponse = z.object({
  speaking_test_present: z.boolean(),
  durationMinutes: z.number().int().nullable(),
  maxQuestionsCap: z.number().int().nullable(),
  welcomeText: z.string(),
  branchAText: z.string(),
  branchBText: z.string(),
  candidateName: z.string().nullable(),
  candidateFirstName: z.string(),
  interviewSectionId: z.number().int().nullable(),
  assessmentId: z.number().int(),
})
export type InterviewContextResponse = z.infer<typeof InterviewContextResponse>
