import type { Category, Chapter, Course, Difficulty, Lesson, LessonType } from '@/types'

interface LessonSeed {
  title: string
  type?: LessonType
}

interface CourseSeed
  extends Omit<Course, 'chapters' | 'id' | 'categoryLabel' | 'eyebrow' | 'icon'> {
  id: string
  chapters: { title: string; lessons: LessonSeed[] }[]
  icon: Course['icon']
  eyebrow: string
}

const categoryLabels: Record<Category, string> = {
  basic: '基础语法',
  office: '办公自动化',
  data: '数据分析',
  fun: '趣味编程',
}

const lessonId = (courseId: string, chapterIndex: number, lessonIndex: number) =>
  `${courseId}-c${chapterIndex + 1}-l${lessonIndex + 1}`

function buildChapters(courseId: string, seeds: CourseSeed['chapters']): Chapter[] {
  return seeds.map((chapter, chapterIndex) => {
    const chapterId = `${courseId}-c${chapterIndex + 1}`
    const lessons: Lesson[] = chapter.lessons.map((lesson, lessonIndex) => ({
      id: lessonId(courseId, chapterIndex, lessonIndex),
      chapterId,
      title: lesson.title,
      type: lesson.type ?? (lessonIndex === chapter.lessons.length - 1 ? 'practice' : 'theory'),
      order: lessonIndex,
    }))
    return {
      id: chapterId,
      title: chapter.title,
      lessons,
    }
  })
}

/**
 * Generate a coherent outline for secondary courses where the prototype only
 * needs a browsable course tree. The primary course below is fully authored.
 */
function genericChapters(
  courseId: string,
  totalLessons: number,
  chapterTitles: string[],
  topic: string,
): Chapter[] {
  const base = Math.floor(totalLessons / chapterTitles.length)
  const remainder = totalLessons % chapterTitles.length
  const chapterSeeds = chapterTitles.map((title, chapterIndex) => {
    const count = base + (chapterIndex < remainder ? 1 : 0)
    const shortTitle = title.replace(/^第[一二三四五六七八九十]+章\s*/, '')
    const templates = [
      `认识${shortTitle}`,
      `${shortTitle} · 核心概念`,
      `${shortTitle} · 动手实践`,
      `${shortTitle} · 巩固练习`,
      `${shortTitle} · 常见问题`,
      `${shortTitle} · 章节挑战`,
      `${topic}小练习 ${chapterIndex + 1}-${4}`,
    ]
    const lessons: LessonSeed[] = Array.from({ length: count }, (_, index) => ({
      title: templates[index % templates.length],
      type: index === count - 1 ? 'practice' : 'theory',
    }))
    return { title, lessons }
  })
  return buildChapters(courseId, chapterSeeds)
}

const pyBasicSeeds: CourseSeed['chapters'] = [
  {
    title: '第 1 章 你好，Python',
    lessons: [
      { title: '1.1 安装？不用！浏览器就能写' },
      { title: '1.2 第一行 print 代码' },
      { title: '1.3 认识代码与注释' },
      { title: '1.4 常见标点与缩进' },
      { title: '1.5 用 input 听听你的名字' },
      { title: '1.6 看懂第一条报错' },
      { title: '1.7 变量是什么' },
      { title: '1.8 数字与文字的区别' },
      { title: '1.9 章节小练习：自我介绍', type: 'practice' },
    ],
  },
  {
    title: '第 2 章 变量与数据类型',
    lessons: [
      { title: '2.1 变量命名这件小事' },
      { title: '2.2 整数、浮点数和字符串' },
      { title: '2.3 type() 帮你认清类型' },
      { title: '2.4 数字运算与优先级' },
      { title: '2.5 字符串索引与切片' },
      { title: '2.6 类型转换：str、int、float' },
      { title: '2.7 用 f-string 做一张名片' },
      { title: '2.8 数据类型小练习' },
      { title: '2.9 编程习惯：让代码可读' },
      { title: '2.10 章节练习：个人资料卡', type: 'practice' },
    ],
  },
  {
    title: '第 3 章 字符串，让代码开口说话',
    lessons: [
      { title: '3.1 认识字符串' },
      { title: '3.2 用字符串拼接出一句问候', type: 'practice' },
      { title: '3.3 字符串的常用方法' },
      { title: '3.4 章节练习：个人名片', type: 'practice' },
      { title: '3.5 小结：把文字组织好' },
    ],
  },
  {
    title: '第 4 章 条件与循环',
    lessons: [
      { title: '4.1 if：让程序做选择' },
      { title: '4.2 for：把重复交给循环' },
      { title: '4.3 while 与退出条件' },
      { title: '4.4 章节练习：猜数字', type: 'practice' },
    ],
  },
  {
    title: '第 5 章 函数与文件',
    lessons: [{ title: '5.1 def：把代码装进函数' }, { title: '5.2 读写一个文本文件' }],
  },
  {
    title: '第 6 章 我的第一个 Python 项目',
    lessons: [
      { title: '6.1 项目拆解：待办清单' },
      { title: '6.2 项目实战与结课' },
    ],
  },
]

