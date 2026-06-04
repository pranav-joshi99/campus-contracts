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
import { z } from 'zod';
export declare const ROLES: readonly ["admin", "assessor", "candidate"];
export type Role = (typeof ROLES)[number];
export declare const roleSchema: z.ZodEnum<["admin", "assessor", "candidate"]>;
/** Public User type (no password hash, no email-verify token). */
export declare const userPublicSchema: z.ZodObject<{
    id: z.ZodNumber;
    email: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodEnum<["admin", "assessor", "candidate"]>;
    status: z.ZodEnum<["invited", "active", "disabled"]>;
}, "strip", z.ZodTypeAny, {
    status: "invited" | "active" | "disabled";
    role: "candidate" | "admin" | "assessor";
    id: number;
    email: string;
    name: string;
    phone?: string | null | undefined;
}, {
    status: "invited" | "active" | "disabled";
    role: "candidate" | "admin" | "assessor";
    id: number;
    email: string;
    name: string;
    phone?: string | null | undefined;
}>;
export type UserPublic = z.infer<typeof userPublicSchema>;
/** POST /api/v2/auth/login — request body. role discriminator R10 mega dispatch. */
export declare const loginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    /** Role-match guard. When set, server 403s if the email's DB role ≠ this. */
    role: z.ZodOptional<z.ZodEnum<["admin", "assessor", "candidate"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role?: "candidate" | "admin" | "assessor" | undefined;
}, {
    email: string;
    password: string;
    role?: "candidate" | "admin" | "assessor" | undefined;
}>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export declare const loginResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodNumber;
        email: z.ZodString;
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodEnum<["admin", "assessor", "candidate"]>;
        status: z.ZodEnum<["invited", "active", "disabled"]>;
    }, "strip", z.ZodTypeAny, {
        status: "invited" | "active" | "disabled";
        role: "candidate" | "admin" | "assessor";
        id: number;
        email: string;
        name: string;
        phone?: string | null | undefined;
    }, {
        status: "invited" | "active" | "disabled";
        role: "candidate" | "admin" | "assessor";
        id: number;
        email: string;
        name: string;
        phone?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    refreshToken: string;
    user: {
        status: "invited" | "active" | "disabled";
        role: "candidate" | "admin" | "assessor";
        id: number;
        email: string;
        name: string;
        phone?: string | null | undefined;
    };
}, {
    accessToken: string;
    refreshToken: string;
    user: {
        status: "invited" | "active" | "disabled";
        role: "candidate" | "admin" | "assessor";
        id: number;
        email: string;
        name: string;
        phone?: string | null | undefined;
    };
}>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export declare const candidateSignupSchema: z.ZodObject<{
    batch: z.ZodString;
    branch: z.ZodString;
    usn: z.ZodString;
    resumeBlobPath: z.ZodOptional<z.ZodString>;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    email: string;
    batch: string;
    branch: string;
    usn: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    resumeBlobPath?: string | undefined;
    tags?: string[] | undefined;
}, {
    email: string;
    batch: string;
    branch: string;
    usn: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    resumeBlobPath?: string | undefined;
    tags?: string[] | undefined;
}>;
export type CandidateSignupRequest = z.infer<typeof candidateSignupSchema>;
export declare const staffSignupSchema: z.ZodObject<{
    organizationName: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    phone?: string | undefined;
    tags?: string[] | undefined;
}, {
    email: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    phone?: string | undefined;
    tags?: string[] | undefined;
}>;
export type StaffSignupRequest = z.infer<typeof staffSignupSchema>;
/** Error codes returned by login + signup. */
export declare const AUTH_ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly ROLE_MISMATCH: "ROLE_MISMATCH";
    readonly EMAIL_NOT_INVITED: "EMAIL_NOT_INVITED";
    readonly ALREADY_REGISTERED: "ALREADY_REGISTERED";
    readonly ACCOUNT_DISABLED: "ACCOUNT_DISABLED";
};
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
