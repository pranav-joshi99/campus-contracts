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
export declare const PROCTORING_EVENT_TYPES: readonly ["tab_switch", "window_blur", "window_focus", "fullscreen_exit", "copy", "cut", "paste", "devtools_open", "multi_screen", "right_click", "face_check", "no_face", "multi_face", "multi_voice", "camera_lost", "face_service_degraded", "face_match_fail", "bg_noise", "tab_exit_warning_shown", "tab_exit_strike"];
export type ProctoringEventType = (typeof PROCTORING_EVENT_TYPES)[number];
export declare const proctoringEventTypeSchema: z.ZodEnum<["tab_switch", "window_blur", "window_focus", "fullscreen_exit", "copy", "cut", "paste", "devtools_open", "multi_screen", "right_click", "face_check", "no_face", "multi_face", "multi_voice", "camera_lost", "face_service_degraded", "face_match_fail", "bg_noise", "tab_exit_warning_shown", "tab_exit_strike"]>;
export declare const PROCTORING_SEVERITIES: readonly ["info", "warning", "violation"];
export type ProctoringSeverity = (typeof PROCTORING_SEVERITIES)[number];
export declare const proctoringSeveritySchema: z.ZodEnum<["info", "warning", "violation"]>;
export declare const proctoringEventSchema: z.ZodObject<{
    eventType: z.ZodEnum<["tab_switch", "window_blur", "window_focus", "fullscreen_exit", "copy", "cut", "paste", "devtools_open", "multi_screen", "right_click", "face_check", "no_face", "multi_face", "multi_voice", "camera_lost", "face_service_degraded", "face_match_fail", "bg_noise", "tab_exit_warning_shown", "tab_exit_strike"]>;
    severity: z.ZodEnum<["info", "warning", "violation"]>;
    /** ISO-8601 UTC. */
    occurredAt: z.ZodString;
    detailJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    evidenceBlobPath: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
    severity: "info" | "warning" | "violation";
    occurredAt: string;
    detailJson?: Record<string, unknown> | undefined;
    evidenceBlobPath?: string | undefined;
}, {
    eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
    severity: "info" | "warning" | "violation";
    occurredAt: string;
    detailJson?: Record<string, unknown> | undefined;
    evidenceBlobPath?: string | undefined;
}>;
export type ProctoringEventDto = z.infer<typeof proctoringEventSchema>;
export declare const proctoringBatchSchema: z.ZodObject<{
    attemptId: z.ZodNumber;
    events: z.ZodArray<z.ZodObject<{
        eventType: z.ZodEnum<["tab_switch", "window_blur", "window_focus", "fullscreen_exit", "copy", "cut", "paste", "devtools_open", "multi_screen", "right_click", "face_check", "no_face", "multi_face", "multi_voice", "camera_lost", "face_service_degraded", "face_match_fail", "bg_noise", "tab_exit_warning_shown", "tab_exit_strike"]>;
        severity: z.ZodEnum<["info", "warning", "violation"]>;
        /** ISO-8601 UTC. */
        occurredAt: z.ZodString;
        detailJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        evidenceBlobPath: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
        severity: "info" | "warning" | "violation";
        occurredAt: string;
        detailJson?: Record<string, unknown> | undefined;
        evidenceBlobPath?: string | undefined;
    }, {
        eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
        severity: "info" | "warning" | "violation";
        occurredAt: string;
        detailJson?: Record<string, unknown> | undefined;
        evidenceBlobPath?: string | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    attemptId: number;
    events: {
        eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
        severity: "info" | "warning" | "violation";
        occurredAt: string;
        detailJson?: Record<string, unknown> | undefined;
        evidenceBlobPath?: string | undefined;
    }[];
}, {
    attemptId: number;
    events: {
        eventType: "tab_switch" | "window_blur" | "window_focus" | "fullscreen_exit" | "copy" | "cut" | "paste" | "devtools_open" | "multi_screen" | "right_click" | "face_check" | "no_face" | "multi_face" | "multi_voice" | "camera_lost" | "face_service_degraded" | "face_match_fail" | "bg_noise" | "tab_exit_warning_shown" | "tab_exit_strike";
        severity: "info" | "warning" | "violation";
        occurredAt: string;
        detailJson?: Record<string, unknown> | undefined;
        evidenceBlobPath?: string | undefined;
    }[];
}>;
export type ProctoringBatch = z.infer<typeof proctoringBatchSchema>;
/** Response from POST /api/v2/proctoring/events. */
export declare const proctoringBatchResponseSchema: z.ZodObject<{
    accepted: z.ZodNumber;
    persisted: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    accepted: number;
    persisted: number;
}, {
    accepted: number;
    persisted: number;
}>;
export type ProctoringBatchResponse = z.infer<typeof proctoringBatchResponseSchema>;
export declare const DISQUALIFY_REASONS: readonly ["tab_exit_third_strike", "face_mismatch_persistent"];
export type DisqualifyReason = (typeof DISQUALIFY_REASONS)[number];
export declare const disqualifyRequestSchema: z.ZodObject<{
    reason: z.ZodEnum<["tab_exit_third_strike", "face_mismatch_persistent"]>;
    occurredAt: z.ZodString;
    strikeCount: z.ZodOptional<z.ZodNumber>;
    /** Optional FK into proctoring_events for cross-reference. */
    finalEventId: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    reason: "tab_exit_third_strike" | "face_mismatch_persistent";
    occurredAt: string;
    strikeCount?: number | undefined;
    finalEventId?: number | undefined;
}, {
    reason: "tab_exit_third_strike" | "face_mismatch_persistent";
    occurredAt: string;
    strikeCount?: number | undefined;
    finalEventId?: number | undefined;
}>;
export type DisqualifyRequest = z.infer<typeof disqualifyRequestSchema>;
export declare const disqualifyResponseSchema: z.ZodObject<{
    disqualified: z.ZodLiteral<true>;
    terminal: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    disqualified: true;
    terminal: true;
}, {
    disqualified: true;
    terminal: true;
}>;
export type DisqualifyResponse = z.infer<typeof disqualifyResponseSchema>;
export declare const resetAttemptRequestSchema: z.ZodObject<{
    /** Free-text rationale, audit-logged. */
    notes: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    notes?: string | undefined;
}, {
    notes?: string | undefined;
}>;
export type ResetAttemptRequest = z.infer<typeof resetAttemptRequestSchema>;
export declare const resetAttemptResponseSchema: z.ZodObject<{
    attemptId: z.ZodNumber;
    status: z.ZodString;
    disqualified: z.ZodBoolean;
    tabExitStrikeCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: string;
    attemptId: number;
    disqualified: boolean;
    tabExitStrikeCount: number;
}, {
    status: string;
    attemptId: number;
    disqualified: boolean;
    tabExitStrikeCount: number;
}>;
export type ResetAttemptResponse = z.infer<typeof resetAttemptResponseSchema>;
