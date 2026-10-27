import { courses, getCourse } from '@/data/courses'
import type {
  Achievement,
  GoalKey,
  LeaderboardEntry,
  LearningRecord,
  Message,
  User,
  UserPreferences,
} from '@/types'

export const levelTable = [
  { level: 1, title: '蝌蚪', min: 0, max: 100 },
  { level: 2, title: '小奶蛙', min: 101, max: 300 },
  { level: 3, title: '快乐奶蛙', min: 301, max: 700 },
  { level: 4, title: '学霸蛙', min: 701, max: 1500 },
  { level: 5, title: '蛙博士', min: 1501, max: 3000 },
]

export function getLevelInfo(exp: number) {
  const item = levelTable.find((level) => exp <= level.max) ?? levelTable[levelTable.length - 1]
  const span = item.max - item.min
  const current = Math.max(0, exp - item.min)
  return {
    ...item,
    progress: item.level === 5 ? 100 : Math.min(100, Math.round((current / span) * 100)),
    current,
    nextLevelExp: item.level === 5 ? item.max : item.max + 1,
    remaining: item.level === 5 ? 0 : item.max + 1 - exp,
  }
}

export const goalOptions: { value: GoalKey; label: string; description: string }[] = [
  { value: 'office', label: '办公自动化', description: '让 Excel、文件整理这些重复工作更轻松' },
  { value: 'data', label: '数据分析', description: '读懂数据，发现规律与答案' },
  { value: 'interest', label: '兴趣入门', description: '单纯好奇，想试试编程的乐趣' },
  { value: 'course', label: '应付课业', description: '巩固课堂知识，完成课程练习' },
]

export const defaultPreferences: UserPreferences = {
  lessonFontSize: 14,
  reminderEnabled: true,
  reminderTime: '20:00',
  achievementNotify: true,
  defaultHome: 'home',
}

function getDemoCompletedLessons() {
  const course = getCourse('py-basic-01')
  if (!course) return []
  return course.chapters
    .slice(0, 3)
    .flatMap((chapter, chapterIndex) =>
      chapterIndex < 2 ? chapter.lessons : chapter.lessons.slice(0, 1),
    )
    .map((lesson) => lesson.id)
}

export function createDemoUser(): User {
  return {
    id: 'demo-lin',
    nickname: '小林同学',
    initials: '林',
    bio: '认真写好每一行，把好奇变成能力。',
    joinedDays: 32,
    exp: 680,
    streakDays: 7,
    hoursLearned: 18.5,
    completedLessonCount: 42,
    passedProblemCount: 35,
    goals: ['office', 'data'],
    courseProgress: {
      'py-basic-01': {
        completedLessons: getDemoCompletedLessons(),
        currentLessonId: 'py-basic-01-c3-l2',
      },
    },
    completedCourses: ['py-grammar-01'],
    problemResults: {
      p001: { stars: 3, attempts: 1 },
      p003: { stars: 0, attempts: 3 },
    },
    favoriteCourses: ['py-basic-01', 'office-auto-01', 'data-analysis-01'],
    favoriteProblems: ['p002', 'p003', 'p001', 'p005'],
    achievements: {
      'first-code': '2026.09.20',
      'first-steps': '2026.09.20',
      'chapter-clear': '2026.09.24',
      'one-shot': '2026.09.25',
      'streak-7': '2026.10.22',
      'course-graduate': '2026.10.20',
    },
    readMessageIds: ['m3', 'm4', 'm5', 'm6'],
    checkedInToday: true,
    preferences: { ...defaultPreferences },
  }
}

export function createNewUser(nickname = '新同学'): User {
  return {
    id: `user-${Date.now()}`,
    nickname,
    initials: nickname.slice(0, 1) || '蛙',
    bio: '刚刚加入奶蛙，准备写下第一行代码。',
    joinedDays: 1,
    exp: 0,
    streakDays: 0,
    hoursLearned: 0,
    completedLessonCount: 0,
    passedProblemCount: 0,
    goals: [],
    courseProgress: {},
    completedCourses: [],
    problemResults: {},
    favoriteCourses: [],
    favoriteProblems: [],
    achievements: {},
    readMessageIds: [],
    checkedInToday: false,
    preferences: { ...defaultPreferences },
  }
}

export const achievements: Achievement[] = [
  {
    id: 'first-code',
    name: '第一行代码',
    condition: '完成第一个课时',
    description: '成功运行第一段代码',
    icon: 'terminal',
  },
  {
    id: 'first-steps',
    name: '初出茅庐',
    condition: '完成第一个课时',
    description: '完成第一个课时',
    icon: 'sprout',
  },
  {
    id: 'chapter-clear',
    name: '章节通关',
    condition: '完成任意 1 个章节的全部课时',
    description: '完成一个章节的全部课时',
    icon: 'flag',
  },
  {
    id: 'practice-master',
    name: '练习达人',
    condition: '累计通过 50 道练习',
    description: '累计通过 50 道练习题',
    icon: 'target',
  },
  {
    id: 'one-shot',
    name: '一次就对',
    condition: '单题一次通过且未使用提示',
    description: '首次提交就通过一道练习题',
    icon: 'star',
  },
  {
    id: 'streak-7',
    name: '连续 7 天',
    condition: '连续打卡 7 天',
    description: '连续学习 7 天',
    icon: 'flame',
  },
  {
    id: 'streak-30',
    name: '全勤蛙',
    condition: '连续打卡 30 天',
    description: '连续学习 30 天',
    icon: 'calendar',
  },
  {
    id: 'course-graduate',
    name: '结课啦',
    condition: '完成第一门完整课程',
    description: '完成一门课程的全部课时',
    icon: 'graduation',
  },
  {
    id: 'frog-doctor',
    name: '蛙博士之路',
    condition: '等级达到 Lv.5',
    description: '达到 Lv.5',
    icon: 'trophy',
  },
]

