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
import { SectionModuleCode } from '../enums/section-module-code.js';
/**
 * Per-section analysis entry — current Round 8 shape. The key in
 * `attempt_reports.per_section_analysis_json` is `s${sectionId}_${moduleCode}`
 * (Round 8.2 fix).
 */
export const PerSectionAnalysisEntry = z.object({
    sectionId: z.number().int().positive(),
    sectionModuleCode: z.string(),
    /** Analyser-bucket name: 'mcq' | 'subjective' | 'coding'. */
    moduleCode: z.string(),
    analysis: z.unknown().nullable(),
    error: z.string().optional(),
});
/**
 * Stub for Round 9 work area 3 — structured numeric metrics shape.
 * Locked in WA-3 proposal in COMMS once Window C publishes analyser
 * output. Field comments are illustrative; the locked zod schema lives
 * here AFTER ack.
 */
export const Round9SectionMetricsTODO = z
    .object({
    sectionId: z.number().int().positive(),
    sectionTitle: z.string(), // ADMIN-set, not analyser-type
    sectionModuleCode: SectionModuleCode,
    // skills: array of { name, score_1_5, evidence } — locked in WA-3 proposal
    // summary: string
    // recommendations: string[]
})
    .passthrough();
