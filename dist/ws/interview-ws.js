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
// ---------------------------------------------------------------------------
// Server → Client
// ---------------------------------------------------------------------------
export const AgentSpeechStart = z.object({
    type: z.literal('agent_speech_start'),
    text: z.string(),
});
export const AgentAudioChunk = z.object({
    type: z.literal('agent_audio_chunk'),
    data: z.string(), // base64
});
export const AgentSpeechEnd = z.object({
    type: z.literal('agent_speech_end'),
    interrupted: z.boolean().optional(),
});
export const TranscriptUpdate = z.object({
    type: z.literal('transcript_update'),
    role: z.enum(['agent', 'candidate']),
    text: z.string(),
    isFinal: z.boolean(),
});
export const QuestionProgress = z.object({
    type: z.literal('question_progress'),
    current: z.number().int().nonnegative(),
    total: z.number().int().positive(),
});
/**
 * Round 8 vocabulary on the WS surface. The PERSISTED enum (platform-api
 * interview_sessions.ended_reason at Round 8.1) is a superset:
 *   'completed' | 'candidate_terminated' | 'timeout' | 'technical_failure'
 *   | 'timer' | 'cap' | 'end_button' | 'verbal' | 'end_flag'
 *   | 'cap_reached' | 'time_up' | 'verbal_end' | 'tampering'
 * Window D's mapBotEndReasonToOrchestratorEndReason bridges any drift.
 * Round 9 Interview Brain v2 may align these unions — flagged in COMMS.
 */
export const InterviewEnded = z.object({
    type: z.literal('interview_ended'),
    reason: z.enum([
        'completed',
        'candidate_terminated',
        'timeout',
        'technical_failure',
        'time_up',
        'cap_reached',
        'end_button',
        'verbal_end',
    ]),
});
export const WsError = z.object({
    type: z.literal('error'),
    code: z.string(),
    message: z.string(),
});
/**
 * On-screen attachment shown alongside the interviewer's utterance when the
 * blueprint stage references code / math / an image (master brief: "render
 * visually, bot does NOT TTS-read content").
 */
const CodeAttachment = z.object({
    kind: z.literal('code'),
    language: z.string().min(1),
    source: z.string(),
});
const MathAttachment = z.object({
    kind: z.literal('math'),
    latex: z.string().min(1),
    /** When true, render in block / display mode rather than inline. */
    block: z.boolean().optional(),
});
const ImageAttachment = z.object({
    kind: z.literal('image'),
    url: z.string().min(1),
    alt: z.string().optional(),
});
export const QuestionAttachment = z.discriminatedUnion('kind', [
    CodeAttachment,
    MathAttachment,
    ImageAttachment,
]);
export const QuestionDisplay = z.object({
    type: z.literal('question_display'),
    /** Server-generated id so consumers can React-key on it. Optional. */
    questionId: z.string().optional(),
    attachment: QuestionAttachment,
});
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
export const MicGate = z.object({
    type: z.literal('mic_gate'),
    state: z.enum(['open', 'closed']),
});
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
export const WelcomeReady = z.object({
    type: z.literal('welcome_ready'),
    welcomeAudioUrl: z.string().url(),
    branchA_audioUrl: z.string().url().optional(),
    branchB_audioUrl: z.string().url(),
    speakingTestPresent: z.boolean(),
    /**
     * Round 8.2 — verbatim text the FE renders into the chat panel.
     * Server-side candidate-name substitution already applied (welcome
     * only — branch texts are name-agnostic).
     */
    welcomeText: z.string().min(1),
    branchAText: z.string().min(1).optional(),
    branchBText: z.string().min(1),
});
export const ServerMessage = z.discriminatedUnion('type', [
    AgentSpeechStart,
    AgentAudioChunk,
    AgentSpeechEnd,
    TranscriptUpdate,
    QuestionProgress,
    InterviewEnded,
    WsError,
    QuestionDisplay,
    MicGate,
    WelcomeReady,
]);
// ---------------------------------------------------------------------------
// Client → Server
// ---------------------------------------------------------------------------
export const CandidateAudioChunk = z.object({
    type: z.literal('candidate_audio_chunk'),
    data: z.string(), // base64
});
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
export const CandidateSpeechEnd = z.object({
    type: z.literal('candidate_speech_end'),
    /** True when the candidate pressed End Interview before pressing space. */
    interview_end_flag: z.boolean().optional(),
    /** Free-text reason from the end-button modal (max 500 chars). */
    end_reason: z.string().max(500).optional(),
});
/**
 * Round 8 — FE signals welcome+intro phase complete (candidate finished
 * introducing themselves and pressed space). Carries the intro transcript
 * as the first candidate utterance.
 */
export const WelcomeComplete = z.object({
    type: z.literal('welcome_complete'),
    introTranscript: z.string(),
});
export const CandidateEndedInterview = z.object({
    type: z.literal('candidate_ended_interview'),
    reason: z.string().max(500).optional(),
});
export const Reconnect = z.object({
    type: z.literal('reconnect'),
    lastTurnIndex: z.number().int().nonnegative(),
});
export const ClientMessage = z.discriminatedUnion('type', [
    CandidateAudioChunk,
    CandidateSpeechEnd,
    CandidateEndedInterview,
    Reconnect,
    WelcomeComplete,
]);
export function parseClientMessage(raw) {
    let json;
    try {
        json = JSON.parse(raw);
    }
    catch {
        return { ok: false, error: 'invalid JSON' };
    }
    const result = ClientMessage.safeParse(json);
    if (!result.success) {
        return { ok: false, error: result.error.issues.map((i) => i.message).join('; ') };
    }
    return { ok: true, value: result.data };
}
export function parseServerMessage(raw) {
    let json;
    try {
        json = JSON.parse(raw);
    }
    catch {
        return { ok: false, error: 'invalid JSON' };
    }
    const result = ServerMessage.safeParse(json);
    if (!result.success) {
        return { ok: false, error: result.error.issues.map((i) => i.message).join('; ') };
    }
    return { ok: true, value: result.data };
}
/** Close-code conventions for the Interview WS. */
export const WS_CLOSE = {
    /** Normal: interview ended cleanly. */
    NORMAL: 1000,
    /** Policy violation: bad auth / bad tenant / bad path. RFC 6455 §7.4.1. */
    POLICY_VIOLATION: 1008,
    /** Server error: unexpected failure. */
    INTERNAL_ERROR: 1011,
    /** App-level: idle / heartbeat timeout. */
    HEARTBEAT_TIMEOUT: 4000,
    /** App-level: token replayed (single-use violation). */
    TOKEN_REPLAY: 4001,
};
