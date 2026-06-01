/**
 * Interview transcript GETs — chat-ready turns + per-session DTO.
 *
 * Candidate variant: GET /api/v2/take/:assessmentId/interview/transcript
 *   Auth: candidate JWT. 403 unless assessment.showAnswersToCandidate.
 * Assessor variant: GET /api/v2/attempts/:attemptId/interview/transcript
 *   Auth: assessor JWT. Always returns the canonical transcript.
 *
 * Pulled verbatim at platform-api SHA 58230e1 (Round 8.2 final — accepts
 * role='agent' alongside 'ai', normalises output to 'agent').
 */
import { z } from 'zod'
import { PersistedEndReason } from '../enums/end-reason.js'

export const InterviewTurn = z.object({
  role: z.enum(['agent', 'candidate', 'system']),
  text: z.string(),
  ts: z.string().nullable(), // ISO-8601 or null
  prev_answer_score: z.number().nullable().optional(),
  question_intent: z.string().nullable().optional(),
})
export type InterviewTurn = z.infer<typeof InterviewTurn>

export const InterviewSessionDTO = z.object({
  id: z.number().int().positive(),
  interviewType: z.enum(['technical', 'english_speaking']).nullable(),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  endedReason: PersistedEndReason.nullable(),
  /** Free-text detail field; assessor variant includes this. */
  endedReasonDetail: z.string().nullable().optional(),
  durationMinutes: z.number().int().nullable(),
  maxQuestionsCap: z.number().int().nullable(),
  questionsAsked: z.number().int().nullable(),
  audioRecordingUrl: z.string().nullable(),
  /** Assessor variant only — not exposed to candidates. */
  tamperingAttempts: z.number().int().optional(),
})
export type InterviewSessionDTO = z.infer<typeof InterviewSessionDTO>

export const InterviewTranscriptResponse = z.object({
  turns: z.array(InterviewTurn),
  sessions: z.array(InterviewSessionDTO),
})
export type InterviewTranscriptResponse = z.infer<typeof InterviewTranscriptResponse>
