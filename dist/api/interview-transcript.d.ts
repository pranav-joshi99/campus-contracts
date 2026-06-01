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
import { z } from 'zod';
export declare const InterviewTurn: z.ZodObject<{
    role: z.ZodEnum<["agent", "candidate", "system"]>;
    text: z.ZodString;
    ts: z.ZodNullable<z.ZodString>;
    prev_answer_score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    question_intent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    text: string;
    role: "agent" | "candidate" | "system";
    ts: string | null;
    prev_answer_score?: number | null | undefined;
    question_intent?: string | null | undefined;
}, {
    text: string;
    role: "agent" | "candidate" | "system";
    ts: string | null;
    prev_answer_score?: number | null | undefined;
    question_intent?: string | null | undefined;
}>;
export type InterviewTurn = z.infer<typeof InterviewTurn>;
export declare const InterviewSessionDTO: z.ZodObject<{
    id: z.ZodNumber;
    interviewType: z.ZodNullable<z.ZodEnum<["technical", "english_speaking"]>>;
    startedAt: z.ZodNullable<z.ZodString>;
    endedAt: z.ZodNullable<z.ZodString>;
    endedReason: z.ZodNullable<z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "timer", "cap", "end_button", "verbal", "end_flag", "cap_reached", "time_up", "verbal_end", "tampering"]>>;
    /** Free-text detail field; assessor variant includes this. */
    endedReasonDetail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    durationMinutes: z.ZodNullable<z.ZodNumber>;
    maxQuestionsCap: z.ZodNullable<z.ZodNumber>;
    questionsAsked: z.ZodNullable<z.ZodNumber>;
    audioRecordingUrl: z.ZodNullable<z.ZodString>;
    /** Assessor variant only — not exposed to candidates. */
    tamperingAttempts: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    audioRecordingUrl: string | null;
    endedAt: string | null;
    endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    id: number;
    interviewType: "technical" | "english_speaking" | null;
    startedAt: string | null;
    endedReasonDetail?: string | null | undefined;
    tamperingAttempts?: number | undefined;
}, {
    audioRecordingUrl: string | null;
    endedAt: string | null;
    endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    maxQuestionsCap: number | null;
    id: number;
    interviewType: "technical" | "english_speaking" | null;
    startedAt: string | null;
    endedReasonDetail?: string | null | undefined;
    tamperingAttempts?: number | undefined;
}>;
export type InterviewSessionDTO = z.infer<typeof InterviewSessionDTO>;
export declare const InterviewTranscriptResponse: z.ZodObject<{
    turns: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["agent", "candidate", "system"]>;
        text: z.ZodString;
        ts: z.ZodNullable<z.ZodString>;
        prev_answer_score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        question_intent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        role: "agent" | "candidate" | "system";
        ts: string | null;
        prev_answer_score?: number | null | undefined;
        question_intent?: string | null | undefined;
    }, {
        text: string;
        role: "agent" | "candidate" | "system";
        ts: string | null;
        prev_answer_score?: number | null | undefined;
        question_intent?: string | null | undefined;
    }>, "many">;
    sessions: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        interviewType: z.ZodNullable<z.ZodEnum<["technical", "english_speaking"]>>;
        startedAt: z.ZodNullable<z.ZodString>;
        endedAt: z.ZodNullable<z.ZodString>;
        endedReason: z.ZodNullable<z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "timer", "cap", "end_button", "verbal", "end_flag", "cap_reached", "time_up", "verbal_end", "tampering"]>>;
        /** Free-text detail field; assessor variant includes this. */
        endedReasonDetail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        durationMinutes: z.ZodNullable<z.ZodNumber>;
        maxQuestionsCap: z.ZodNullable<z.ZodNumber>;
        questionsAsked: z.ZodNullable<z.ZodNumber>;
        audioRecordingUrl: z.ZodNullable<z.ZodString>;
        /** Assessor variant only — not exposed to candidates. */
        tamperingAttempts: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        audioRecordingUrl: string | null;
        endedAt: string | null;
        endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        maxQuestionsCap: number | null;
        id: number;
        interviewType: "technical" | "english_speaking" | null;
        startedAt: string | null;
        endedReasonDetail?: string | null | undefined;
        tamperingAttempts?: number | undefined;
    }, {
        audioRecordingUrl: string | null;
        endedAt: string | null;
        endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        maxQuestionsCap: number | null;
        id: number;
        interviewType: "technical" | "english_speaking" | null;
        startedAt: string | null;
        endedReasonDetail?: string | null | undefined;
        tamperingAttempts?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    turns: {
        text: string;
        role: "agent" | "candidate" | "system";
        ts: string | null;
        prev_answer_score?: number | null | undefined;
        question_intent?: string | null | undefined;
    }[];
    sessions: {
        audioRecordingUrl: string | null;
        endedAt: string | null;
        endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        maxQuestionsCap: number | null;
        id: number;
        interviewType: "technical" | "english_speaking" | null;
        startedAt: string | null;
        endedReasonDetail?: string | null | undefined;
        tamperingAttempts?: number | undefined;
    }[];
}, {
    turns: {
        text: string;
        role: "agent" | "candidate" | "system";
        ts: string | null;
        prev_answer_score?: number | null | undefined;
        question_intent?: string | null | undefined;
    }[];
    sessions: {
        audioRecordingUrl: string | null;
        endedAt: string | null;
        endedReason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end" | "timer" | "cap" | "verbal" | "end_flag" | "tampering" | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        maxQuestionsCap: number | null;
        id: number;
        interviewType: "technical" | "english_speaking" | null;
        startedAt: string | null;
        endedReasonDetail?: string | null | undefined;
        tamperingAttempts?: number | undefined;
    }[];
}>;
export type InterviewTranscriptResponse = z.infer<typeof InterviewTranscriptResponse>;
