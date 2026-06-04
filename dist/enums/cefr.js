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
export const CEFR_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
/** Reader extension for the SUM-report — overall CEFR may include `below_a1`. */
export const CEFR_OVERALL_LEVELS = ['below_a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
export const cefrLevelSchema = z.enum(CEFR_LEVELS);
export const cefrOverallLevelSchema = z.enum(CEFR_OVERALL_LEVELS);
/** Uppercase display label for the UI. */
export const CEFR_LABEL = {
    a1: 'A1',
    a2: 'A2',
    b1: 'B1',
    b2: 'B2',
    c1: 'C1',
    c2: 'C2',
};
export const CEFR_OVERALL_LABEL = {
    below_a1: 'Below A1',
    ...CEFR_LABEL,
};
export const LSRW_MODES = ['adaptive', 'targeted'];
export const lsrwModeSchema = z.enum(LSRW_MODES);
export const LSRW_SKILLS = ['listening', 'speaking', 'reading', 'writing'];
