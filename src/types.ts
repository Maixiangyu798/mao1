export type Difficulty = 'beginner' | 'intermediate' | 'challenge'

export type Category = 'basic' | 'office' | 'data' | 'fun'

export type LessonType = 'theory' | 'practice'

export type GoalKey = 'office' | 'data' | 'interest' | 'course'

export type CourseStatus = 'not_started' | 'learning' | 'completed'

export type ProblemStatus = 'todo' | 'passed' | 'failed'

export type CourseIcon =
  | 'terminal'
  | 'folder'
  | 'chart'
  | 'gamepad'
  | 'pen'
  | 'list'
  | 'file'
  | 'function'
  | 'excel'
  | 'pie'
  | 'text'
  | 'blocks'

export interface Lesson {
  id: string
  chapterId: string
  title: string
  type: LessonType
  order: number
}

export interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  eyebrow: string
  description: string
  category: Category
  categoryLabel: string
  difficulty: Difficulty
  icon: CourseIcon
  lessonCount: number
  durationMinutes: number
  learnerCount: number
  rating: number
  outcomes: string[]
  audience: string[]
  chapters: Chapter[]
}

export interface Problem {
  id: string
  number: string
  title: string
  difficulty: Difficulty
  tags: string[]
  description: string
  task: string
  sampleInput: string
  sampleOutput: string
  explanation: string
  initialCode: string
  hints: string[]
  solution: string
  solutionIdea: string
}

export interface UserPreferences {
  lessonFontSize: 12 | 14 | 16
  reminderEnabled: boolean
  reminderTime: string
  achievementNotify: boolean
  defaultHome: 'home' | 'courses' | 'practice'
}

export interface CourseProgress {
  completedLessons: string[]
  currentLessonId: string
}

export interface ProblemResult {
  stars: number
  attempts: number
}

export interface User {
  id: string
  nickname: string
  initials: string
  bio: string
  joinedDays: number
  exp: number
  streakDays: number
  hoursLearned: number
  completedLessonCount: number
  passedProblemCount: number
  goals: GoalKey[]
  courseProgress: Record<string, CourseProgress>
  completedCourses: string[]
  problemResults: Record<string, ProblemResult>
  favoriteCourses: string[]
  favoriteProblems: string[]
  achievements: Record<string, string>
  readMessageIds: string[]
  checkedInToday: boolean
  preferences: UserPreferences
}

export interface Achievement {
  id: string
  name: string
  condition: string
  description: string
  icon: string
}

export interface LearningRecord {
  id: string
  type: 'lesson' | 'problem'
  title: string
  subtitle: string
  time: string
  group: 'today' | 'yesterday' | 'earlier'
  status: 'completed' | 'passed' | 'failed'
  detail: string
  action: string
  href?: string
}

export interface Message {
  id: string
  type: 'system' | 'reminder' | 'achievement'
  title: string
  summary: string
  time: string
  unread?: boolean
  href?: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  initial: string
  level: number
  hours: number
  isMe?: boolean
}

export interface CodeRunResult {
  status: 'success' | 'error' | 'timeout'
  output: string
  detail?: string
  duration?: string
  friendlyError?: string
}
