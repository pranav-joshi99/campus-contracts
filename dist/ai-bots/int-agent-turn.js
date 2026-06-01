/**
 * CA_INT_A_AGENT_V1 — Technical Interview voice agent contracts.
 *
 * Round 9 W1 (Interview Brain v2) — INPUT + OUTPUT schemas, locked
 * cross-window by the combined C+D proposal in ROUND_9_COMMS thread
 * 2026-06-01 16:00–16:25 IST (Window D full-ack at 16:25 IST).
 *
 * Producers:
 *   - campus-testenv orchestrator (builds the input envelope each turn)
 * Consumers:
 *   - campus-ai bot (parses input on receive, emits output)
 *   - campus-testenv orchestrator (parses output on receive — drops
 *     legacy should_end / end_reason via unknown-key strip)
 *
 * Round 9 contract changes vs Round 8.2:
 *   - INPUT.sessionInputs.max_questions_cap canonical (Window D sends
 *     floor(durationMinutes / 2)); NUMBER_OF_ADAPTIVE_QUESTIONS kept as
 *     deprecated alias for Round 9 via a Zod .transform() fallback
 *     (Round 10 removes it).
 *   - INPUT.sessionInputs.speaking_test_present added (Round 8.3).
 *   - INPUT.agentSignals.last_topic_focus_area + .consecutive_same_topic_count
 *     added so the bot can apply the ≥2-probes-before-pivot rule
 *     deterministically (orchestrator-tracked, not LLM-inferred — the
 *     bot is stateless and chat history doesn't carry the topic label).
 *   - OUTPUT replaced: REMOVED should_end + end_reason (bot has ZERO
 *     end-decision power per dispatch 1a). REMOVED 'wrap' from
 *     question_intent enum. ADDED prev_answer_ack (1-sentence ack),
 *     topic_focus_area (stable probing-tracker label),
 *     injection_attempted (W1d log signal).
 *
 * End-decisions are D-only post-Round-9: cap_reached / time_up /
 * verbal_end / end_button / technical_failure.
 */
import { z } from 'zod';
/* ----------------------------------------------------------------- */
/* Sub-schemas shared with campus-ai contracts/                       */
/* ----------------------------------------------------------------- */
/**
 * One chat turn as wire-shape — `interview_sessions.transcript[]` mirrors
 * this with a few additional persistence fields (timestamp, prosody).
 * Kept here as the cross-window source-of-truth for the agent envelope.
 */
export const ChatMessage = z.object({
    role: z.enum(['agent', 'candidate']),
    text: z.string(),
});
/**
 * Prosody side-signals (Window 4 / Microsoft Speech SDK derived). All
 * optional on turn 0; bot uses them for sentiment-aware probing.
 */
export const Prosody = z.object({
    long_pauses: z.number().int().nonnegative(),
    tremor: z.number().min(0).max(1),
    filler_rate: z.number().nonnegative(),
});
/**
 * Interview blueprint stage. One row per planned area; the bot adapts
 * loosely off these.
 */
export const InterviewBlueprintStage = z.object({
    stageNumber: z.number().int().positive(),
    assessmentSkill: z.string(),
    areasOfEvaluation: z.string(),
    areaOfQuestioning: z.string(),
    /** Two sample questions per stage. */
    sampleQuestions: z.array(z.string()).length(2),
    reasoning: z.string(),
});
/* ----------------------------------------------------------------- */
/* Per-turn live signals (Round 9 W1c additions)                      */
/* ----------------------------------------------------------------- */
/**
 * Per-turn signals appended to the user message footer by the agent
 * runner. Round 8 introduced turn_count + time_remaining_sec; Round 9
 * adds last_topic_focus_area + consecutive_same_topic_count so the bot
 * can apply the "≥2 follow-ups before pivot" probing rule
 * deterministically (orchestrator-tracked, not LLM-inferred — the bot
 * is stateless and chat history doesn't carry the topic label).
 *
 * D maintains both new fields via per-session state and sends them
 * BEFORE each runAgentTurn call so the bot's prompt rule can react
 * on this turn's output.
 */
