/**
 * Coding question payload — the normalized shape Window A's
 * GET /api/v2/take/:assessmentId/sections/:sectionId/questions returns
 * for coding-typed questions, AND the body Window D's
 * /testenv/coding/run + /testenv/coding/submit accept.
 *
 * Pulled verbatim at platform-api SHA 58230e1 (Round 8.2 normalizer at
 * fetch). Source payload (Window C code-q-gen) uses `testCases[].isVisible`;
 * the normalizer splits into `visibleTests` + `hiddenTests` and injects
 * default time/memory limits if absent. Both legacy + normalized fields
 * surface in the response for back-compat with the existing FE renderer.
 */
import { z } from 'zod';
export const CodingTestCase = z.object({
    input: z.string(),
    expectedOutput: z.string(),
    isVisible: z.boolean(),
});
/**
 * Normalized candidate-facing coding payload. `testCases` is the legacy
 * single-array shape Window C emits; `visibleTests` + `hiddenTests` are
 * the Window A normalizer's split. Time + memory limits land as
 * top-level fields with sensible defaults when the payload doesn't
 * specify (5sec / 256MB).
 */
export const CodingQuestionPayload = z.object({
    stem: z.string(),
    prompt: z.string(),
    difficulty: z.number().int().min(1).max(10).optional(),
    starterCode: z.string().optional(),
    /** Legacy single array — preserved for back-compat. */
    testCases: z.array(CodingTestCase),
    /** Round 8.2 normalizer output. */
    visibleTests: z.array(CodingTestCase),
    hiddenTests: z.array(CodingTestCase),
    /** Judge0 time limit per case, seconds. Default 5. */
    timeLimitSec: z.number().int().min(1).max(60),
    /** Judge0 memory limit per case, MB. Default 256. */
    memoryLimitMB: z.number().int().min(16).max(1024),
});
