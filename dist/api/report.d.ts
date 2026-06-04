/**
 * Attempt-report response + show-answers shape — R10 WA-3 + WA-4 BATCH 3.
 *
 * Replaces the Round 9 `Round9SectionMetricsTODO` placeholder. Locked at
 * R10 mega dispatch.
 */
import { z } from 'zod';
export declare const sectionScoreSchema: z.ZodObject<{
    sectionId: z.ZodNumber;
    /** Admin-set display_name from sections; falls back to title when null. */
    sectionTitle: z.ZodString;
    moduleCode: z.ZodString;
    /** True for everything except interview sections (locked: interview NOT scored). */
    scored: z.ZodBoolean;
    score: z.ZodNumber;
    maxScore: z.ZodNumber;
    scoreNormalized: z.ZodNumber;
    /** Beside-score CEFR for english sections only; null elsewhere. */
    cefrLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>>;
}, "strip", z.ZodTypeAny, {
    sectionId: number;
    sectionTitle: string;
    moduleCode: string;
    scored: boolean;
    score: number;
    maxScore: number;
    scoreNormalized: number;
    cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
}, {
    sectionId: number;
    sectionTitle: string;
    moduleCode: string;
    scored: boolean;
    score: number;
    maxScore: number;
    scoreNormalized: number;
    cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
}>;
export type SectionScore = z.infer<typeof sectionScoreSchema>;
export declare const englishReportSchema: z.ZodObject<{
    sectionId: z.ZodNumber;
    sectionTitle: z.ZodString;
    overallCefr: z.ZodNullable<z.ZodEnum<["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"]>>;
    perSkill: z.ZodObject<{
        listening: z.ZodNullable<z.ZodObject<{
            score_100: z.ZodNumber;
            cefr: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            score_100: number;
            cefr: string;
        }, {
            score_100: number;
            cefr: string;
        }>>;
        speaking: z.ZodNullable<z.ZodObject<{
            score_100: z.ZodNumber;
            cefr: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            score_100: number;
            cefr: string;
        }, {
            score_100: number;
            cefr: string;
        }>>;
        reading: z.ZodNullable<z.ZodObject<{
            score_100: z.ZodNumber;
            cefr: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            score_100: number;
            cefr: string;
        }, {
            score_100: number;
            cefr: string;
        }>>;
        writing: z.ZodNullable<z.ZodObject<{
            score_100: z.ZodNumber;
            cefr: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            score_100: number;
            cefr: string;
        }, {
            score_100: number;
            cefr: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        listening: {
            score_100: number;
            cefr: string;
        } | null;
        speaking: {
            score_100: number;
            cefr: string;
        } | null;
        reading: {
            score_100: number;
            cefr: string;
        } | null;
        writing: {
            score_100: number;
            cefr: string;
        } | null;
    }, {
        listening: {
            score_100: number;
            cefr: string;
        } | null;
        speaking: {
            score_100: number;
            cefr: string;
        } | null;
        reading: {
            score_100: number;
            cefr: string;
        } | null;
        writing: {
            score_100: number;
            cefr: string;
        } | null;
    }>;
    performanceDimensions: z.ZodObject<{
        structure: z.ZodNumber;
        substance: z.ZodNumber;
        style: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        structure: number;
        substance: number;
        style: number;
    }, {
        structure: number;
        substance: number;
        style: number;
    }>;
    targetVsActual: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        mode: z.ZodEnum<["adaptive", "targeted"]>;
        target: z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>;
        actual: z.ZodNullable<z.ZodEnum<["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"]>>;
        deltaLevels: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        mode: "adaptive" | "targeted";
        target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
        actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        deltaLevels: number;
    }, {
        mode: "adaptive" | "targeted";
        target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
        actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        deltaLevels: number;
    }>>>;
}, "strip", z.ZodTypeAny, {
    sectionId: number;
    sectionTitle: string;
    overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
    perSkill: {
        listening: {
            score_100: number;
            cefr: string;
        } | null;
        speaking: {
            score_100: number;
            cefr: string;
        } | null;
        reading: {
            score_100: number;
            cefr: string;
        } | null;
        writing: {
            score_100: number;
            cefr: string;
        } | null;
    };
    performanceDimensions: {
        structure: number;
        substance: number;
        style: number;
    };
    targetVsActual?: {
        mode: "adaptive" | "targeted";
        target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
        actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        deltaLevels: number;
    } | null | undefined;
}, {
    sectionId: number;
    sectionTitle: string;
    overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
    perSkill: {
        listening: {
            score_100: number;
            cefr: string;
        } | null;
        speaking: {
            score_100: number;
            cefr: string;
        } | null;
        reading: {
            score_100: number;
            cefr: string;
        } | null;
        writing: {
            score_100: number;
            cefr: string;
        } | null;
    };
    performanceDimensions: {
        structure: number;
        substance: number;
        style: number;
    };
    targetVsActual?: {
        mode: "adaptive" | "targeted";
        target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
        actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        deltaLevels: number;
    } | null | undefined;
}>;
export type EnglishReport = z.infer<typeof englishReportSchema>;
export declare const interviewReportSchema: z.ZodObject<{
    sectionId: z.ZodNumber;
    sectionTitle: z.ZodString;
    transcriptUrl: z.ZodNullable<z.ZodString>;
    audioRecordingUrl: z.ZodNullable<z.ZodString>;
    narrativeSummary: z.ZodNullable<z.ZodString>;
    themesObserved: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    keyStrength: z.ZodNullable<z.ZodString>;
    keyGrowthArea: z.ZodNullable<z.ZodString>;
    durationMinutes: z.ZodNullable<z.ZodNumber>;
    questionsAsked: z.ZodNullable<z.ZodNumber>;
    endedReason: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    audioRecordingUrl: string | null;
    endedReason: string | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    sectionId: number;
    sectionTitle: string;
    transcriptUrl: string | null;
    narrativeSummary: string | null;
    themesObserved: string[] | null;
    keyStrength: string | null;
    keyGrowthArea: string | null;
}, {
    audioRecordingUrl: string | null;
    endedReason: string | null;
    questionsAsked: number | null;
    durationMinutes: number | null;
    sectionId: number;
    sectionTitle: string;
    transcriptUrl: string | null;
    narrativeSummary: string | null;
    themesObserved: string[] | null;
    keyStrength: string | null;
    keyGrowthArea: string | null;
}>;
export type InterviewReport = z.infer<typeof interviewReportSchema>;
export declare const swoiSchema: z.ZodObject<{
    strengths: z.ZodArray<z.ZodString, "many">;
    weaknesses: z.ZodArray<z.ZodString, "many">;
    opportunities: z.ZodArray<z.ZodString, "many">;
    improvements: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    improvements: string[];
}, {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    improvements: string[];
}>;
export type Swoi = z.infer<typeof swoiSchema>;
export declare const communicationAxesSchema: z.ZodObject<{
    fluency: z.ZodNullable<z.ZodNumber>;
    pronunciation: z.ZodNullable<z.ZodNumber>;
    vocabulary: z.ZodNullable<z.ZodNumber>;
    grammar: z.ZodNullable<z.ZodNumber>;
    comprehension: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    fluency: number | null;
    pronunciation: number | null;
    vocabulary: number | null;
    grammar: number | null;
    comprehension: number | null;
}, {
    fluency: number | null;
    pronunciation: number | null;
    vocabulary: number | null;
    grammar: number | null;
    comprehension: number | null;
}>;
export type CommunicationAxes = z.infer<typeof communicationAxesSchema>;
export declare const proctoringReportSchema: z.ZodObject<{
    summary: z.ZodString;
    countsByType: z.ZodRecord<z.ZodString, z.ZodNumber>;
    countsBySeverity: z.ZodObject<{
        info: z.ZodNumber;
        warning: z.ZodNumber;
        violation: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        info: number;
        warning: number;
        violation: number;
    }, {
        info: number;
        warning: number;
        violation: number;
    }>;
    disqualifyEvent: z.ZodNullable<z.ZodObject<{
        reason: z.ZodString;
        occurredAt: z.ZodString;
        strikeCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        occurredAt: string;
        strikeCount: number;
    }, {
        reason: string;
        occurredAt: string;
        strikeCount: number;
    }>>;
    highlightEvents: z.ZodArray<z.ZodObject<{
        eventType: z.ZodString;
        severity: z.ZodString;
        occurredAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        occurredAt: string;
        eventType: string;
        severity: string;
    }, {
        occurredAt: string;
        eventType: string;
        severity: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    summary: string;
    countsByType: Record<string, number>;
    countsBySeverity: {
        info: number;
        warning: number;
        violation: number;
    };
    disqualifyEvent: {
        reason: string;
        occurredAt: string;
        strikeCount: number;
    } | null;
    highlightEvents: {
        occurredAt: string;
        eventType: string;
        severity: string;
    }[];
}, {
    summary: string;
    countsByType: Record<string, number>;
    countsBySeverity: {
        info: number;
        warning: number;
        violation: number;
    };
    disqualifyEvent: {
        reason: string;
        occurredAt: string;
        strikeCount: number;
    } | null;
    highlightEvents: {
        occurredAt: string;
        eventType: string;
        severity: string;
    }[];
}>;
export type ProctoringReport = z.infer<typeof proctoringReportSchema>;
export declare const attemptReportSchema: z.ZodObject<{
    attemptId: z.ZodNumber;
    status: z.ZodEnum<["grading", "ready", "failed"]>;
    verdict: z.ZodNullable<z.ZodEnum<["qualified", "needs_improvement", "not_recommended"]>>;
    summary: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodNullable<z.ZodString>;
    candidatePhotoUrl: z.ZodNullable<z.ZodString>;
    sectionScores: z.ZodArray<z.ZodObject<{
        sectionId: z.ZodNumber;
        /** Admin-set display_name from sections; falls back to title when null. */
        sectionTitle: z.ZodString;
        moduleCode: z.ZodString;
        /** True for everything except interview sections (locked: interview NOT scored). */
        scored: z.ZodBoolean;
        score: z.ZodNumber;
        maxScore: z.ZodNumber;
        scoreNormalized: z.ZodNumber;
        /** Beside-score CEFR for english sections only; null elsewhere. */
        cefrLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>>;
    }, "strip", z.ZodTypeAny, {
        sectionId: number;
        sectionTitle: string;
        moduleCode: string;
        scored: boolean;
        score: number;
        maxScore: number;
        scoreNormalized: number;
        cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    }, {
        sectionId: number;
        sectionTitle: string;
        moduleCode: string;
        scored: boolean;
        score: number;
        maxScore: number;
        scoreNormalized: number;
        cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    }>, "many">;
    englishReport: z.ZodNullable<z.ZodObject<{
        sectionId: z.ZodNumber;
        sectionTitle: z.ZodString;
        overallCefr: z.ZodNullable<z.ZodEnum<["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"]>>;
        perSkill: z.ZodObject<{
            listening: z.ZodNullable<z.ZodObject<{
                score_100: z.ZodNumber;
                cefr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                score_100: number;
                cefr: string;
            }, {
                score_100: number;
                cefr: string;
            }>>;
            speaking: z.ZodNullable<z.ZodObject<{
                score_100: z.ZodNumber;
                cefr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                score_100: number;
                cefr: string;
            }, {
                score_100: number;
                cefr: string;
            }>>;
            reading: z.ZodNullable<z.ZodObject<{
                score_100: z.ZodNumber;
                cefr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                score_100: number;
                cefr: string;
            }, {
                score_100: number;
                cefr: string;
            }>>;
            writing: z.ZodNullable<z.ZodObject<{
                score_100: z.ZodNumber;
                cefr: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                score_100: number;
                cefr: string;
            }, {
                score_100: number;
                cefr: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        }, {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        }>;
        performanceDimensions: z.ZodObject<{
            structure: z.ZodNumber;
            substance: z.ZodNumber;
            style: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            structure: number;
            substance: number;
            style: number;
        }, {
            structure: number;
            substance: number;
            style: number;
        }>;
        targetVsActual: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            mode: z.ZodEnum<["adaptive", "targeted"]>;
            target: z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>;
            actual: z.ZodNullable<z.ZodEnum<["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"]>>;
            deltaLevels: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        }, {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        sectionId: number;
        sectionTitle: string;
        overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        perSkill: {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        };
        performanceDimensions: {
            structure: number;
            substance: number;
            style: number;
        };
        targetVsActual?: {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        } | null | undefined;
    }, {
        sectionId: number;
        sectionTitle: string;
        overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        perSkill: {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        };
        performanceDimensions: {
            structure: number;
            substance: number;
            style: number;
        };
        targetVsActual?: {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        } | null | undefined;
    }>>;
    interviewReport: z.ZodNullable<z.ZodObject<{
        sectionId: z.ZodNumber;
        sectionTitle: z.ZodString;
        transcriptUrl: z.ZodNullable<z.ZodString>;
        audioRecordingUrl: z.ZodNullable<z.ZodString>;
        narrativeSummary: z.ZodNullable<z.ZodString>;
        themesObserved: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
        keyStrength: z.ZodNullable<z.ZodString>;
        keyGrowthArea: z.ZodNullable<z.ZodString>;
        durationMinutes: z.ZodNullable<z.ZodNumber>;
        questionsAsked: z.ZodNullable<z.ZodNumber>;
        endedReason: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        audioRecordingUrl: string | null;
        endedReason: string | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        sectionId: number;
        sectionTitle: string;
        transcriptUrl: string | null;
        narrativeSummary: string | null;
        themesObserved: string[] | null;
        keyStrength: string | null;
        keyGrowthArea: string | null;
    }, {
        audioRecordingUrl: string | null;
        endedReason: string | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        sectionId: number;
        sectionTitle: string;
        transcriptUrl: string | null;
        narrativeSummary: string | null;
        themesObserved: string[] | null;
        keyStrength: string | null;
        keyGrowthArea: string | null;
    }>>;
    swoi: z.ZodNullable<z.ZodObject<{
        strengths: z.ZodArray<z.ZodString, "many">;
        weaknesses: z.ZodArray<z.ZodString, "many">;
        opportunities: z.ZodArray<z.ZodString, "many">;
        improvements: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        improvements: string[];
    }, {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        improvements: string[];
    }>>;
    communicationAxes: z.ZodNullable<z.ZodObject<{
        fluency: z.ZodNullable<z.ZodNumber>;
        pronunciation: z.ZodNullable<z.ZodNumber>;
        vocabulary: z.ZodNullable<z.ZodNumber>;
        grammar: z.ZodNullable<z.ZodNumber>;
        comprehension: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        fluency: number | null;
        pronunciation: number | null;
        vocabulary: number | null;
        grammar: number | null;
        comprehension: number | null;
    }, {
        fluency: number | null;
        pronunciation: number | null;
        vocabulary: number | null;
        grammar: number | null;
        comprehension: number | null;
    }>>;
    proctoring: z.ZodNullable<z.ZodObject<{
        summary: z.ZodString;
        countsByType: z.ZodRecord<z.ZodString, z.ZodNumber>;
        countsBySeverity: z.ZodObject<{
            info: z.ZodNumber;
            warning: z.ZodNumber;
            violation: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            info: number;
            warning: number;
            violation: number;
        }, {
            info: number;
            warning: number;
            violation: number;
        }>;
        disqualifyEvent: z.ZodNullable<z.ZodObject<{
            reason: z.ZodString;
            occurredAt: z.ZodString;
            strikeCount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        }, {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        }>>;
        highlightEvents: z.ZodArray<z.ZodObject<{
            eventType: z.ZodString;
            severity: z.ZodString;
            occurredAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            occurredAt: string;
            eventType: string;
            severity: string;
        }, {
            occurredAt: string;
            eventType: string;
            severity: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        countsByType: Record<string, number>;
        countsBySeverity: {
            info: number;
            warning: number;
            violation: number;
        };
        disqualifyEvent: {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        } | null;
        highlightEvents: {
            occurredAt: string;
            eventType: string;
            severity: string;
        }[];
    }, {
        summary: string;
        countsByType: Record<string, number>;
        countsBySeverity: {
            info: number;
            warning: number;
            violation: number;
        };
        disqualifyEvent: {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        } | null;
        highlightEvents: {
            occurredAt: string;
            eventType: string;
            severity: string;
        }[];
    }>>;
    disqualified: z.ZodBoolean;
    disqualifiedReason: z.ZodNullable<z.ZodString>;
    tabExitStrikeCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "grading" | "ready" | "failed";
    attemptId: number;
    summary: string | null;
    verdict: "qualified" | "needs_improvement" | "not_recommended" | null;
    generatedAt: string | null;
    candidatePhotoUrl: string | null;
    sectionScores: {
        sectionId: number;
        sectionTitle: string;
        moduleCode: string;
        scored: boolean;
        score: number;
        maxScore: number;
        scoreNormalized: number;
        cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    }[];
    englishReport: {
        sectionId: number;
        sectionTitle: string;
        overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        perSkill: {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        };
        performanceDimensions: {
            structure: number;
            substance: number;
            style: number;
        };
        targetVsActual?: {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        } | null | undefined;
    } | null;
    interviewReport: {
        audioRecordingUrl: string | null;
        endedReason: string | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        sectionId: number;
        sectionTitle: string;
        transcriptUrl: string | null;
        narrativeSummary: string | null;
        themesObserved: string[] | null;
        keyStrength: string | null;
        keyGrowthArea: string | null;
    } | null;
    swoi: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        improvements: string[];
    } | null;
    communicationAxes: {
        fluency: number | null;
        pronunciation: number | null;
        vocabulary: number | null;
        grammar: number | null;
        comprehension: number | null;
    } | null;
    proctoring: {
        summary: string;
        countsByType: Record<string, number>;
        countsBySeverity: {
            info: number;
            warning: number;
            violation: number;
        };
        disqualifyEvent: {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        } | null;
        highlightEvents: {
            occurredAt: string;
            eventType: string;
            severity: string;
        }[];
    } | null;
    disqualified: boolean;
    disqualifiedReason: string | null;
    tabExitStrikeCount: number;
}, {
    status: "grading" | "ready" | "failed";
    attemptId: number;
    summary: string | null;
    verdict: "qualified" | "needs_improvement" | "not_recommended" | null;
    generatedAt: string | null;
    candidatePhotoUrl: string | null;
    sectionScores: {
        sectionId: number;
        sectionTitle: string;
        moduleCode: string;
        scored: boolean;
        score: number;
        maxScore: number;
        scoreNormalized: number;
        cefrLevel?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    }[];
    englishReport: {
        sectionId: number;
        sectionTitle: string;
        overallCefr: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
        perSkill: {
            listening: {
                score_100: number;
                cefr: string;
            } | null;
            speaking: {
                score_100: number;
                cefr: string;
            } | null;
            reading: {
                score_100: number;
                cefr: string;
            } | null;
            writing: {
                score_100: number;
                cefr: string;
            } | null;
        };
        performanceDimensions: {
            structure: number;
            substance: number;
            style: number;
        };
        targetVsActual?: {
            mode: "adaptive" | "targeted";
            target: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null;
            actual: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "below_a1" | null;
            deltaLevels: number;
        } | null | undefined;
    } | null;
    interviewReport: {
        audioRecordingUrl: string | null;
        endedReason: string | null;
        questionsAsked: number | null;
        durationMinutes: number | null;
        sectionId: number;
        sectionTitle: string;
        transcriptUrl: string | null;
        narrativeSummary: string | null;
        themesObserved: string[] | null;
        keyStrength: string | null;
        keyGrowthArea: string | null;
    } | null;
    swoi: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        improvements: string[];
    } | null;
    communicationAxes: {
        fluency: number | null;
        pronunciation: number | null;
        vocabulary: number | null;
        grammar: number | null;
        comprehension: number | null;
    } | null;
    proctoring: {
        summary: string;
        countsByType: Record<string, number>;
        countsBySeverity: {
            info: number;
            warning: number;
            violation: number;
        };
        disqualifyEvent: {
            reason: string;
            occurredAt: string;
            strikeCount: number;
        } | null;
        highlightEvents: {
            occurredAt: string;
            eventType: string;
            severity: string;
        }[];
    } | null;
    disqualified: boolean;
    disqualifiedReason: string | null;
    tabExitStrikeCount: number;
}>;
export type AttemptReportResponse = z.infer<typeof attemptReportSchema>;
export declare const showAnswerQuestionSchema: z.ZodObject<{
    questionId: z.ZodNumber;
    questionType: z.ZodString;
    stem: z.ZodString;
    candidateAnswer: z.ZodNullable<z.ZodUnknown>;
    modelAnswer: z.ZodOptional<z.ZodUnknown>;
    score: z.ZodNullable<z.ZodNumber>;
    maxScore: z.ZodNullable<z.ZodNumber>;
    feedback: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    questionId: number;
    stem: string;
    score: number | null;
    maxScore: number | null;
    questionType: string;
    feedback: string | null;
    candidateAnswer?: unknown;
    modelAnswer?: unknown;
}, {
    questionId: number;
    stem: string;
    score: number | null;
    maxScore: number | null;
    questionType: string;
    feedback: string | null;
    candidateAnswer?: unknown;
    modelAnswer?: unknown;
}>;
export type ShowAnswerQuestion = z.infer<typeof showAnswerQuestionSchema>;
export declare const showAnswerSectionSchema: z.ZodObject<{
    sectionId: z.ZodNumber;
    /** Admin-set display_name; falls back to title when null. */
    title: z.ZodString;
    moduleCode: z.ZodString;
    isInterview: z.ZodBoolean;
    questions: z.ZodArray<z.ZodObject<{
        questionId: z.ZodNumber;
        questionType: z.ZodString;
        stem: z.ZodString;
        candidateAnswer: z.ZodNullable<z.ZodUnknown>;
        modelAnswer: z.ZodOptional<z.ZodUnknown>;
        score: z.ZodNullable<z.ZodNumber>;
        maxScore: z.ZodNullable<z.ZodNumber>;
        feedback: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        questionId: number;
        stem: string;
        score: number | null;
        maxScore: number | null;
        questionType: string;
        feedback: string | null;
        candidateAnswer?: unknown;
        modelAnswer?: unknown;
    }, {
        questionId: number;
        stem: string;
        score: number | null;
        maxScore: number | null;
        questionType: string;
        feedback: string | null;
        candidateAnswer?: unknown;
        modelAnswer?: unknown;
    }>, "many">;
    transcriptInline: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["ai", "candidate"]>;
        text: z.ZodString;
        ts: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        role: "candidate" | "ai";
        ts?: string | undefined;
    }, {
        text: string;
        role: "candidate" | "ai";
        ts?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    sectionId: number;
    moduleCode: string;
    title: string;
    isInterview: boolean;
    questions: {
        questionId: number;
        stem: string;
        score: number | null;
        maxScore: number | null;
        questionType: string;
        feedback: string | null;
        candidateAnswer?: unknown;
        modelAnswer?: unknown;
    }[];
    transcriptInline?: {
        text: string;
        role: "candidate" | "ai";
        ts?: string | undefined;
    }[] | undefined;
}, {
    sectionId: number;
    moduleCode: string;
    title: string;
    isInterview: boolean;
    questions: {
        questionId: number;
        stem: string;
        score: number | null;
        maxScore: number | null;
        questionType: string;
        feedback: string | null;
        candidateAnswer?: unknown;
        modelAnswer?: unknown;
    }[];
    transcriptInline?: {
        text: string;
        role: "candidate" | "ai";
        ts?: string | undefined;
    }[] | undefined;
}>;
export type ShowAnswerSection = z.infer<typeof showAnswerSectionSchema>;
export declare const showAnswersResponseSchema: z.ZodObject<{
    attemptId: z.ZodNumber;
    sections: z.ZodArray<z.ZodObject<{
        sectionId: z.ZodNumber;
        /** Admin-set display_name; falls back to title when null. */
        title: z.ZodString;
        moduleCode: z.ZodString;
        isInterview: z.ZodBoolean;
        questions: z.ZodArray<z.ZodObject<{
            questionId: z.ZodNumber;
            questionType: z.ZodString;
            stem: z.ZodString;
            candidateAnswer: z.ZodNullable<z.ZodUnknown>;
            modelAnswer: z.ZodOptional<z.ZodUnknown>;
            score: z.ZodNullable<z.ZodNumber>;
            maxScore: z.ZodNullable<z.ZodNumber>;
            feedback: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }, {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }>, "many">;
        transcriptInline: z.ZodOptional<z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["ai", "candidate"]>;
            text: z.ZodString;
            ts: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }, {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        sectionId: number;
        moduleCode: string;
        title: string;
        isInterview: boolean;
        questions: {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }[];
        transcriptInline?: {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }[] | undefined;
    }, {
        sectionId: number;
        moduleCode: string;
        title: string;
        isInterview: boolean;
        questions: {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }[];
        transcriptInline?: {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    attemptId: number;
    sections: {
        sectionId: number;
        moduleCode: string;
        title: string;
        isInterview: boolean;
        questions: {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }[];
        transcriptInline?: {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }[] | undefined;
    }[];
}, {
    attemptId: number;
    sections: {
        sectionId: number;
        moduleCode: string;
        title: string;
        isInterview: boolean;
        questions: {
            questionId: number;
            stem: string;
            score: number | null;
            maxScore: number | null;
            questionType: string;
            feedback: string | null;
            candidateAnswer?: unknown;
            modelAnswer?: unknown;
        }[];
        transcriptInline?: {
            text: string;
            role: "candidate" | "ai";
            ts?: string | undefined;
        }[] | undefined;
    }[];
}>;
export type ShowAnswersResponse = z.infer<typeof showAnswersResponseSchema>;
export declare const PerSectionAnalysisEntry: z.ZodObject<{
    sectionId: z.ZodNumber;
    sectionModuleCode: z.ZodString;
    moduleCode: z.ZodString;
    analysis: z.ZodNullable<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sectionId: number;
    moduleCode: string;
    sectionModuleCode: string;
    error?: string | undefined;
    analysis?: unknown;
}, {
    sectionId: number;
    moduleCode: string;
    sectionModuleCode: string;
    error?: string | undefined;
    analysis?: unknown;
}>;
export type PerSectionAnalysisEntry = z.infer<typeof PerSectionAnalysisEntry>;
