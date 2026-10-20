import type { StoredLearning } from '../../types.ts'
import { learningSchema } from './schema.ts'

export const studentKey = 'skillsprint.student.v1'
export const demoKey = 'skillsprint.demo.v1'
export const modeKey = 'skillsprint.mode'
export const themeKey = 'skillsprint.theme'

export function browserRepository(key: string) {
  return {
    load(): StoredLearning | null {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return null
        const parsed = learningSchema.safeParse(JSON.parse(raw))
        return parsed.success ? parsed.data : null
      } catch {
        return null
      }
    },
    save(value: StoredLearning) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    clear() {
      localStorage.removeItem(key)
    },
  }
}
