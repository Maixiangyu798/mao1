export const STORAGE_KEYS = {
  token: 'naiwa_token',
  user: 'naiwa_user_v2',
  editorFont: 'naiwa_editor_font',
  draft: (lessonId: string) => `naiwa_draft_${lessonId}`,
  problemDraft: (problemId: string) => `naiwa_problem_draft_${problemId}`,
} as const

export function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private mode; the prototype still works.
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage access errors.
  }
}
