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
/**
 * One chat turn as wire-shape — `interview_sessions.transcript[]` mirrors
 * this with a few additional persistence fields (timestamp, prosody).
 * Kept here as the cross-window source-of-truth for the agent envelope.
 */
export declare const ChatMessage: z.ZodObject<{
    role: z.ZodEnum<["agent", "candidate"]>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    role: "agent" | "candidate";
}, {
    text: string;
    role: "agent" | "candidate";
}>;
export type ChatMessage = z.infer<typeof ChatMessage>;
/**
 * Prosody side-signals (Window 4 / Microsoft Speech SDK derived). All
 * optional on turn 0; bot uses them for sentiment-aware probing.
 */
export declare const Prosody: z.ZodObject<{
    long_pauses: z.ZodNumber;
    tremor: z.ZodNumber;
    filler_rate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    long_pauses: number;
    tremor: number;
    filler_rate: number;
}, {
    long_pauses: number;
    tremor: number;
    filler_rate: number;
}>;
export type Prosody = z.infer<typeof Prosody>;
/**
 * Interview blueprint stage. One row per planned area; the bot adapts
 * loosely off these.
 */
export declare const InterviewBlueprintStage: z.ZodObject<{
    stageNumber: z.ZodNumber;
    assessmentSkill: z.ZodString;
    areasOfEvaluation: z.ZodString;
    areaOfQuestioning: z.ZodString;
    /** Two sample questions per stage. */
    sampleQuestions: z.ZodArray<z.ZodString, "many">;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    stageNumber: number;
    assessmentSkill: string;
    areasOfEvaluation: string;
    areaOfQuestioning: string;
    sampleQuestions: string[];
    reasoning: string;
}, {
    stageNumber: number;
    assessmentSkill: string;
    areasOfEvaluation: string;
    areaOfQuestioning: string;
    sampleQuestions: string[];
    reasoning: string;
}>;
export type InterviewBlueprintStage = z.infer<typeof InterviewBlueprintStage>;
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
export declare const AgentSignals: z.ZodObject<{
    /** Number of substantive bot turns ALREADY taken (NOT including welcome). */
    turn_count: z.ZodNumber;
    /** Wall-clock seconds remaining in the interview window. */
    time_remaining_sec: z.ZodNumber;
    /**
     * topic_focus_area the bot emitted on the PREVIOUS turn. null on
     * turn 0. Round 9 W1c.
     */
    last_topic_focus_area: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /**
     * Count of consecutive prior turns that emitted the same
     * topic_focus_area. 0 on turn 0; increments when same as previous
     * turn; resets to 0 when the bot pivots. Round 9 W1c.
     * Prompt rule: `>= 2` ⇒ bot MUST pivot to fresh_blueprint_topic this
     * turn (unless candidate's last answer was 5 with explicit interest).
     */
    consecutive_same_topic_count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    turn_count: number;
    time_remaining_sec: number;
    last_topic_focus_area?: string | null | undefined;
    consecutive_same_topic_count?: number | undefined;
}, {
    turn_count: number;
    time_remaining_sec: number;
    last_topic_focus_area?: string | null | undefined;
    consecutive_same_topic_count?: number | undefined;
}>;
export type AgentSignals = z.infer<typeof AgentSignals>;
export declare const CaIntAAgentTurnInput: z.ZodObject<{
    sessionInputs: z.ZodEffects<z.ZodObject<{
        ASSESSMENT_DESC: z.ZodString;
        ASSESSMENT_SKILLS: z.ZodString;
        CODING_FOCUS: z.ZodDefault<z.ZodEnum<["True", "False"]>>;
        AREAS_OF_EVALUATION: z.ZodString;
        INTERVIEW_FOCUS_AREAS: z.ZodArray<z.ZodString, "many">;
        INTERVIEW_BLUEPRINT: z.ZodArray<z.ZodObject<{
            stageNumber: z.ZodNumber;
            assessmentSkill: z.ZodString;
            areasOfEvaluation: z.ZodString;
            areaOfQuestioning: z.ZodString;
            /** Two sample questions per stage. */
            sampleQuestions: z.ZodArray<z.ZodString, "many">;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }, {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }>, "many">;
        CANDIDATE_NAME: z.ZodString;
        /**
         * Round 7 name — deprecated alias for Round 9 per CTO call #3.
         * The transform below auto-populates max_questions_cap from this
         * when the canonical name is absent. Round 10 removes the alias.
         */
        NUMBER_OF_ADAPTIVE_QUESTIONS: z.ZodNumber;
        /**
         * Round 8.1 canonical alias matching Window D's `maxQuestionsCap`
         * field. D populates this server-side as
         * `Math.floor(durationMinutes / 2)` per dispatch 1b.
         */
        max_questions_cap: z.ZodOptional<z.ZodNumber>;
        /** Hint when the active question carries on-screen code/math/image. */
        HAS_ONSCREEN_STIMULUS: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        /** True when the assessment design also includes an English Speaking section. */
        speaking_test_present: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        speaking_test_present: boolean;
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        CODING_FOCUS: "True" | "False";
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        HAS_ONSCREEN_STIMULUS: boolean;
        max_questions_cap?: number | undefined;
    }, {
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        speaking_test_present?: boolean | undefined;
        CODING_FOCUS?: "True" | "False" | undefined;
        max_questions_cap?: number | undefined;
        HAS_ONSCREEN_STIMULUS?: boolean | undefined;
    }>, {
        max_questions_cap: number;
        speaking_test_present: boolean;
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        CODING_FOCUS: "True" | "False";
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        HAS_ONSCREEN_STIMULUS: boolean;
    }, {
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        speaking_test_present?: boolean | undefined;
        CODING_FOCUS?: "True" | "False" | undefined;
        max_questions_cap?: number | undefined;
        HAS_ONSCREEN_STIMULUS?: boolean | undefined;
    }>;
    /** Full transcript so far, alternating roles. */
    history: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["agent", "candidate"]>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        role: "agent" | "candidate";
    }, {
        text: string;
        role: "agent" | "candidate";
    }>, "many">;
    /** Latest candidate utterance (final transcript). May be empty on turn 0. */
    latestCandidate: z.ZodDefault<z.ZodString>;
    /** Per-turn prosody. Optional only when no candidate speech yet (turn 0). */
    prosody: z.ZodOptional<z.ZodObject<{
        long_pauses: z.ZodNumber;
        tremor: z.ZodNumber;
        filler_rate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        long_pauses: number;
        tremor: number;
        filler_rate: number;
    }, {
        long_pauses: number;
        tremor: number;
        filler_rate: number;
    }>>;
    /**
     * Per-turn signals. Required for Round 9 time-bounded interviews;
     * Round-7 callers without it fall back to defaults documented in
     * the bot's prompt.
     */
    agentSignals: z.ZodOptional<z.ZodObject<{
        /** Number of substantive bot turns ALREADY taken (NOT including welcome). */
        turn_count: z.ZodNumber;
        /** Wall-clock seconds remaining in the interview window. */
        time_remaining_sec: z.ZodNumber;
        /**
         * topic_focus_area the bot emitted on the PREVIOUS turn. null on
         * turn 0. Round 9 W1c.
         */
        last_topic_focus_area: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        /**
         * Count of consecutive prior turns that emitted the same
         * topic_focus_area. 0 on turn 0; increments when same as previous
         * turn; resets to 0 when the bot pivots. Round 9 W1c.
         * Prompt rule: `>= 2` ⇒ bot MUST pivot to fresh_blueprint_topic this
         * turn (unless candidate's last answer was 5 with explicit interest).
         */
        consecutive_same_topic_count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        turn_count: number;
        time_remaining_sec: number;
        last_topic_focus_area?: string | null | undefined;
        consecutive_same_topic_count?: number | undefined;
    }, {
        turn_count: number;
        time_remaining_sec: number;
        last_topic_focus_area?: string | null | undefined;
        consecutive_same_topic_count?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    sessionInputs: {
        max_questions_cap: number;
        speaking_test_present: boolean;
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        CODING_FOCUS: "True" | "False";
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        HAS_ONSCREEN_STIMULUS: boolean;
    };
    history: {
        text: string;
        role: "agent" | "candidate";
    }[];
    latestCandidate: string;
    prosody?: {
        long_pauses: number;
        tremor: number;
        filler_rate: number;
    } | undefined;
    agentSignals?: {
        turn_count: number;
        time_remaining_sec: number;
        last_topic_focus_area?: string | null | undefined;
        consecutive_same_topic_count?: number | undefined;
    } | undefined;
}, {
    sessionInputs: {
        ASSESSMENT_DESC: string;
        ASSESSMENT_SKILLS: string;
        AREAS_OF_EVALUATION: string;
        INTERVIEW_FOCUS_AREAS: string[];
        INTERVIEW_BLUEPRINT: {
            stageNumber: number;
            assessmentSkill: string;
            areasOfEvaluation: string;
            areaOfQuestioning: string;
            sampleQuestions: string[];
            reasoning: string;
        }[];
        CANDIDATE_NAME: string;
        NUMBER_OF_ADAPTIVE_QUESTIONS: number;
        speaking_test_present?: boolean | undefined;
        CODING_FOCUS?: "True" | "False" | undefined;
        max_questions_cap?: number | undefined;
        HAS_ONSCREEN_STIMULUS?: boolean | undefined;
    };
    history: {
        text: string;
        role: "agent" | "candidate";
    }[];
    latestCandidate?: string | undefined;
    prosody?: {
        long_pauses: number;
        tremor: number;
        filler_rate: number;
    } | undefined;
    agentSignals?: {
        turn_count: number;
        time_remaining_sec: number;
        last_topic_focus_area?: string | null | undefined;
        consecutive_same_topic_count?: number | undefined;
    } | undefined;
}>;
export type CaIntAAgentTurnInput = z.infer<typeof CaIntAAgentTurnInput>;
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
export declare const CaIntAAgentTurnOutput: z.ZodObject<{
    /** 1-5 rating of the LATEST candidate utterance. null on turn 0. */
    prev_answer_score: z.ZodNullable<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>]>>;
    /**
     * 1-sentence acknowledgement of the candidate's previous answer.
     * null on turn 0 (intro is not graded). Max ~25 words; PURE
     * acknowledgement, no question content. Analyser can score ack
     * quality independently.
     */
    prev_answer_ack: z.ZodNullable<z.ZodString>;
    /** Pure question text. NO acknowledgement mixed in. */
    next_question_text: z.ZodString;
    /** 1-5 calibrated difficulty of the next question. */
    next_question_difficulty: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>, z.ZodLiteral<5>]>;
    /**
     * Why the bot picked this question:
     *   - "baseline"              — turn 0 threshold grounded in candidate intro
     *   - "probe_followup"        — go deeper on the same area
     *   - "fresh_blueprint_topic" — move to next blueprint stage
     * No "wrap" — bot has zero end-decision power per dispatch 1a.
     */
    question_intent: z.ZodEnum<["baseline", "probe_followup", "fresh_blueprint_topic"]>;
    /**
     * Stable label for the focus area this question targets
     * (e.g. "REST API design", "OOP fundamentals"). Orchestrator counts
     * consecutive same-value emits to enforce the ≥2-probes-before-pivot
     * rule. Compare via opaque-string-equality; D may normalize
     * (lowercase + trim) if pathologic-mismatch shows up in practice.
     */
    topic_focus_area: z.ZodString;
    /** Role-attack attempt by the candidate; LOGGING only (no auto-end). */
    tampering_attempted: z.ZodBoolean;
    /**
     * Prompt-injection / system-prompt extraction attempt by the
     * candidate (distinct from tampering, though they can co-occur).
     * LOGGING only.
     */
    injection_attempted: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    prev_answer_score: 1 | 2 | 3 | 4 | 5 | null;
    question_intent: "baseline" | "probe_followup" | "fresh_blueprint_topic";
    prev_answer_ack: string | null;
    next_question_text: string;
    next_question_difficulty: 1 | 2 | 3 | 4 | 5;
    topic_focus_area: string;
    tampering_attempted: boolean;
    injection_attempted: boolean;
}, {
    prev_answer_score: 1 | 2 | 3 | 4 | 5 | null;
    question_intent: "baseline" | "probe_followup" | "fresh_blueprint_topic";
    prev_answer_ack: string | null;
    next_question_text: string;
    next_question_difficulty: 1 | 2 | 3 | 4 | 5;
    topic_focus_area: string;
    tampering_attempted: boolean;
    injection_attempted: boolean;
}>;
export type CaIntAAgentTurnOutput = z.infer<typeof CaIntAAgentTurnOutput>;
/**
 * Pre-rendered TTS text. Window D pre-renders all three at session
 * preflight (sub the candidate name into WELCOME_TEXT_TEMPLATE) so the
 * candidate hears the welcome instantly. Single source of truth for
 * Window D's cache; do NOT paraphrase or "improve" without Pranav.
 */
export declare const WELCOME_TEXT_TEMPLATE = "Hello {CANDIDATE_NAME}, How are you feeling today? Welcome to the interview section of this assessment. Please begin by introducing yourself in a brief manner.";
export declare const BRANCH_A_TEXT = "Let's begin by assessing your speaking and communication skills before we get on with the technical interview.";
export declare const BRANCH_B_TEXT = "Thank you for your introduction.";
export declare function renderWelcomeText(candidateName: string): string;
