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
export declare const InterviewSessionPatchBody: z.ZodObject<{
    audioRecordingUrl: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodDate>;
    endedReason: z.ZodOptional<z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "timer", "cap", "end_button", "verbal", "end_flag", "cap_reached", "time_up", "verbal_end", "tampering"]>>;
    endedReasonDetail: z.ZodOptional<z.ZodString>;
    transcript: z.ZodOptional<z.ZodUnknown>;
    questionsAsked: z.ZodOptional<z.ZodNumber>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    maxQuestionsCap: z.ZodOptional<z.ZodNumber>;
    tamperingAttempts: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    audioRecordingUrl?: string | undefined;
    endedAt?: Date | undefined;
    endedReason?: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | undefined;
    endedReasonDetail?: string | undefined;
    transcript?: unknown;
    questionsAsked?: number | undefined;
    durationMinutes?: number | undefined;
    maxQuestionsCap?: number | undefined;
    tamperingAttempts?: number | undefined;
}, {
    audioRecordingUrl?: string | undefined;
    endedAt?: Date | undefined;
    endedReason?: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | undefined;
    endedReasonDetail?: string | undefined;
    transcript?: unknown;
    questionsAsked?: number | undefined;
    durationMinutes?: number | undefined;
    maxQuestionsCap?: number | undefined;
    tamperingAttempts?: number | undefined;
}>;
export type InterviewSessionPatchBody = z.infer<typeof InterviewSessionPatchBody>;
export declare const InterviewSessionPatchCascade: z.ZodObject<{
    /**
     * Section_attempts row flipped to 'submitted' on THIS call (false if
     * already submitted — idempotent on retry).
     */
    sectionAttemptFlipped: z.ZodBoolean;
    /**
     * Every section_attempts row for this attempt is now 'submitted' —
     * trigger for the verdict + report pipeline.
     */
    allSectionsDone: z.ZodBoolean;
    /**
     * `generateAttemptReport` kicked off in background. Today === allSectionsDone;
     * future-proof field name so report-trigger can decouple from
     * "all sections done" (e.g. proctoring not-yet-cleared).
     */
    reportTriggered: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    sectionAttemptFlipped: boolean;
    allSectionsDone: boolean;
    reportTriggered: boolean;
}, {
    sectionAttemptFlipped: boolean;
    allSectionsDone: boolean;
    reportTriggered: boolean;
}>;
export type InterviewSessionPatchCascade = z.infer<typeof InterviewSessionPatchCascade>;
export declare const InterviewSessionPatchResponse: z.ZodObject<{
    id: z.ZodNumber;
    attemptId: z.ZodNumber;
    sectionAttemptId: z.ZodNumber;
    interviewType: z.ZodNullable<z.ZodEnum<["technical", "english_speaking"]>>;
    audioRecordingUrl: z.ZodNullable<z.ZodString>;
    endedAt: z.ZodNullable<z.ZodString>;
    endedReason: z.ZodNullable<z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "timer", "cap", "end_button", "verbal", "end_flag", "cap_reached", "time_up", "verbal_end", "tampering"]>>;
    durationMinutes: z.ZodNullable<z.ZodNumber>;
    maxQuestionsCap: z.ZodNullable<z.ZodNumber>;
    questionsAsked: z.ZodNullable<z.ZodNumber>;
    tamperingAttempts: z.ZodNumber;
    cascade: z.ZodObject<{
        /**
         * Section_attempts row flipped to 'submitted' on THIS call (false if
         * already submitted — idempotent on retry).
         */
        sectionAttemptFlipped: z.ZodBoolean;
        /**
         * Every section_attempts row for this attempt is now 'submitted' —
         * trigger for the verdict + report pipeline.
         */
        allSectionsDone: z.ZodBoolean;
        /**
         * `generateAttemptReport` kicked off in background. Today === allSectionsDone;
         * future-proof field name so report-trigger can decouple from
         * "all sections done" (e.g. proctoring not-yet-cleared).
         */
        reportTriggered: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        sectionAttemptFlipped: boolean;
        allSectionsDone: boolean;
        reportTriggered: boolean;
    }, {
        sectionAttemptFlipped: boolean;
        allSectionsDone: boolean;
        reportTriggered: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    audioRecordingUrl: string | null;
    endedAt: string | null;
    endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    tamperingAttempts: number;
    id: number;
    attemptId: number;
    sectionAttemptId: number;
    interviewType: "technical" | "english_speaking" | null;
    cascade: {
        sectionAttemptFlipped: boolean;
        allSectionsDone: boolean;
        reportTriggered: boolean;
    };
}, {
    audioRecordingUrl: string | null;
    endedAt: string | null;
    endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    tamperingAttempts: number;
    id: number;
    attemptId: number;
    sectionAttemptId: number;
    interviewType: "technical" | "english_speaking" | null;
    cascade: {
        sectionAttemptFlipped: boolean;
        allSectionsDone: boolean;
        reportTriggered: boolean;
    };
}>;
export type InterviewSessionPatchResponse = z.infer<typeof InterviewSessionPatchResponse>;
