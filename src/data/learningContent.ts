import type { Chapter, Course, Lesson } from '@/types'

export interface LessonSection {
  title: string
  body?: string
  code?: string
}

export interface LessonContent {
  intro: string
  sections: LessonSection[]
  task: string
  goal: string
  hint: string
  initialCode: string
  estimatedMinutes: number
}

const primaryLessonContent: Record<string, LessonContent> = {
  'py-basic-01-c3-l2': {
    intro:
      '字符串可以存放文字。把两个字符串用 + 连接起来，就能组合出一句新的话，这叫作「字符串拼接」。',
    estimatedMinutes: 10,
    sections: [
      {
        title: '让奶蛙说声你好',
        body: '先用变量保存名字，再把问候语和名字连起来。注意：文字要放在引号里。',
        code: 'name = "奶蛙"\nprint("你好，" + name)',
      },
      {
        title: '空格也是字符串的一部分',
        body: '运行后，控制台会输出：你好，奶蛙。逗号后面的空格，也是字符串的一部分。想让结果更自然，就把空格留在引号里。',
      },
    ],
    task: '把 name 改成你自己的名字，输出「你好，」和你的名字。先运行看看，再提交给奶蛙检查。',
    goal: '使用 + 完成字符串拼接。',
    hint: 'print() 里左边的文字要用引号包起来，再用 + 把它和变量连接。',
    initialCode: '# 给自己写一句问候\nname = "奶蛙"\nprint("你好，" + name)\n\n# 写好以后，先运行看看吧\n',
  },
}

function genericContent(course: Course, chapter: Chapter | undefined, lesson: Lesson): LessonContent {
  const cleanTitle = lesson.title.replace(/^\d+(?:\.\d+)?\s*/, '')
  const chapterName = chapter?.title.replace(/^第\s*\d+\s*章\s*/, '') ?? course.title
  const isPractice = lesson.type === 'practice'

  return {
    intro: `这一节我们继续学习「${chapterName}」。${isPractice ? '别急着看答案，先自己动手试一遍。' : '先理解一个小概念，再用一行代码亲手验证它。'}`,
    estimatedMinutes: isPractice ? 12 : 8,
    sections: [
      {
        title: `认识「${cleanTitle}」`,
        body: '把知识放进一个很小的例子里，理解起来会轻松很多。先读一遍下面的代码，猜猜它会输出什么，然后再运行。',
        code: `message = "你好，${cleanTitle}"\nprint(message)`,
      },
      {
        title: '动手之前，先读一遍',
        body: '代码里的每一行都在做一件小事。遇到不熟悉的地方，可以在编辑器里改一改，再运行查看变化。',
      },
    ],
    task: isPractice
      ? `完成本节关于「${cleanTitle}」的动手任务。可以先运行示例，再按自己的想法修改代码。`
      : `运行右侧示例代码，并尝试修改文字内容，观察输出发生了什么变化。`,
    goal: isPractice ? '独立完成本节练习并运行通过。' : '理解本节示例代码的含义。',
    hint: '先检查引号、括号和缩进，再运行一次。奶蛙觉得，报错只是在告诉你下一步该看哪里。',
    initialCode: `# ${cleanTitle}\n# 先运行看看，再试着改成你自己的内容\nmessage = "你好，${cleanTitle}"\nprint(message)\n`,
  }
}

export function getLessonContent(course: Course, lesson: Lesson): LessonContent {
  const authored = primaryLessonContent[lesson.id]
  if (authored) return authored
  const chapter = course.chapters.find((item) => item.id === lesson.chapterId)
  return genericContent(course, chapter, lesson)
}
