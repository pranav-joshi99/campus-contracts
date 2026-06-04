/**
 * Proctoring + attempt-level disqualify / reset DTOs — R10 BATCH 2.
 *
 * Locked at R10 mega dispatch:
 *   - Single ingest path: POST /api/v2/proctoring/events on platform-api
 *     (A's counter to D's testenv-side route). One auth gate, one writer.
 *   - 20-value event taxonomy (phase2a 15 + R10 4 + face_match_fail).
 *   - Disqualify state lives on assessment_attempts, NOT on
 *     interview_sessions.ended_reason (D-Q5 lock).
 *   - Disqualify is idempotent — re-fires (e.g. WS reconnect) get 409 with
 *     the same terminal-state body.
 *   - Reset Attempt is admin + assessor (assessors can recover candidates
 *     too); audit-logged; idempotent.
 */
import { z } from 'zod';
export const PROCTORING_EVENT_TYPES = [
    'tab_switch',
    'window_blur',
    'window_focus',
    'fullscreen_exit',
    'copy',
    'cut',
    'paste',
    'devtools_open',
    'multi_screen',
    'right_click',
    'face_check',
    'no_face',
    'multi_face',
    'multi_voice',
    'camera_lost',
    'face_service_degraded',
    'face_match_fail',
    'bg_noise',
    'tab_exit_warning_shown',
    'tab_exit_strike',
];
export const proctoringEventTypeSchema = z.enum(PROCTORING_EVENT_TYPES);
export const PROCTORING_SEVERITIES = ['info', 'warning', 'violation'];
export const proctoringSeveritySchema = z.enum(PROCTORING_SEVERITIES);
export const proctoringEventSchema = z
    .object({
    eventType: proctoringEventTypeSchema,
    severity: proctoringSeveritySchema,
    /** ISO-8601 UTC. */
    occurredAt: z.string().datetime(),
    // 2-arg form — Zod 4 removed the 1-arg overload; this shape works in both
    // Zod 3 and 4 so campus-frontend (Zod 4) and platform-api (Zod 3) agree.
    detailJson: z.record(z.string(), z.unknown()).optional(),
    evidenceBlobPath: z.string().max(512).optional(),
})
    .strict();
export const proctoringBatchSchema = z
    .object({
    attemptId: z.number().int().positive(),
    events: z.array(proctoringEventSchema).max(1000),
})
    .strict();
/** Response from POST /api/v2/proctoring/events. */
export const proctoringBatchResponseSchema = z.object({
    accepted: z.number().int().nonnegative(),
    persisted: z.number().int().nonnegative(),
});
// ---------------------------------------------------------------------------
// Disqualify endpoint — POST /api/v2/take/:assessmentId/disqualify
// ---------------------------------------------------------------------------
export const DISQUALIFY_REASONS = [
    'tab_exit_third_strike',
    'face_mismatch_persistent',
];
export const disqualifyRequestSchema = z
    .object({
    reason: z.enum(DISQUALIFY_REASONS),
    occurredAt: z.string().datetime(),
    strikeCount: z.number().int().positive().optional(),
    /** Optional FK into proctoring_events for cross-reference. */
    finalEventId: z.number().int().positive().optional(),
})
    .strict();
export const disqualifyResponseSchema = z.object({
    disqualified: z.literal(true),
    terminal: z.literal(true),
});
// ---------------------------------------------------------------------------
// Reset-attempt endpoint — POST /api/v2/attempts/:attemptId/reset
// ---------------------------------------------------------------------------
export const resetAttemptRequestSchema = z
    .object({
    /** Free-text rationale, audit-logged. */
    notes: z.string().max(1024).optional(),
})
    .strict();
export const resetAttemptResponseSchema = z.object({
    attemptId: z.number().int().positive(),
    status: z.string(),
    disqualified: z.boolean(),
    tabExitStrikeCount: z.number().int().nonnegative(),
});
