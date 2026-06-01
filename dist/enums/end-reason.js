/**
 * Interview ended_reason union — the persisted value in
 * platform-api `interview_sessions.ended_reason` (MySQL enum, see
 * drizzle/tenant/0010 + 0012 migrations). Window D's orchestrator emits
 * via PATCH writeback; Window A persists.
 *
 * Three vocabularies coexist for back-compat:
 *   Legacy (Round 7):   completed, candidate_terminated, timeout,
 *                       technical_failure
 *   Round 8 dispatch:   timer, cap, end_button, verbal, end_flag
 *   Round 8.1 (Window C bot vocabulary + tampering):
 *                       cap_reached, time_up, verbal_end, tampering
 *
 * Round 9 Interview Brain v2 may consolidate; until then the persisted
 * enum accepts all 13 and Window D's mapper bridges WS-side / bot-side
 * names to the persisted set.
 */
import { z } from 'zod';
export const PersistedEndReason = z.enum([
    'completed',
    'candidate_terminated',
    'timeout',
    'technical_failure',
    'timer',
    'cap',
    'end_button',
    'verbal',
    'end_flag',
    'cap_reached',
    'time_up',
    'verbal_end',
    'tampering',
]);
/** Smaller subset emitted on the WS `interview_ended.reason` frame. */
export const WsInterviewEndedReason = z.enum([
    'completed',
    'candidate_terminated',
    'timeout',
    'technical_failure',
    'time_up',
    'cap_reached',
    'end_button',
    'verbal_end',
]);
