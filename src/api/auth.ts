/**
 * Auth + signup DTOs — R10 WA-1 BATCH 1.
 *
 * Locked at R10 mega dispatch:
 *   - Role lives in the DB row on `users`, NOT on the JWT (security posture:
 *     admin can revoke a role mid-session via a DB flip).
 *   - Single POST /auth/login takes {email, password, role}; server rejects
 *     if the DB row's role ≠ requested role (403 ROLE_MISMATCH).
 *   - Three signup URLs (/admin/signup, /assessor/signup, /candidate/signup)
 *     each gated on pre-existence — the email MUST be in `users` with the
 *     matching role + `status='invited'`. Else 403 EMAIL_NOT_INVITED.
 */
import { z } from 'zod'

export const ROLES = ['admin', 'assessor', 'candidate'] as const
export type Role = (typeof ROLES)[number]
export const roleSchema = z.enum(ROLES)

/** Public User type (no password hash, no email-verify token). */
export const userPublicSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  role: roleSchema,
  status: z.enum(['invited', 'active', 'disabled']),
})
export type UserPublic = z.infer<typeof userPublicSchema>

/** POST /api/v2/auth/login — request body. role discriminator R10 mega dispatch. */
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  /** Role-match guard. When set, server 403s if the email's DB role ≠ this. */
  role: roleSchema.optional(),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userPublicSchema,
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

/** Signup request bodies — split by role per the dispatch's field lists. */
const baseSignupFields = {
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.string().email(),
  phone: z.string().min(7).max(32).optional(),
  tags: z.array(z.string().min(1).max(64)).max(20).optional(),
} as const

export const candidateSignupSchema = z
  .object({
    ...baseSignupFields,
    batch: z.string().min(1).max(32),
    branch: z.string().min(1).max(64),
    usn: z.string().min(1).max(64),
    resumeBlobPath: z.string().min(1).max(512).optional(),
  })
  .strict()
export type CandidateSignupRequest = z.infer<typeof candidateSignupSchema>

export const staffSignupSchema = z
  .object({
    ...baseSignupFields,
    organizationName: z.string().min(1).max(255),
  })
  .strict()
export type StaffSignupRequest = z.infer<typeof staffSignupSchema>

/** Error codes returned by login + signup. */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS' as const,
  ROLE_MISMATCH: 'ROLE_MISMATCH' as const,
  EMAIL_NOT_INVITED: 'EMAIL_NOT_INVITED' as const,
  ALREADY_REGISTERED: 'ALREADY_REGISTERED' as const,
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED' as const,
} as const
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES]
