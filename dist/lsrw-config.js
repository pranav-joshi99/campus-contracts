import { CEFR_LEVELS, LSRW_MODES, LSRW_SKILLS } from './enums/cefr.js';
const isLsrwMode = (v) => typeof v === 'string' && LSRW_MODES.includes(v);
const isCefrLevel = (v) => typeof v === 'string' && CEFR_LEVELS.includes(v.toLowerCase());
const normaliseCefr = (v) => isCefrLevel(v) ? v.toLowerCase() : null;
const DEFAULT_SKILLS = {
    listening: true,
    speaking: true,
    reading: true,
    writing: true,
};
function coerceSkills(input) {
    if (!input)
        return { ...DEFAULT_SKILLS };
    const out = { ...DEFAULT_SKILLS };
    for (const skill of LSRW_SKILLS) {
        if (typeof input[skill] === 'boolean')
            out[skill] = input[skill];
    }
    return out;
}
/**
 * Resolve the section's LSRW config. New columns win over the legacy
 * `config.lsrw` blob. If neither is present, returns sensible defaults
 * (adaptive mode, all skills on, no target).
 */
export function resolveLsrwSkillsEnabled(section) {
    const legacy = section.config?.lsrw ?? null;
    const mode = isLsrwMode(section.lsrwMode)
        ? section.lsrwMode
        : isLsrwMode(legacy?.mode)
            ? legacy.mode
            : 'adaptive';
    const targetCefr = normaliseCefr(section.lsrwTargetCefr) ??
        normaliseCefr(legacy?.target) ??
        normaliseCefr(legacy?.targetCefr) ??
        null;
    const skillsEnabled = coerceSkills(section.lsrwSkillsEnabled ?? legacy?.enabled ?? legacy?.skills ?? null);
    return { mode, targetCefr, skillsEnabled };
}
/** True iff at least one LSRW skill is enabled — defends BE NO_SKILL_ENABLED 400. */
export function hasAnyLsrwSkillEnabled(skillsEnabled) {
    if (!skillsEnabled)
        return true; // null is read as "default ⇒ all enabled"
    return LSRW_SKILLS.some((s) => skillsEnabled[s] === true);
}
export const LSRW_CONFIG_ERRORS = {
    INVALID_TARGETED_CONFIG: 'INVALID_TARGETED_CONFIG',
    NO_SKILL_ENABLED: 'NO_SKILL_ENABLED',
};
