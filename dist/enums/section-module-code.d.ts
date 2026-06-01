/**
 * Module code for a section — the design-time discriminator the admin
 * picks in the design wizard. Persisted on `sections.module_code` on the
 * platform-api side. The report key uses this string (per Round 8.2 fix:
 * `s${sectionId}_${moduleCode}` not the analyser-bucket name).
 *
 * Not to be confused with the analyser bucket ('mcq' | 'subjective' |
 * 'coding') which is a question-type-derived routing key.
 */
import { z } from 'zod';
export declare const SectionModuleCode: z.ZodEnum<["mcq", "subjective", "coding", "english", "interview"]>;
export type SectionModuleCode = z.infer<typeof SectionModuleCode>;