export const messages: Message[] = [
  {
    id: 'm1',
    type: 'achievement',
    title: '连续 7 天，你做到了！',
    summary: '已获得「连续 7 天」成就。每一次准时出现，都在积累新的可能。',
    time: '今天 10:24',
    href: '/profile/achievements',
  },
  {
    id: 'm2',
    type: 'reminder',
    title: '字符串的世界，还想和你聊两句',
    summary: '你上次学到 3.2 字符串拼接，找个舒服的时间继续吧。',
    time: '今天 09:00',
    href: '/learn/py-basic-01/py-basic-01-c3-l2',
  },
  {
    id: 'm3',
    type: 'system',
    title: '欢迎来到奶蛙 Python',
    summary: '你的学习小天地准备好了。从第一行代码开始，我们慢慢来。',
    time: '09.20 10:30',
    href: '/courses',
  },
  {
    id: 'm4',
    type: 'achievement',
    title: '恭喜完成「Python 语法练习册」',
    summary: '「结课啦」成就已点亮，去我的成就看看这份认真吧。',
    time: '10.20 21:08',
    href: '/profile/achievements',
  },
  {
    id: 'm5',
    type: 'reminder',
    title: '今天的练习，也可以只花 5 分钟',
    summary: '试试 #002 计算平均分，用刚学会的知识解决一个小问题。',
    time: '10.20 20:00',
    href: '/practice/p002',
  },
  {
    id: 'm6',
    type: 'achievement',
    title: '一次就对，给认真思考的你',
    summary: '恭喜首次提交通过练习，「一次就对」成就已获得。',
    time: '09.25 19:42',
    href: '/profile/achievements',
  },
]

export const learningRecords: LearningRecord[] = [
  {
    id: 'r1',
    type: 'lesson',
    title: 'Python 零基础入门',
    subtitle: '3.2 用字符串拼接出一句问候',
    time: '10:24',
    group: 'today',
    status: 'completed',
    detail: '学习中 · 12 分钟',
    action: '继续学习',
    href: '/learn/py-basic-01/py-basic-01-c3-l2',
  },
  {
    id: 'r2',
    type: 'problem',
    title: '#001 问候语',
    subtitle: '字符串 · 入门',
    time: '09:52',
    group: 'today',
    status: 'passed',
    detail: '已通过 · 一次通过 ★',
    action: '再练一次',
    href: '/practice/p001',
  },
  {
    id: 'r3',
    type: 'lesson',
    title: 'Python 零基础入门',
    subtitle: '3.1 认识字符串',
    time: '20:15',
    group: 'yesterday',
    status: 'completed',
    detail: '已完成 · 18 分钟',
    action: '复习一下',
    href: '/learn/py-basic-01/py-basic-01-c3-l1',
  },
  {
    id: 'r4',
    type: 'problem',
    title: '#003 猜数字',
    subtitle: '条件与循环 · 进阶',
    time: '19:48',
    group: 'yesterday',
    status: 'failed',
    detail: '未通过 · 已尝试 3 次',
    action: '继续练习',
    href: '/practice/p003',
  },
  {
    id: 'r5',
    type: 'lesson',
    title: 'Python 语法练习册',
    subtitle: '课程已完成',
    time: '21:08',
    group: 'earlier',
    status: 'completed',
    detail: '已结课 · 共 16 课时',
    action: '查看课程',
    href: '/course/py-grammar-01',
  },
  {
    id: 'r6',
    type: 'lesson',
    title: 'Python 零基础入门',
    subtitle: '2.8 数据类型小练习',
    time: '20:30',
    group: 'earlier',
    status: 'completed',
    detail: '已完成 · 15 分钟',
    action: '复习一下',
    href: '/learn/py-basic-01/py-basic-01-c2-l8',
  },
]

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: '小禾', initial: '小', level: 5, hours: 12.5 },
  { rank: 2, name: '阿圆', initial: '阿', level: 4, hours: 11.2 },
  { rank: 3, name: '一颗栗子', initial: '一', level: 4, hours: 10.8 },
  { rank: 4, name: '慢慢学', initial: '慢', level: 3, hours: 9.6 },
  { rank: 5, name: '橙子同学', initial: '橙', level: 4, hours: 8.4 },
  { rank: 6, name: '小满', initial: '小', level: 3, hours: 7.8 },
  { rank: 7, name: '南瓜', initial: '南', level: 3, hours: 7.2 },
  { rank: 8, name: '木木', initial: '木', level: 3, hours: 6.9 },
  { rank: 9, name: '青山', initial: '青', level: 3, hours: 6.5 },
  { rank: 10, name: '小鱼', initial: '小', level: 2, hours: 6.1 },
]

export const currentUserRank: LeaderboardEntry = {
  rank: 28,
  name: '小林同学',
  initial: '林',
  level: 3,
  hours: 3.5,
  isMe: true,
}

export const allCoursesCount = courses.length
