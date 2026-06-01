/**
 * Interview WebSocket protocol — Zod schemas for the wire-level contract
 * between campus-testenv (producer) and campus-frontend (consumer).
 *
 * Round 9 Phase 1 — pulled VERBATIM from campus-testenv/src/contracts/
 * interview-ws.ts at SHA dc3d746 (Round 8.2 final). No behavior change in
 * this commit; centralising the contract so Round 9 evolution lands here
 * first and ships as a single SHA bump on the consumer + producer
 * submodule pointers.
 *
 * Producers: parse on emit. Consumers: parse on receive. Both sides
 * version-pin via the campus-contracts submodule SHA.
 *
 * Round 9 evolution flagged in COMMS (Interview Brain v2 thread):
 *   - InterviewEnded.reason enum will gain 'tampering' / 'end_flag' to
 *     match the persisted ended_reason union (13 values total on the
 *     platform-api side after Round 8.1).
 *   - CandidateSpeechEnd will gain `transcript: string` (Window B
 *     663c56c) once Window D consumes it server-side.
 * Both land via a single ack'd COMMS proposal before any window flips.
 */
import { z } from 'zod';
export declare const AgentSpeechStart: z.ZodObject<{
    type: z.ZodLiteral<"agent_speech_start">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "agent_speech_start";
    text: string;
}, {
    type: "agent_speech_start";
    text: string;
}>;
export type AgentSpeechStart = z.infer<typeof AgentSpeechStart>;
export declare const AgentAudioChunk: z.ZodObject<{
    type: z.ZodLiteral<"agent_audio_chunk">;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "agent_audio_chunk";
    data: string;
}, {
    type: "agent_audio_chunk";
    data: string;
}>;
export type AgentAudioChunk = z.infer<typeof AgentAudioChunk>;
export declare const AgentSpeechEnd: z.ZodObject<{
    type: z.ZodLiteral<"agent_speech_end">;
    interrupted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "agent_speech_end";
    interrupted?: boolean | undefined;
}, {
    type: "agent_speech_end";
    interrupted?: boolean | undefined;
}>;
export type AgentSpeechEnd = z.infer<typeof AgentSpeechEnd>;
export declare const TranscriptUpdate: z.ZodObject<{
    type: z.ZodLiteral<"transcript_update">;
    role: z.ZodEnum<["agent", "candidate"]>;
    text: z.ZodString;
    isFinal: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "transcript_update";
    text: string;
    role: "agent" | "candidate";
    isFinal: boolean;
}, {
    type: "transcript_update";
    text: string;
    role: "agent" | "candidate";
    isFinal: boolean;
}>;
export type TranscriptUpdate = z.infer<typeof TranscriptUpdate>;
export declare const QuestionProgress: z.ZodObject<{
    type: z.ZodLiteral<"question_progress">;
    current: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "question_progress";
    current: number;
    total: number;
}, {
    type: "question_progress";
    current: number;
    total: number;
}>;
export type QuestionProgress = z.infer<typeof QuestionProgress>;
/**
 * Round 8 vocabulary on the WS surface. The PERSISTED enum (platform-api
 * interview_sessions.ended_reason at Round 8.1) is a superset:
 *   'completed' | 'candidate_terminated' | 'timeout' | 'technical_failure'
 *   | 'timer' | 'cap' | 'end_button' | 'verbal' | 'end_flag'
 *   | 'cap_reached' | 'time_up' | 'verbal_end' | 'tampering'
 * Window D's mapBotEndReasonToOrchestratorEndReason bridges any drift.
 * Round 9 Interview Brain v2 may align these unions — flagged in COMMS.
 */
