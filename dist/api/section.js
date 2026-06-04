/**
 * Section type (cross-window) — R10 WA-0a/0b BATCH 1.
 *
 * Adds CEFR two-mode columns + display_name + interview admin fields to the
 * shared Section shape. New + legacy reads coexist via resolveLsrwSkillsEnabled
 * (`@crezam/contracts/lsrw-config`).
 */
import { z } from 'zod';
import { CEFR_LEVELS, LSRW_MODES } from '../enums/cefr.js';
/** Per-skill enable flags for an LSRW section. */
export const lsrwSkillsEnabledSchema = z
    .object({
    listening: z.boolean().optional(),
    speaking: z.boolean().optional(),
    reading: z.boolean().optional(),
    writing: z.boolean().optional(),
})
    .strict();
export const sectionSchema = z.object({
    id: z.number().int().positive(),
    assessmentId: z.number().int().positive(),
    title: z.string().min(1),
    /** R10 WA-0a — admin-set candidate-facing label. Falls back to `title` when null. */
    displayName: z.string().min(1).max(255).nullable().optional(),
    moduleCode: z.string().min(1),
    orderIndex: z.number().int().nonnegative(),
    durationSeconds: z.number().int().positive(),
    config: z.unknown().nullable().optional(),
    // R10 WA-0b — CEFR two-mode LSRW.
    lsrwMode: z.enum(LSRW_MODES),
    lsrwTargetCefr: z.enum(CEFR_LEVELS).nullable().optional(),
    lsrwSkillsEnabled: lsrwSkillsEnabledSchema.nullable().optional(),
    // Interview admin (added by phase2a; restating for completeness).
    interviewFocusAreas: z.array(z.string()).nullable().optional(),
    interviewBlueprint: z.unknown().nullable().optional(),
    interviewNumQuestions: z.number().int().positive().nullable().optional(),
    interviewMaxDurationSeconds: z.number().int().positive().nullable().optional(),
});
/** PATCH /api/v2/sections/:id — body shape (additive, all optional). */
export const sectionPatchSchema = z
    .object({
    title: z.string().min(1).max(255).optional(),
    displayName: z.string().min(1).max(255).nullable().optional(),
    orderIndex: z.number().int().nonnegative().optional(),
    durationSeconds: z.number().int().positive().optional(),
    config: z.unknown().optional(),
    lsrwMode: z.enum(LSRW_MODES).optional(),
    lsrwTargetCefr: z.enum(CEFR_LEVELS).nullable().optional(),
    lsrwSkillsEnabled: lsrwSkillsEnabledSchema.nullable().optional(),
    interviewFocusAreas: z.array(z.string()).nullable().optional(),
    interviewBlueprint: z.unknown().nullable().optional(),
    interviewNumQuestions: z.number().int().positive().nullable().optional(),
    interviewMaxDurationSeconds: z.number().int().positive().nullable().optional(),
})
    .strict();
