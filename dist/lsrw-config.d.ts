/**
 * LSRW configuration resolver — R10 WA-0b.
 *
 * Accepts EITHER the new schema columns (lsrwMode + lsrwTargetCefr +
 * lsrwSkillsEnabled, added in tenant migration idx 13) OR the legacy
 * `config.lsrw` blob (the shape that lived inside sections.config before
 * the columns existed). Back-compat is permanent — existing rows persist
 * in the legacy shape until they're next written.
 *
 * Locked at R10 mega dispatch:
 *   - Mode 1 (adaptive) default.
 *   - Mode 2 (targeted) requires a non-null target CEFR.
 *   - At least one skill must be enabled (last-skill guard).
 */
import type { CefrLevel, LsrwMode } from './enums/cefr.js';
export interface LsrwSkillsEnabled {
    listening?: boolean;
    speaking?: boolean;
    reading?: boolean;
    writing?: boolean;
}
/** Resolved + validated LSRW config — always non-null, always has ≥1 skill. */
export interface ResolvedLsrwConfig {
    mode: LsrwMode;
    targetCefr: CefrLevel | null;
    skillsEnabled: Required<LsrwSkillsEnabled>;
}
/**
 * The relevant subset of a Section row. Accepts the new column names and the
 * legacy `config.lsrw` shape; either is fine. Pass `section.config?.lsrw` as
 * `legacyConfig` to drive the back-compat read.
 */
export interface LsrwSectionLike {
    lsrwMode?: LsrwMode | string | null;
    lsrwTargetCefr?: CefrLevel | string | null;
    lsrwSkillsEnabled?: LsrwSkillsEnabled | null;
    config?: {
        lsrw?: {
            mode?: string;
            target?: string;
            targetCefr?: string;
            enabled?: LsrwSkillsEnabled;
            skills?: LsrwSkillsEnabled;
        } | null;
    } | null;
}
/**
 * Resolve the section's LSRW config. New columns win over the legacy
 * `config.lsrw` blob. If neither is present, returns sensible defaults
 * (adaptive mode, all skills on, no target).
 */
export declare function resolveLsrwSkillsEnabled(section: LsrwSectionLike): ResolvedLsrwConfig;
/** True iff at least one LSRW skill is enabled — defends BE NO_SKILL_ENABLED 400. */
export declare function hasAnyLsrwSkillEnabled(skillsEnabled: LsrwSkillsEnabled | null | undefined): boolean;
export declare const LSRW_CONFIG_ERRORS: {
    readonly INVALID_TARGETED_CONFIG: "INVALID_TARGETED_CONFIG";
    readonly NO_SKILL_ENABLED: "NO_SKILL_ENABLED";
};
