/**
 * Attempt-report response + show-answers shape — R10 WA-3 + WA-4 BATCH 3.
 *
 * Replaces the Round 9 `Round9SectionMetricsTODO` placeholder. Locked at
 * R10 mega dispatch.
 */
import { z } from 'zod'
import { CEFR_LEVELS, CEFR_OVERALL_LEVELS } from '../enums/cefr.js'

// ---- per-section score (non-interview) ------------------------------------

export const sectionScoreSchema = z.object({
  sectionId: z.number().int().positive(),
  /** Admin-set display_name from sections; falls back to title when null. */
  sectionTitle: z.string(),
  moduleCode: z.string(),
  /** True for everything except interview sections (locked: interview NOT scored). */
  scored: z.boolean(),
  score: z.number(),
  maxScore: z.number(),
  scoreNormalized: z.number(),
  /** Beside-score CEFR for english sections only; null elsewhere. */
  cefrLevel: z.enum(CEFR_LEVELS).nullable().optional(),
})
export type SectionScore = z.infer<typeof sectionScoreSchema>

export const englishReportSchema = z.object({
  sectionId: z.number().int().positive(),
  sectionTitle: z.string(),
  overallCefr: z.enum(CEFR_OVERALL_LEVELS).nullable(),
  perSkill: z.object({
    listening: z.object({ score_100: z.number(), cefr: z.string() }).nullable(),
    speaking: z.object({ score_100: z.number(), cefr: z.string() }).nullable(),
    reading: z.object({ score_100: z.number(), cefr: z.string() }).nullable(),
    writing: z.object({ score_100: z.number(), cefr: z.string() }).nullable(),
  }),
  performanceDimensions: z.object({
    structure: z.number(),
    substance: z.number(),
    style: z.number(),
  }),
  targetVsActual: z
    .object({
      mode: z.enum(['adaptive', 'targeted']),
      target: z.enum(CEFR_LEVELS).nullable(),
      actual: z.enum(CEFR_OVERALL_LEVELS).nullable(),
      deltaLevels: z.number(),
    })
    .nullable()
    .optional(),
})
export type EnglishReport = z.infer<typeof englishReportSchema>

export const interviewReportSchema = z.object({
  sectionId: z.number().int().positive(),
  sectionTitle: z.string(),
  transcriptUrl: z.string().nullable(),
  audioRecordingUrl: z.string().nullable(),
  narrativeSummary: z.string().nullable(),
  themesObserved: z.array(z.string()).nullable(),
  keyStrength: z.string().nullable(),
  keyGrowthArea: z.string().nullable(),
  durationMinutes: z.number().int().nullable(),
  questionsAsked: z.number().int().nullable(),
  endedReason: z.string().nullable(),
})
export type InterviewReport = z.infer<typeof interviewReportSchema>

export const swoiSchema = z.object({
  strengths: z.array(z.string()).max(5),
  weaknesses: z.array(z.string()).max(5),
  opportunities: z.array(z.string()).max(5),
  improvements: z.array(z.string()).max(5),
})
export type Swoi = z.infer<typeof swoiSchema>

export const communicationAxesSchema = z.object({
  fluency: z.number().min(0).max(100).nullable(),
  pronunciation: z.number().min(0).max(100).nullable(),
  vocabulary: z.number().min(0).max(100).nullable(),
  grammar: z.number().min(0).max(100).nullable(),
  comprehension: z.number().min(0).max(100).nullable(),
})
export type CommunicationAxes = z.infer<typeof communicationAxesSchema>

export const proctoringReportSchema = z.object({
  summary: z.string(),
  countsByType: z.record(z.number()),
  countsBySeverity: z.object({
    info: z.number(),
    warning: z.number(),
    violation: z.number(),
  }),
  disqualifyEvent: z
    .object({
      reason: z.string(),
      occurredAt: z.string(),
      strikeCount: z.number(),
    })
    .nullable(),
  highlightEvents: z.array(
    z.object({
      eventType: z.string(),
      severity: z.string(),
      occurredAt: z.string(),
    }),
  ),
})
export type ProctoringReport = z.infer<typeof proctoringReportSchema>

export const attemptReportSchema = z.object({
  attemptId: z.number().int().positive(),
  status: z.enum(['grading', 'ready', 'failed']),
  verdict: z.enum(['qualified', 'needs_improvement', 'not_recommended']).nullable(),
  summary: z.string().nullable(),
  generatedAt: z.string().nullable(),
  candidatePhotoUrl: z.string().nullable(),
  sectionScores: z.array(sectionScoreSchema),
  englishReport: englishReportSchema.nullable(),
  interviewReport: interviewReportSchema.nullable(),
  swoi: swoiSchema.nullable(),
  communicationAxes: communicationAxesSchema.nullable(),
  proctoring: proctoringReportSchema.nullable(),
  // R10 WA-3 — surface for the reset-attempt CTA gating on the report screen.
  disqualified: z.boolean(),
  disqualifiedReason: z.string().nullable(),
  tabExitStrikeCount: z.number().int().nonnegative(),
})
export type AttemptReportResponse = z.infer<typeof attemptReportSchema>

// ---------------------------------------------------------------------------
// Show-Answers shape — R10 WA-4 BATCH 3
// ---------------------------------------------------------------------------

export const showAnswerQuestionSchema = z.object({
  questionId: z.number().int().positive(),
  questionType: z.string(),
  stem: z.string(),
  candidateAnswer: z.unknown().nullable(),
  modelAnswer: z.unknown().optional(),
  score: z.number().nullable(),
  maxScore: z.number().nullable(),
  feedback: z.string().nullable(),
})
export type ShowAnswerQuestion = z.infer<typeof showAnswerQuestionSchema>

export const showAnswerSectionSchema = z.object({
  sectionId: z.number().int().positive(),
  /** Admin-set display_name; falls back to title when null. */
  title: z.string(),
  moduleCode: z.string(),
  isInterview: z.boolean(),
  questions: z.array(showAnswerQuestionSchema),
  transcriptInline: z
    .array(
      z.object({
        role: z.enum(['ai', 'candidate']),
        text: z.string(),
        ts: z.string().optional(),
      }),
    )
    .optional(),
})
export type ShowAnswerSection = z.infer<typeof showAnswerSectionSchema>

export const showAnswersResponseSchema = z.object({
  attemptId: z.number().int().positive(),
  sections: z.array(showAnswerSectionSchema),
})
export type ShowAnswersResponse = z.infer<typeof showAnswersResponseSchema>

// ---------------------------------------------------------------------------
// Back-compat — pre-R10 placeholder retained so legacy FE consumers don't
// break during the staged swap. Will be removed in a follow-up clean-up
// commit once B confirms zero remaining consumers.
// ---------------------------------------------------------------------------

export const PerSectionAnalysisEntry = z.object({
  sectionId: z.number().int().positive(),
  sectionModuleCode: z.string(),
  moduleCode: z.string(),
  analysis: z.unknown().nullable(),
  error: z.string().optional(),
})
export type PerSectionAnalysisEntry = z.infer<typeof PerSectionAnalysisEntry>