export const AgentSignals = z.object({
    /** Number of substantive bot turns ALREADY taken (NOT including welcome). */
    turn_count: z.number().int().nonnegative(),
    /** Wall-clock seconds remaining in the interview window. */
    time_remaining_sec: z.number().int().nonnegative(),
    /**
     * topic_focus_area the bot emitted on the PREVIOUS turn. null on
     * turn 0. Round 9 W1c.
     */
    last_topic_focus_area: z.string().nullable().optional(),
    /**
     * Count of consecutive prior turns that emitted the same
     * topic_focus_area. 0 on turn 0; increments when same as previous
     * turn; resets to 0 when the bot pivots. Round 9 W1c.
     * Prompt rule: `>= 2` ⇒ bot MUST pivot to fresh_blueprint_topic this
     * turn (unless candidate's last answer was 5 with explicit interest).
     */
    consecutive_same_topic_count: z.number().int().nonnegative().optional(),
});
/* ----------------------------------------------------------------- */
/* Input envelope (D produces, C consumes)                            */
/* ----------------------------------------------------------------- */
export const CaIntAAgentTurnInput = z.object({
    sessionInputs: z
        .object({
        ASSESSMENT_DESC: z.string().min(1),
        ASSESSMENT_SKILLS: z.string().min(1),
        CODING_FOCUS: z.enum(['True', 'False']).default('False'),
        AREAS_OF_EVALUATION: z.string().min(1),
        INTERVIEW_FOCUS_AREAS: z.array(z.string()).min(1),
        INTERVIEW_BLUEPRINT: z.array(InterviewBlueprintStage),
        CANDIDATE_NAME: z.string().min(1),
        /**
         * Round 7 name — deprecated alias for Round 9 per CTO call #3.
         * The transform below auto-populates max_questions_cap from this
         * when the canonical name is absent. Round 10 removes the alias.
         */
        NUMBER_OF_ADAPTIVE_QUESTIONS: z.number().int().min(3).max(15),
        /**
         * Round 8.1 canonical alias matching Window D's `maxQuestionsCap`
         * field. D populates this server-side as
         * `Math.floor(durationMinutes / 2)` per dispatch 1b.
         */
        max_questions_cap: z.number().int().min(1).max(50).optional(),
        /** Hint when the active question carries on-screen code/math/image. */
        HAS_ONSCREEN_STIMULUS: z.boolean().optional().default(false),
        /** True when the assessment design also includes an English Speaking section. */
        speaking_test_present: z.boolean().optional().default(false),
    })
        /**
         * Guarantee max_questions_cap is always present post-validation so
         * the bot's prompt template AND any consumer of sessionInputs read
         * a single canonical value. Round 8.1 contract-drift fix.
         */
        .transform((data) => ({
        ...data,
        max_questions_cap: data.max_questions_cap ?? data.NUMBER_OF_ADAPTIVE_QUESTIONS,
    })),
    /** Full transcript so far, alternating roles. */
    history: z.array(ChatMessage),
    /** Latest candidate utterance (final transcript). May be empty on turn 0. */
    latestCandidate: z.string().default(''),
    /** Per-turn prosody. Optional only when no candidate speech yet (turn 0). */
    prosody: Prosody.optional(),
    /**
     * Per-turn signals. Required for Round 9 time-bounded interviews;
     * Round-7 callers without it fall back to defaults documented in
     * the bot's prompt.
     */
    agentSignals: AgentSignals.optional(),
});
/* ----------------------------------------------------------------- */
/* Output envelope (C produces, D consumes)                           */
/* ----------------------------------------------------------------- */
/**
 * CA_INT_A_AGENT_V1 output v2 — pure adaptive question generator.
 *
 * REMOVED vs Round 8.2: should_end, end_reason. The bot has ZERO
 * end-decision power per dispatch 1a — orchestrator owns ALL five end
 * paths (cap_reached / time_up / verbal_end / end_button /
 * technical_failure).
 *
 * REMOVED: 'wrap' from question_intent enum. next_question_difficulty
 * is no longer nullable (no wrap turns to produce null on).
 *
 * ADDED: prev_answer_ack (1-sentence acknowledgement before the
 * question; null on turn 0), topic_focus_area (stable label for the
 * orchestrator's ≥2-probes-before-pivot tracker), injection_attempted
 * (W1d log signal distinct from tampering).
 *
 * D-side mapping to persisted fatTurn:
 *   - next_question_text → agent fatTurn.text
 *   - prev_answer_ack    → agent fatTurn.ack_text (D persists for
 *     analyser ack-quality scoring)
 *   - prev_answer_score  → candidate fatTurn.answer_quality_1_5
 *   - tampering_attempted + injection_attempted → candidate fatTurn flags
 */