export declare const InterviewEnded: z.ZodObject<{
    type: z.ZodLiteral<"interview_ended">;
    reason: z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "time_up", "cap_reached", "end_button", "verbal_end"]>;
}, "strip", z.ZodTypeAny, {
    type: "interview_ended";
    reason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end";
}, {
    type: "interview_ended";
    reason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end";
}>;
export type InterviewEnded = z.infer<typeof InterviewEnded>;
export declare const WsError: z.ZodObject<{
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "error";
    code: string;
    message: string;
}, {
    type: "error";
    code: string;
    message: string;
}>;
export type WsError = z.infer<typeof WsError>;
export declare const QuestionAttachment: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"code">;
    language: z.ZodString;
    source: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "code";
    language: string;
    source: string;
}, {
    kind: "code";
    language: string;
    source: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"math">;
    latex: z.ZodString;
    /** When true, render in block / display mode rather than inline. */
    block: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    kind: "math";
    latex: string;
    block?: boolean | undefined;
}, {
    kind: "math";
    latex: string;
    block?: boolean | undefined;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"image">;
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kind: "image";
    url: string;
    alt?: string | undefined;
}, {
    kind: "image";
    url: string;
    alt?: string | undefined;
}>]>;
export type QuestionAttachment = z.infer<typeof QuestionAttachment>;
export declare const QuestionDisplay: z.ZodObject<{
    type: z.ZodLiteral<"question_display">;
    /** Server-generated id so consumers can React-key on it. Optional. */
    questionId: z.ZodOptional<z.ZodString>;
    attachment: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"code">;
        language: z.ZodString;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "code";
        language: string;
        source: string;
    }, {
        kind: "code";
        language: string;
        source: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"math">;
        latex: z.ZodString;
        /** When true, render in block / display mode rather than inline. */
        block: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    }, {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"image">;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "image";
        url: string;
        alt?: string | undefined;
    }, {
        kind: "image";
        url: string;
        alt?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    type: "question_display";
    attachment: {
        kind: "code";
        language: string;
        source: string;
    } | {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    } | {
        kind: "image";
        url: string;
        alt?: string | undefined;
    };
    questionId?: string | undefined;
}, {
    type: "question_display";
    attachment: {
        kind: "code";
        language: string;
        source: string;
    } | {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    } | {
        kind: "image";
        url: string;
        alt?: string | undefined;
    };
    questionId?: string | undefined;
}>;
export type QuestionDisplay = z.infer<typeof QuestionDisplay>;
/**
 * Round 8 — mic-split protocol. Fires when the agent's TTS playback starts
 * (state='closed') and ends (state='open'). FE uses this as the
 * authoritative signal for whether the STT pipeline should accept
 * candidate audio. testenv ALSO drops candidate_audio_chunk frames when
 * gate is closed — defensive, so late-arriving FE chunks don't cost
 * Azure STT credits.
 *
 * Round 9 work area 2 ("MIC CUTOFF DURING ZAM SPEECH") promotes this from
 * "soft gate" to "stream stop": FE stops the MediaStreamTrack or suspends
 * the AudioContext during mic_gate='closed', not just gates chunks in
 * software.
 */
export declare const MicGate: z.ZodObject<{
    type: z.ZodLiteral<"mic_gate">;
    state: z.ZodEnum<["open", "closed"]>;
}, "strip", z.ZodTypeAny, {
    type: "mic_gate";
    state: "open" | "closed";
}, {
    type: "mic_gate";
    state: "open" | "closed";
}>;
export type MicGate = z.infer<typeof MicGate>;
/**
 * Round 8 — pre-rendered welcome surfacing. Fires once on WS connect with
 * the SAS URLs for the welcome message and (conditionally) the two
 * post-intro branch audios. FE prefetches and plays the welcome the
 * moment the interview screen renders — zero LLM cold-start, zero
 * orchestrator round-trip.
 *
 * `branchA_audioUrl` is omitted when speaking_test_present is false;
 * `branchB_audioUrl` is always present (covers the threshold-baseline
 * path).
 */
