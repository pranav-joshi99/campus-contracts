/**
 * Section type (cross-window) — R10 WA-0a/0b BATCH 1.
 *
 * Adds CEFR two-mode columns + display_name + interview admin fields to the
 * shared Section shape. New + legacy reads coexist via resolveLsrwSkillsEnabled
 * (`@crezam/contracts/lsrw-config`).
 */
import { z } from 'zod';
/** Per-skill enable flags for an LSRW section. */
export declare const lsrwSkillsEnabledSchema: z.ZodObject<{
    listening: z.ZodOptional<z.ZodBoolean>;
    speaking: z.ZodOptional<z.ZodBoolean>;
    reading: z.ZodOptional<z.ZodBoolean>;
    writing: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    listening?: boolean | undefined;
    speaking?: boolean | undefined;
    reading?: boolean | undefined;
    writing?: boolean | undefined;
}, {
    listening?: boolean | undefined;
    speaking?: boolean | undefined;
    reading?: boolean | undefined;
    writing?: boolean | undefined;
}>;
export type LsrwSkillsEnabled = z.infer<typeof lsrwSkillsEnabledSchema>;
export declare const sectionSchema: z.ZodObject<{
    id: z.ZodNumber;
    assessmentId: z.ZodNumber;
    title: z.ZodString;
    /** R10 WA-0a — admin-set candidate-facing label. Falls back to `title` when null. */
    displayName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    moduleCode: z.ZodString;
    orderIndex: z.ZodNumber;
    durationSeconds: z.ZodNumber;
    config: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
    lsrwMode: z.ZodEnum<["adaptive", "targeted"]>;
    lsrwTargetCefr: z.ZodOptional<z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>>;
    lsrwSkillsEnabled: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        listening: z.ZodOptional<z.ZodBoolean>;
        speaking: z.ZodOptional<z.ZodBoolean>;
        reading: z.ZodOptional<z.ZodBoolean>;
        writing: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    }, {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    }>>>;
    interviewFocusAreas: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    interviewBlueprint: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
    interviewNumQuestions: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    interviewMaxDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    id: number;
    assessmentId: number;
    moduleCode: string;
    title: string;
    orderIndex: number;
    durationSeconds: number;
    lsrwMode: "adaptive" | "targeted";
    displayName?: string | null | undefined;
    config?: unknown;
    lsrwTargetCefr?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    lsrwSkillsEnabled?: {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    } | null | undefined;
    interviewFocusAreas?: string[] | null | undefined;
    interviewBlueprint?: unknown;
    interviewNumQuestions?: number | null | undefined;
    interviewMaxDurationSeconds?: number | null | undefined;
}, {
    id: number;
    assessmentId: number;
    moduleCode: string;
    title: string;
    orderIndex: number;
    durationSeconds: number;
    lsrwMode: "adaptive" | "targeted";
    displayName?: string | null | undefined;
    config?: unknown;
    lsrwTargetCefr?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    lsrwSkillsEnabled?: {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    } | null | undefined;
    interviewFocusAreas?: string[] | null | undefined;
    interviewBlueprint?: unknown;
    interviewNumQuestions?: number | null | undefined;
    interviewMaxDurationSeconds?: number | null | undefined;
}>;
export type SectionDto = z.infer<typeof sectionSchema>;
/** PATCH /api/v2/sections/:id — body shape (additive, all optional). */
export declare const sectionPatchSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderIndex: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    config: z.ZodOptional<z.ZodUnknown>;
    lsrwMode: z.ZodOptional<z.ZodEnum<["adaptive", "targeted"]>>;
    lsrwTargetCefr: z.ZodOptional<z.ZodNullable<z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>>>;
    lsrwSkillsEnabled: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        listening: z.ZodOptional<z.ZodBoolean>;
        speaking: z.ZodOptional<z.ZodBoolean>;
        reading: z.ZodOptional<z.ZodBoolean>;
        writing: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    }, {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    }>>>;
    interviewFocusAreas: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    interviewBlueprint: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
    interviewNumQuestions: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    interviewMaxDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strict", z.ZodTypeAny, {
    title?: string | undefined;
    displayName?: string | null | undefined;
    orderIndex?: number | undefined;
    durationSeconds?: number | undefined;
    config?: unknown;
    lsrwMode?: "adaptive" | "targeted" | undefined;
    lsrwTargetCefr?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    lsrwSkillsEnabled?: {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    } | null | undefined;
    interviewFocusAreas?: string[] | null | undefined;
    interviewBlueprint?: unknown;
    interviewNumQuestions?: number | null | undefined;
    interviewMaxDurationSeconds?: number | null | undefined;
}, {
    title?: string | undefined;
    displayName?: string | null | undefined;
    orderIndex?: number | undefined;
    durationSeconds?: number | undefined;
    config?: unknown;
    lsrwMode?: "adaptive" | "targeted" | undefined;
    lsrwTargetCefr?: "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | null | undefined;
    lsrwSkillsEnabled?: {
        listening?: boolean | undefined;
        speaking?: boolean | undefined;
        reading?: boolean | undefined;
        writing?: boolean | undefined;
    } | null | undefined;
    interviewFocusAreas?: string[] | null | undefined;
    interviewBlueprint?: unknown;
    interviewNumQuestions?: number | null | undefined;
    interviewMaxDurationSeconds?: number | null | undefined;
}>;
export type SectionPatchBody = z.infer<typeof sectionPatchSchema>;