const seeds: CourseSeed[] = [
  {
    id: 'py-basic-01',
    title: 'Python 零基础入门',
    eyebrow: 'PYTHON / 起步',
    icon: 'terminal',
    description: '从 print 开始，学会写你的第一个程序',
    category: 'basic',
    difficulty: 'beginner',
    lessonCount: 32,
    durationMinutes: 480,
    learnerCount: 12000,
    rating: 4.9,
    outcomes: [
      '变量与基础数据类型',
      '条件判断与循环',
      '函数与代码复用',
      '文件读取与写入',
      '独立完成一个小项目',
    ],
    audience: ['没有编程经验，想从零开始', '希望系统掌握 Python 基础', '想用代码解决生活中的小问题'],
    chapters: pyBasicSeeds,
  },
  {
    id: 'office-auto-01',
    title: '办公自动化',
    eyebrow: 'PYTHON / 探索',
    icon: 'folder',
    description: '让重复工作，自动完成',
    category: 'office',
    difficulty: 'intermediate',
    lessonCount: 18,
    durationMinutes: 360,
    learnerCount: 8000,
    rating: 4.8,
    outcomes: ['批量处理 Excel 文件', '自动整理桌面文件', '批量生成文档', '把流程写成脚本'],
    audience: ['经常处理表格与文件的职场人', '想减少机械重复工作', '已经会一点 Python 基础'],
    chapters: genericChapters(
      'office-auto-01',
      18,
      ['第 1 章 文件与目录', '第 2 章 Excel 自动化', '第 3 章 文档与邮件', '第 4 章 综合自动化'],
      '办公自动化',
    ),
  },
  {
    id: 'data-analysis-01',
    title: '数据分析基础',
    eyebrow: 'PYTHON / 探索',
    icon: 'chart',
    description: '从一份数据，发现答案',
    category: 'data',
    difficulty: 'intermediate',
    lessonCount: 24,
    durationMinutes: 600,
    learnerCount: 6500,
    rating: 4.9,
    outcomes: ['读懂一份数据表', '用 Pandas 清洗数据', '完成基础统计分析', '用图表讲清结论'],
    audience: ['想入门数据分析的初学者', '需要处理业务数据', '具备 Python 基础语法能力'],
    chapters: genericChapters(
      'data-analysis-01',
      24,
      ['第 1 章 数据思维', '第 2 章 Pandas 入门', '第 3 章 清洗与统计', '第 4 章 洞察与表达'],
      '数据分析',
    ),
  },
  {
    id: 'game-python-01',
    title: '游戏编程入门',
    eyebrow: 'PYTHON / 创造',
    icon: 'gamepad',
    description: '做一个属于自己的小游戏',
    category: 'fun',
    difficulty: 'challenge',
    lessonCount: 20,
    durationMinutes: 480,
    learnerCount: 3200,
    rating: 4.7,
    outcomes: ['理解游戏循环', '控制角色移动', '处理碰撞与得分', '完成一个可玩的游戏'],
    audience: ['对游戏开发好奇的初学者', '学完 Python 基础语法', '愿意动手调试与尝试'],
    chapters: genericChapters(
      'game-python-01',
      20,
      ['第 1 章 游戏循环', '第 2 章 角色与输入', '第 3 章 碰撞与计分', '第 4 章 发布小游戏'],
      '游戏开发',
    ),
  },
  {
    id: 'py-grammar-01',
    title: 'Python 语法练习册',
    eyebrow: 'PYTHON / 起步',
    icon: 'pen',
    description: '多写一遍，就多懂一点',
    category: 'basic',
    difficulty: 'beginner',
    lessonCount: 16,
    durationMinutes: 240,
    learnerCount: 4500,
    rating: 4.8,
    outcomes: ['巩固基础语法', '熟悉常见代码结构', '提升阅读代码能力', '完成 16 个语法练习'],
    audience: ['刚学完基础语法', '想通过练习巩固知识', '希望建立写代码的手感'],
    chapters: genericChapters(
      'py-grammar-01',
      16,
      ['第 1 章 表达式与变量', '第 2 章 字符串与列表', '第 3 章 条件与循环', '第 4 章 函数小练'],
      '语法',
    ),
  },
  {
    id: 'list-dict-01',
    title: '列表与字典',
    eyebrow: 'PYTHON / 起步',
    icon: 'list',
    description: '把数据整理得井井有条',
    category: 'basic',
    difficulty: 'beginner',
    lessonCount: 12,
    durationMinutes: 180,
    learnerCount: 3800,
    rating: 4.7,
    outcomes: ['创建与遍历列表', '掌握常用列表方法', '用字典组织键值数据', '完成通讯录小练习'],
    audience: ['需要处理一组数据', '对 Python 集合类型不熟悉', '想写更实用的程序'],
    chapters: genericChapters(
      'list-dict-01',
      12,
      ['第 1 章 列表基础', '第 2 章 字典基础', '第 3 章 综合练习'],
      '数据结构',
    ),
  },
  {
    id: 'file-basics-01',
    title: '文件处理小课堂',
    eyebrow: 'PYTHON / 起步',
    icon: 'file',
    description: '读取、整理、保存你的文件',
    category: 'basic',
    difficulty: 'beginner',
    lessonCount: 10,
    durationMinutes: 180,
    learnerCount: 2600,
    rating: 4.6,
    outcomes: ['打开与读取文件', '安全写入文件', '处理 CSV 数据', '批量整理文件'],
    audience: ['想把文件处理自动化', '掌握基础循环与函数', '希望提升工作效率'],
    chapters: genericChapters(
      'file-basics-01',
      10,
      ['第 1 章 文件读写', '第 2 章 文件整理'],
      '文件处理',
    ),
  },
  {
    id: 'func-module-01',
    title: '函数与模块',
    eyebrow: 'PYTHON / 起步',
    icon: 'function',
    description: '让代码变得更有条理',
    category: 'basic',
    difficulty: 'intermediate',
    lessonCount: 14,
    durationMinutes: 240,
    learnerCount: 5400,
    rating: 4.8,
    outcomes: ['定义可复用函数', '理解参数与返回值', '拆分和组织模块', '写出更整洁的程序'],
    audience: ['代码开始变长时感到吃力', '想理解函数式拆分', '准备进入项目实战'],
    chapters: genericChapters(
      'func-module-01',
      14,
      ['第 1 章 函数基础', '第 2 章 参数与作用域', '第 3 章 模块化'],
      '函数',
    ),
  },
  {
    id: 'excel-auto-01',
    title: 'Excel 自动化实战',
    eyebrow: 'PYTHON / 探索',
    icon: 'excel',
    description: '把时间留给更重要的事',
    category: 'office',
    difficulty: 'intermediate',
    lessonCount: 12,
    durationMinutes: 300,
    learnerCount: 3100,
    rating: 4.8,
    outcomes: ['读取多个工作表', '自动汇总数据', '批量生成报表', '定时处理表格'],
    audience: ['每天都要整理报表', '熟悉 Excel 基本操作', '会基础 Python 语法'],
    chapters: genericChapters(
      'excel-auto-01',
      12,
      ['第 1 章 openpyxl 入门', '第 2 章 数据汇总', '第 3 章 报表自动化'],
      'Excel 自动化',
    ),
  },
  {
    id: 'data-viz-01',
    title: '数据可视化入门',
    eyebrow: 'PYTHON / 探索',
    icon: 'pie',
    description: '用图表讲一个数据故事',
    category: 'data',
    difficulty: 'intermediate',
    lessonCount: 16,
    durationMinutes: 360,
    learnerCount: 4200,
    rating: 4.8,
    outcomes: ['选择合适图表', '绘制折线图与柱状图', '调整配色与标注', '完成一份可视化报告'],
    audience: ['需要展示数据结论', '会使用 Python 基础库', '想提升图表表达能力'],
    chapters: genericChapters(
      'data-viz-01',
      16,
      ['第 1 章 图表语法', '第 2 章 常用图表', '第 3 章 配色与标注', '第 4 章 数据故事'],
      '数据可视化',
    ),
  },
  {
    id: 'text-analysis-01',
    title: '文本分析小项目',
    eyebrow: 'PYTHON / 创造',
    icon: 'text',
    description: '在文字中找到规律',
    category: 'data',
    difficulty: 'challenge',
    lessonCount: 10,
    durationMinutes: 240,
    learnerCount: 1800,
    rating: 4.7,
    outcomes: ['清洗文本数据', '分词与词频统计', '提取关键词', '完成文本分析小项目'],
    audience: ['对自然语言处理好奇', '具备 Python 与数据处理基础', '希望完成一个完整项目'],
    chapters: genericChapters(
      'text-analysis-01',
      10,
      ['第 1 章 文本预处理', '第 2 章 词频与关键词', '第 3 章 项目实战'],
      '文本分析',
    ),
  },
  {
    id: 'my-game-01',
    title: '我的第一个小游戏',
    eyebrow: 'PYTHON / 创造',
    icon: 'blocks',
    description: '用代码创造一点快乐',
    category: 'fun',
    difficulty: 'challenge',
    lessonCount: 12,
    durationMinutes: 300,
    learnerCount: 2400,
    rating: 4.6,
    outcomes: ['完成游戏策划', '实现核心交互', '添加画面与音效', '发布并分享作品'],
    audience: ['想做出看得见的作品', '已掌握基础语法', '喜欢在动手中学习'],
    chapters: genericChapters(
      'my-game-01',
      12,
      ['第 1 章 玩法设计', '第 2 章 核心交互', '第 3 章 打磨与发布'],
      '小游戏',
    ),
  },
]

