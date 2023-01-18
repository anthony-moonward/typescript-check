import ts from 'typescript'
import {z} from 'zod'
import {error} from '@actions/core'

const TsConfigSchema = z.object({
  noUncheckedIndexedAccess: z.literal(true, {
    errorMap: () => ({message: 'tsconfig.json must contain "noUncheckedIndexedAccess" and have it set to true'})
  }),
  noImplicitAny: z.literal(true, {
    errorMap: () => ({message: 'tsconfig.json must contain "noImplicitAny" and have it set to true'})
  }),
  strictNullChecks: z.literal(true, {
    errorMap: () => ({message: 'tsconfig.json must contain "strictNullChecks" and have it set to true'})
  }),
  strict: z.literal(true, {
    errorMap: () => ({message: 'tsconfig.json must contain "strict" and have it set to true'})
  })
})

export function validateTsConfig(config: ts.CompilerOptions): boolean {
  const parsed = TsConfigSchema.safeParse(config)
  if (parsed.success) return true

  parsed.error.issues.forEach(issue => {
    error(issue.message, {
      file: 'tsconfig.json'
    })
  })
  return false
}