export const CaIntAAgentTurnOutput = z.object({
    /** 1-5 rating of the LATEST candidate utterance. null on turn 0. */
    prev_answer_score: z
        .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
        .nullable(),
    /**
     * 1-sentence acknowledgement of the candidate's previous answer.
     * null on turn 0 (intro is not graded). Max ~25 words; PURE
     * acknowledgement, no question content. Analyser can score ack
     * quality independently.
     */
    prev_answer_ack: z.string().nullable(),
    /** Pure question text. NO acknowledgement mixed in. */
    next_question_text: z.string().min(1),
    /** 1-5 calibrated difficulty of the next question. */
    next_question_difficulty: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
    ]),
    /**
     * Why the bot picked this question:
     *   - "baseline"              — turn 0 threshold grounded in candidate intro
     *   - "probe_followup"        — go deeper on the same area
     *   - "fresh_blueprint_topic" — move to next blueprint stage
     * No "wrap" — bot has zero end-decision power per dispatch 1a.
     */
    question_intent: z.enum([
        'baseline',
        'probe_followup',
        'fresh_blueprint_topic',
    ]),
    /**
     * Stable label for the focus area this question targets
     * (e.g. "REST API design", "OOP fundamentals"). Orchestrator counts
     * consecutive same-value emits to enforce the ≥2-probes-before-pivot
     * rule. Compare via opaque-string-equality; D may normalize
     * (lowercase + trim) if pathologic-mismatch shows up in practice.
     */
    topic_focus_area: z.string().min(1),
    /** Role-attack attempt by the candidate; LOGGING only (no auto-end). */
    tampering_attempted: z.boolean(),
    /**
     * Prompt-injection / system-prompt extraction attempt by the
     * candidate (distinct from tampering, though they can co-occur).
     * LOGGING only.
     */
    injection_attempted: z.boolean(),
});
/* ----------------------------------------------------------------- */
/* Welcome / branch text constants                                    */
/* ----------------------------------------------------------------- */
/**
 * Pre-rendered TTS text. Window D pre-renders all three at session
 * preflight (sub the candidate name into WELCOME_TEXT_TEMPLATE) so the
 * candidate hears the welcome instantly. Single source of truth for
 * Window D's cache; do NOT paraphrase or "improve" without Pranav.
 */
export const WELCOME_TEXT_TEMPLATE = 'Hello {CANDIDATE_NAME}, How are you feeling today? Welcome to the interview section of this assessment. Please begin by introducing yourself in a brief manner.';
export const BRANCH_A_TEXT = "Let's begin by assessing your speaking and communication skills before we get on with the technical interview.";
export const BRANCH_B_TEXT = 'Thank you for your introduction.';
export function renderWelcomeText(candidateName) {
    return WELCOME_TEXT_TEMPLATE.replace('{CANDIDATE_NAME}', candidateName);
}
