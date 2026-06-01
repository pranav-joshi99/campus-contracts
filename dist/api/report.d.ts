/**
 * Attempt report response — placeholder for Round 9 work area 3.
 *
 * Today's shape is mostly free-form JSON (perSectionAnalysisJson +
 * swoiJson + verdict). Round 9 work area 3 rebuilds it to surface
 * structured numeric metrics (per-skill 1-5 ratings, spider-chart-
 * ready dimensions) so Window B can render charts and Window A doesn't
 * need to project the analyser outputs ad-hoc.
 *
 * This file ships as a TODO marker in Phase 1; the WA-3 proposal in
 * COMMS fills in the locked shape after Window C publishes the
 * analyser output schema.
 */
import { z } from 'zod';
/**
 * Per-section analysis entry — current Round 8 shape. The key in
 * `attempt_reports.per_section_analysis_json` is `s${sectionId}_${moduleCode}`
 * (Round 8.2 fix).
 */
export declare const PerSectionAnalysisEntry: z.ZodObject<{
    sectionId: z.ZodNumber;
    sectionModuleCode: z.ZodString;
    /** Analyser-bucket name: 'mcq' | 'subjective' | 'coding'. */
    moduleCode: z.ZodString;
    analysis: z.ZodNullable<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sectionId: number;
    sectionModuleCode: string;
    moduleCode: string;
    error?: string | undefined;
    analysis?: unknown;
}, {
    sectionId: number;
    sectionModuleCode: string;
    moduleCode: string;
    error?: string | undefined;
    analysis?: unknown;
}>;
export type PerSectionAnalysisEntry = z.infer<typeof PerSectionAnalysisEntry>;
/**
 * Stub for Round 9 work area 3 — structured numeric metrics shape.
 * Locked in WA-3 proposal in COMMS once Window C publishes analyser
 * output. Field comments are illustrative; the locked zod schema lives
 * here AFTER ack.
 */
export declare const Round9SectionMetricsTODO: z.ZodObject<{
    sectionId: z.ZodNumber;
    sectionTitle: z.ZodString;
    sectionModuleCode: z.ZodEnum<["mcq", "subjective", "coding", "english", "interview"]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    sectionId: z.ZodNumber;
    sectionTitle: z.ZodString;
    sectionModuleCode: z.ZodEnum<["mcq", "subjective", "coding", "english", "interview"]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    sectionId: z.ZodNumber;
    sectionTitle: z.ZodString;
    sectionModuleCode: z.ZodEnum<["mcq", "subjective", "coding", "english", "interview"]>;
}, z.ZodTypeAny, "passthrough">>;
export type Round9SectionMetricsTODO = z.infer<typeof Round9SectionMetricsTODO>;