export declare const WelcomeReady: z.ZodObject<{
    type: z.ZodLiteral<"welcome_ready">;
    welcomeAudioUrl: z.ZodString;
    branchA_audioUrl: z.ZodOptional<z.ZodString>;
    branchB_audioUrl: z.ZodString;
    speakingTestPresent: z.ZodBoolean;
    /**
     * Round 8.2 — verbatim text the FE renders into the chat panel.
     * Server-side candidate-name substitution already applied (welcome
     * only — branch texts are name-agnostic).
     */
    welcomeText: z.ZodString;
    branchAText: z.ZodOptional<z.ZodString>;
    branchBText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "welcome_ready";
    welcomeAudioUrl: string;
    branchB_audioUrl: string;
    speakingTestPresent: boolean;
    welcomeText: string;
    branchBText: string;
    branchA_audioUrl?: string | undefined;
    branchAText?: string | undefined;
}, {
    type: "welcome_ready";
    welcomeAudioUrl: string;
    branchB_audioUrl: string;
    speakingTestPresent: boolean;
    welcomeText: string;
    branchBText: string;
    branchA_audioUrl?: string | undefined;
    branchAText?: string | undefined;
}>;
export type WelcomeReady = z.infer<typeof WelcomeReady>;
export declare const ServerMessage: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"agent_speech_start">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "agent_speech_start";
    text: string;
}, {
    type: "agent_speech_start";
    text: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"agent_audio_chunk">;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "agent_audio_chunk";
    data: string;
}, {
    type: "agent_audio_chunk";
    data: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"agent_speech_end">;
    interrupted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "agent_speech_end";
    interrupted?: boolean | undefined;
}, {
    type: "agent_speech_end";
    interrupted?: boolean | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"transcript_update">;
    role: z.ZodEnum<["agent", "candidate"]>;
    text: z.ZodString;
    isFinal: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "transcript_update";
    text: string;
    role: "agent" | "candidate";
    isFinal: boolean;
}, {
    type: "transcript_update";
    text: string;
    role: "agent" | "candidate";
    isFinal: boolean;
}>, z.ZodObject<{
    type: z.ZodLiteral<"question_progress">;
    current: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "question_progress";
    current: number;
    total: number;
}, {
    type: "question_progress";
    current: number;
    total: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"interview_ended">;
    reason: z.ZodEnum<["completed", "candidate_terminated", "timeout", "technical_failure", "time_up", "cap_reached", "end_button", "verbal_end"]>;
}, "strip", z.ZodTypeAny, {
    type: "interview_ended";
    reason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end";
}, {
    type: "interview_ended";
    reason: "completed" | "candidate_terminated" | "timeout" | "technical_failure" | "time_up" | "cap_reached" | "end_button" | "verbal_end";
}>, z.ZodObject<{
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "error";
    code: string;
    message: string;
}, {
    type: "error";
    code: string;
    message: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"question_display">;
    /** Server-generated id so consumers can React-key on it. Optional. */
    questionId: z.ZodOptional<z.ZodString>;
    attachment: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"code">;
        language: z.ZodString;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "code";
        language: string;
        source: string;
    }, {
        kind: "code";
        language: string;
        source: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"math">;
        latex: z.ZodString;
        /** When true, render in block / display mode rather than inline. */
        block: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    }, {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"image">;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kind: "image";
        url: string;
        alt?: string | undefined;
    }, {
        kind: "image";
        url: string;
        alt?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    type: "question_display";
    attachment: {
        kind: "code";
        language: string;
        source: string;
    } | {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    } | {
        kind: "image";
        url: string;
        alt?: string | undefined;
    };
    questionId?: string | undefined;
}, {
    type: "question_display";
    attachment: {
        kind: "code";
        language: string;
        source: string;
    } | {
        kind: "math";
        latex: string;
        block?: boolean | undefined;
    } | {
        kind: "image";
        url: string;
        alt?: string | undefined;
    };
    questionId?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"mic_gate">;
    state: z.ZodEnum<["open", "closed"]>;
}, "strip", z.ZodTypeAny, {
    type: "mic_gate";
    state: "open" | "closed";
}, {
    type: "mic_gate";
    state: "open" | "closed";
}>, z.ZodObject<{
    type: z.ZodLiteral<"welcome_ready">;
    welcomeAudioUrl: z.ZodString;
    branchA_audioUrl: z.ZodOptional<z.ZodString>;
    branchB_audioUrl: z.ZodString;
    speakingTestPresent: z.ZodBoolean;
    /**
     * Round 8.2 — verbatim text the FE renders into the chat panel.
     * Server-side candidate-name substitution already applied (welcome
     * only — branch texts are name-agnostic).
     */
    welcomeText: z.ZodString;
    branchAText: z.ZodOptional<z.ZodString>;
    branchBText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "welcome_ready";
    welcomeAudioUrl: string;
    branchB_audioUrl: string;
    speakingTestPresent: boolean;
    welcomeText: string;
    branchBText: string;
    branchA_audioUrl?: string | undefined;
    branchAText?: string | undefined;
}, {
    type: "welcome_ready";
    welcomeAudioUrl: string;
    branchB_audioUrl: string;
    speakingTestPresent: boolean;
    welcomeText: string;
    branchBText: string;
    branchA_audioUrl?: string | undefined;
    branchAText?: string | undefined;
}>]>;
export type ServerMessage = z.infer<typeof ServerMessage>;
export declare const CandidateAudioChunk: z.ZodObject<{
    type: z.ZodLiteral<"candidate_audio_chunk">;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "candidate_audio_chunk";
    data: string;
}, {
    type: "candidate_audio_chunk";
    data: string;
}>;
export type CandidateAudioChunk = z.infer<typeof CandidateAudioChunk>;
/**
 * Round 8 — carries the end-button / verbal-end flags so the orchestrator
 * can route into the centralised endSession path without a separate frame.
 *
 * Round 9 evolution (Window B 663c56c shipped FE-side, awaiting D's
 * consumer):
 *   `transcript: z.string().optional()` — FE-supplied STT-finalized
 *   text that overrides the STT-derived `latestCandidate`. The dispatch
 *   work area 1e calls this out. The schema in this commit does NOT
 *   include the new field yet — Phase 1 is verbatim-only. Add via the
 *   Interview Brain v2 thread.
 */
