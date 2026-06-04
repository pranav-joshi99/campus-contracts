/**
 * CEFR (Common European Framework of Reference) levels — R10 WA-0b.
 *
 * Locked at R10 mega dispatch: lowercase enum values map to the
 * sections.lsrw_target_cefr DB column. CEFR_LABEL provides the display
 * (uppercase) form for UI rendering.
 *
 * The two-mode LSRW design:
 *   - Mode 1 ('adaptive'): no target — generator emits a balanced A1..C2 pool.
 *   - Mode 2 ('targeted'): admin picks a target — generator clusters at target ± 1.
 */
import { z } from 'zod';
export declare const CEFR_LEVELS: readonly ["a1", "a2", "b1", "b2", "c1", "c2"];
export type CefrLevel = (typeof CEFR_LEVELS)[number];
/** Reader extension for the SUM-report — overall CEFR may include `below_a1`. */
export declare const CEFR_OVERALL_LEVELS: readonly ["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"];
export type CefrOverallLevel = (typeof CEFR_OVERALL_LEVELS)[number];
export declare const cefrLevelSchema: z.ZodEnum<["a1", "a2", "b1", "b2", "c1", "c2"]>;
export declare const cefrOverallLevelSchema: z.ZodEnum<["below_a1", "a1", "a2", "b1", "b2", "c1", "c2"]>;
/** Uppercase display label for the UI. */
export declare const CEFR_LABEL: Record<CefrLevel, string>;
export declare const CEFR_OVERALL_LABEL: Record<CefrOverallLevel, string>;
export declare const LSRW_MODES: readonly ["adaptive", "targeted"];
export type LsrwMode = (typeof LSRW_MODES)[number];
export declare const lsrwModeSchema: z.ZodEnum<["adaptive", "targeted"]>;
export declare const LSRW_SKILLS: readonly ["listening", "speaking", "reading", "writing"];
export type LsrwSkill = (typeof LSRW_SKILLS)[number];
