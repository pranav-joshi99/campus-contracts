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
import type { CefrLevel, LsrwMode } from './enums/cefr.js'
import { CEFR_LEVELS, LSRW_MODES, LSRW_SKILLS } from './enums/cefr.js'

export interface LsrwSkillsEnabled {
  listening?: boolean
  speaking?: boolean
  reading?: boolean
  writing?: boolean
}

/** Resolved + validated LSRW config — always non-null, always has ≥1 skill. */
export interface ResolvedLsrwConfig {
  mode: LsrwMode
  targetCefr: CefrLevel | null
  skillsEnabled: Required<LsrwSkillsEnabled>
}

/**
 * The relevant subset of a Section row. Accepts the new column names and the
 * legacy `config.lsrw` shape; either is fine. Pass `section.config?.lsrw` as
 * `legacyConfig` to drive the back-compat read.
 */
export interface LsrwSectionLike {
  lsrwMode?: LsrwMode | string | null
  lsrwTargetCefr?: CefrLevel | string | null
  lsrwSkillsEnabled?: LsrwSkillsEnabled | null
  config?: {
    lsrw?: {
      mode?: string
      target?: string
      targetCefr?: string
      enabled?: LsrwSkillsEnabled
      skills?: LsrwSkillsEnabled
    } | null
  } | null
}

const isLsrwMode = (v: unknown): v is LsrwMode =>
  typeof v === 'string' && (LSRW_MODES as readonly string[]).includes(v)

const isCefrLevel = (v: unknown): v is CefrLevel =>
  typeof v === 'string' && (CEFR_LEVELS as readonly string[]).includes(v.toLowerCase())

const normaliseCefr = (v: unknown): CefrLevel | null =>
  isCefrLevel(v) ? (v as string).toLowerCase() as CefrLevel : null

const DEFAULT_SKILLS: Required<LsrwSkillsEnabled> = {
  listening: true,
  speaking: true,
  reading: true,
  writing: true,
}

function coerceSkills(input: LsrwSkillsEnabled | null | undefined): Required<LsrwSkillsEnabled> {
  if (!input) return { ...DEFAULT_SKILLS }
  const out: Required<LsrwSkillsEnabled> = { ...DEFAULT_SKILLS }
  for (const skill of LSRW_SKILLS) {
    if (typeof input[skill] === 'boolean') out[skill] = input[skill]!
  }
  return out
}

/**
 * Resolve the section's LSRW config. New columns win over the legacy
 * `config.lsrw` blob. If neither is present, returns sensible defaults
 * (adaptive mode, all skills on, no target).
 */
export function resolveLsrwSkillsEnabled(
  section: LsrwSectionLike,
): ResolvedLsrwConfig {
  const legacy = section.config?.lsrw ?? null

  const mode: LsrwMode = isLsrwMode(section.lsrwMode)
    ? section.lsrwMode
    : isLsrwMode(legacy?.mode)
      ? (legacy!.mode as LsrwMode)
      : 'adaptive'

  const targetCefr: CefrLevel | null =
    normaliseCefr(section.lsrwTargetCefr) ??
    normaliseCefr(legacy?.target) ??
    normaliseCefr(legacy?.targetCefr) ??
    null

  const skillsEnabled = coerceSkills(
    section.lsrwSkillsEnabled ?? legacy?.enabled ?? legacy?.skills ?? null,
  )

  return { mode, targetCefr, skillsEnabled }
}

/** True iff at least one LSRW skill is enabled — defends BE NO_SKILL_ENABLED 400. */
export function hasAnyLsrwSkillEnabled(
  skillsEnabled: LsrwSkillsEnabled | null | undefined,
): boolean {
  if (!skillsEnabled) return true // null is read as "default ⇒ all enabled"
  return LSRW_SKILLS.some((s) => skillsEnabled[s] === true)
}

export const LSRW_CONFIG_ERRORS = {
  INVALID_TARGETED_CONFIG: 'INVALID_TARGETED_CONFIG' as const,
  NO_SKILL_ENABLED: 'NO_SKILL_ENABLED' as const,
} as const