export declare const CandidateSpeechEnd: z.ZodObject<{
    type: z.ZodLiteral<"candidate_speech_end">;
    /** True when the candidate pressed End Interview before pressing space. */
    interview_end_flag: z.ZodOptional<z.ZodBoolean>;
    /** Free-text reason from the end-button modal (max 500 chars). */
    end_reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "candidate_speech_end";
    interview_end_flag?: boolean | undefined;
    end_reason?: string | undefined;
}, {
    type: "candidate_speech_end";
    interview_end_flag?: boolean | undefined;
    end_reason?: string | undefined;
}>;
export type CandidateSpeechEnd = z.infer<typeof CandidateSpeechEnd>;
/**
 * Round 8 — FE signals welcome+intro phase complete (candidate finished
 * introducing themselves and pressed space). Carries the intro transcript
 * as the first candidate utterance.
 */
export declare const WelcomeComplete: z.ZodObject<{
    type: z.ZodLiteral<"welcome_complete">;
    introTranscript: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "welcome_complete";
    introTranscript: string;
}, {
    type: "welcome_complete";
    introTranscript: string;
}>;
export type WelcomeComplete = z.infer<typeof WelcomeComplete>;
export declare const CandidateEndedInterview: z.ZodObject<{
    type: z.ZodLiteral<"candidate_ended_interview">;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "candidate_ended_interview";
    reason?: string | undefined;
}, {
    type: "candidate_ended_interview";
    reason?: string | undefined;
}>;
export type CandidateEndedInterview = z.infer<typeof CandidateEndedInterview>;
export declare const Reconnect: z.ZodObject<{
    type: z.ZodLiteral<"reconnect">;
    lastTurnIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "reconnect";
    lastTurnIndex: number;
}, {
    type: "reconnect";
    lastTurnIndex: number;
}>;
export type Reconnect = z.infer<typeof Reconnect>;
export declare const ClientMessage: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"candidate_audio_chunk">;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "candidate_audio_chunk";
    data: string;
}, {
    type: "candidate_audio_chunk";
    data: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"candidate_speech_end">;
    /** True when the candidate pressed End Interview before pressing space. */
    interview_end_flag: z.ZodOptional<z.ZodBoolean>;
    /** Free-text reason from the end-button modal (max 500 chars). */
    end_reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "candidate_speech_end";
    interview_end_flag?: boolean | undefined;
    end_reason?: string | undefined;
}, {
    type: "candidate_speech_end";
    interview_end_flag?: boolean | undefined;
    end_reason?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"candidate_ended_interview">;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "candidate_ended_interview";
    reason?: string | undefined;
}, {
    type: "candidate_ended_interview";
    reason?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"reconnect">;
    lastTurnIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "reconnect";
    lastTurnIndex: number;
}, {
    type: "reconnect";
    lastTurnIndex: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"welcome_complete">;
    introTranscript: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "welcome_complete";
    introTranscript: string;
}, {
    type: "welcome_complete";
    introTranscript: string;
}>]>;
export type ClientMessage = z.infer<typeof ClientMessage>;
export interface ParseResult<T> {
    ok: boolean;
    value?: T;
    error?: string;
}
export declare function parseClientMessage(raw: string): ParseResult<ClientMessage>;
export declare function parseServerMessage(raw: string): ParseResult<ServerMessage>;
/** Close-code conventions for the Interview WS. */
export declare const WS_CLOSE: {
    /** Normal: interview ended cleanly. */
    readonly NORMAL: 1000;
    /** Policy violation: bad auth / bad tenant / bad path. RFC 6455 §7.4.1. */
    readonly POLICY_VIOLATION: 1008;
    /** Server error: unexpected failure. */
    readonly INTERNAL_ERROR: 1011;
    /** App-level: idle / heartbeat timeout. */
    readonly HEARTBEAT_TIMEOUT: 4000;
    /** App-level: token replayed (single-use violation). */
    readonly TOKEN_REPLAY: 4001;
};
