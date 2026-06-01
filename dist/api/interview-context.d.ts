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
import { z } from 'zod';
export declare const InterviewContextResponse: z.ZodObject<{
    speaking_test_present: z.ZodBoolean;
    durationMinutes: z.ZodNullable<z.ZodNumber>;
    maxQuestionsCap: z.ZodNullable<z.ZodNumber>;
    welcomeText: z.ZodString;
    branchAText: z.ZodString;
    branchBText: z.ZodString;
    candidateName: z.ZodNullable<z.ZodString>;
    candidateFirstName: z.ZodString;
    interviewSectionId: z.ZodNullable<z.ZodNumber>;
    assessmentId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    welcomeText: string;
    branchAText: string;
    branchBText: string;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    speaking_test_present: boolean;
    candidateName: string | null;
    candidateFirstName: string;
    interviewSectionId: number | null;
    assessmentId: number;
}, {
    welcomeText: string;
    branchAText: string;
    branchBText: string;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    speaking_test_present: boolean;
    candidateName: string | null;
    candidateFirstName: string;
    interviewSectionId: number | null;
    assessmentId: number;
}>;
export type InterviewContextResponse = z.infer<typeof InterviewContextResponse>;
