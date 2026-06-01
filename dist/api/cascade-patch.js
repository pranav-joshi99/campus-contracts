/**
 * PATCH /api/v2/attempts/:attemptId/interview/sessions/:sessionId
 *
 * Orchestrator writeback hook (Window D producer, Window A consumer).
 * Sends end-of-session state to platform-api; the cascade fires when
 * `endedAt` OR `endedReason` is in the body. Reference: ROUND_8_COMMS
 * 2026-05-30 20:25 IST entry for the full contract spec; this file is
 * the centralised version.
 *
 * Pulled verbatim at platform-api SHA 58230e1 (Round 8.2 final). Round 9
 * report endpoint extension (work area 3) will add fields here; lands
 * via the WA-3 proposal in COMMS.
 */
import { z } from 'zod';
import { PersistedEndReason } from '../enums/end-reason.js';
export const InterviewSessionPatchBody = z
    .object({
    audioRecordingUrl: z.string().url().max(2048).optional(),
    endedAt: z.coerce.date().optional(),
    endedReason: PersistedEndReason.optional(),
    endedReasonDetail: z.string().max(2048).optional(),
    transcript: z.unknown().optional(),
    questionsAsked: z.number().int().min(0).max(500).optional(),
    durationMinutes: z.number().int().min(1).max(180).optional(),
    maxQuestionsCap: z.number().int().min(1).max(200).optional(),
    tamperingAttempts: z.number().int().min(0).max(10_000).optional(),
})
    .strict();
export const InterviewSessionPatchCascade = z.object({
    /**
     * Section_attempts row flipped to 'submitted' on THIS call (false if
     * already submitted — idempotent on retry).
     */
    sectionAttemptFlipped: z.boolean(),
    /**
     * Every section_attempts row for this attempt is now 'submitted' —
     * trigger for the verdict + report pipeline.
     */
    allSectionsDone: z.boolean(),
    /**
     * `generateAttemptReport` kicked off in background. Today === allSectionsDone;
     * future-proof field name so report-trigger can decouple from
     * "all sections done" (e.g. proctoring not-yet-cleared).
     */
    reportTriggered: z.boolean(),
});
export const InterviewSessionPatchResponse = z.object({
    id: z.number().int().positive(),
    attemptId: z.number().int().positive(),
    sectionAttemptId: z.number().int().positive(),
    interviewType: z.enum(['technical', 'english_speaking']).nullable(),
    audioRecordingUrl: z.string().nullable(),
    endedAt: z.string().nullable(), // ISO-8601 string
    endedReason: PersistedEndReason.nullable(),
    durationMinutes: z.number().int().nullable(),
    maxQuestionsCap: z.number().int().nullable(),
    questionsAsked: z.number().int().nullable(),
    tamperingAttempts: z.number().int(),
    cascade: InterviewSessionPatchCascade,
});
