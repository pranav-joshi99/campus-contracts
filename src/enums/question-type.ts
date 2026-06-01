/**
 * Question type — persisted on `questions.question_type`. Drives the
 * candidate-side renderer + analyser routing.
 *
 * LSRW question types (lsrw_*) belong to the english module; mcq /
 * subjective / coding are their own modules.
 */
import { z } from 'zod'

export const QuestionType = z.enum([
  'mcq',
  'subjective',
  'coding',
  'lsrw_list',
  'lsrw_read',
  'lsrw_speak',
  'lsrw_write',
])
export type QuestionType = z.infer<typeof QuestionType>