export const courses: Course[] = seeds.map(({ chapters: chapterSeeds, ...course }) => ({
  ...course,
  categoryLabel: categoryLabels[course.category],
  chapters: buildChapters(course.id, chapterSeeds),
}))

export const categoryOptions: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'basic', label: '基础语法' },
  { value: 'office', label: '办公自动化' },
  { value: 'data', label: '数据分析' },
  { value: 'fun', label: '趣味编程' },
]

export const difficultyOptions: { value: 'all' | Difficulty; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'challenge', label: '挑战' },
]

export const statusOptions: { value: 'all' | 'not_started' | 'learning' | 'completed'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'not_started', label: '未开始' },
  { value: 'learning', label: '学习中' },
  { value: 'completed', label: '已完成' },
]

export const difficultyMeta: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: '入门', className: 'tag-beginner' },
  intermediate: { label: '进阶', className: 'tag-intermediate' },
  challenge: { label: '挑战', className: 'tag-challenge' },
}

export function getCourse(courseId: string | undefined) {
  return courses.find((course) => course.id === courseId)
}

export function flattenLessons(course: Course): Lesson[] {
  return course.chapters.flatMap((chapter) => chapter.lessons)
}

export function getLesson(course: Course, lessonId: string | undefined): Lesson | undefined {
  return flattenLessons(course).find((lesson) => lesson.id === lessonId)
}

export function getAdjacentLesson(course: Course, lessonId: string, direction: -1 | 1) {
  const lessons = flattenLessons(course)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  if (index < 0) return undefined
  return lessons[index + direction]
}

export function courseDuration(minutes: number) {
  if (minutes < 60) return `约 ${minutes} 分钟`
  const hours = minutes / 60
  return `约 ${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`
}
