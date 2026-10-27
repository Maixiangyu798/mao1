import type { Problem } from '@/types'

export const problems: Problem[] = [
  {
    id: 'p001',
    number: '#001',
    title: '问候语',
    difficulty: 'beginner',
    tags: ['字符串'],
    description: '奶蛙第一次见到你，想和你打个招呼。请用 print 输出一句「你好，奶蛙」。',
    task: '使用 print() 输出一句完整问候，注意中文逗号和文字都要放进引号里。',
    sampleInput: '无',
    sampleOutput: '你好，奶蛙',
    explanation: 'print() 会把括号里的内容打印到控制台，文字需要用引号包起来。',
    initialCode: '# 和奶蛙打个招呼吧\nprint("你好，奶蛙")\n',
    hints: ['print() 里要放一段文字。', '文字需要用双引号包起来。', '试试：print("你好，奶蛙")'],
    solution: 'print("你好，奶蛙")\n',
    solutionIdea: '直接把问候语作为字符串传给 print()，运行即可输出。',
  },
  {
    id: 'p002',
    number: '#002',
    title: '计算平均分',
    difficulty: 'beginner',
    tags: ['列表', '函数'],
    description:
      '奶蛙想知道这次小测的平均分。请补全 average(scores) 函数，接收一个非空分数列表，返回平均分，保留 1 位小数。',
    task: '尝试使用 sum() 求总和、len() 获取分数个数，再用 round() 保留一位小数。',
    sampleInput: '[80, 90, 100]',
    sampleOutput: '90.0',
    explanation: '(80 + 90 + 100) / 3 = 90.0',
    initialCode:
      'def average(scores):\n    # 请在这里补全代码\n    ...\n\n\nprint(average([80, 90, 100]))\n',
    hints: [
      '先想想平均数的计算方式：总和 ÷ 个数。',
      '可以用 sum(scores) 求总和，len(scores) 获取个数。',
      '把结果交给 round(value, 1) 保留一位小数。',
    ],
    solution:
      'def average(scores):\n    total = sum(scores)\n    count = len(scores)\n    return round(total / count, 1)\n',
    solutionIdea:
      '用 sum(scores) 求总和，len(scores) 获取数量；使用 / 计算平均值，最后用 round(value, 1) 保留 1 位小数。',
  },
  {
    id: 'p003',
    number: '#003',
    title: '猜数字',
    difficulty: 'intermediate',
    tags: ['条件', '循环'],
    description:
      '奶蛙心里想了一个 1–100 的数字。请补全 check_guess(secret, guess) 函数：猜大了返回「大了」，猜小了返回「小了」，猜对返回「猜对啦」。',
    task: '使用 if / elif / else 比较两个数字，返回对应的中文提示。',
    sampleInput: 'secret = 42, guess = 50',
    sampleOutput: '大了',
    explanation: '50 比 42 大，所以返回「大了」。',
    initialCode:
      'def check_guess(secret, guess):\n    # 比较 secret 与 guess\n    pass\n\n\nprint(check_guess(42, 50))\n',
    hints: [
      '先比较 guess 和 secret 的大小。',
      '使用 if / elif / else 处理三种情况。',
      '当 guess > secret 时，说明猜大了。',
    ],
    solution:
      'def check_guess(secret, guess):\n    if guess > secret:\n        return "大了"\n    elif guess < secret:\n        return "小了"\n    else:\n        return "猜对啦"\n',
    solutionIdea: '用三个分支覆盖「猜大 / 猜小 / 猜对」三种可能，并分别返回提示。',
  },
  {
    id: 'p004',
    number: '#004',
    title: '偶数求和',
    difficulty: 'beginner',
    tags: ['循环'],
    description: '计算 1 到 100 之间所有偶数的和，并输出结果。',
    task: '使用 range 与循环找出偶数，并累加到一个变量中。',
    sampleInput: '无',
    sampleOutput: '2550',
    explanation: '2 + 4 + ... + 100 = 2550。',
    initialCode: '# 计算 1 到 100 之间所有偶数的和\ntotal = 0\n# 在这里继续写\n\nprint(total)\n',
    hints: ['range(2, 101, 2) 可以直接生成偶数。', '用 for 循环把每个数累加到 total。', '最终输出 total 应等于 2550。'],
    solution: 'total = 0\nfor number in range(2, 101, 2):\n    total += number\nprint(total)\n',
    solutionIdea: 'range 的步长设为 2，从 2 遍历到 100，把每一项累加。',
  },
  {
    id: 'p005',
    number: '#005',
    title: '统计词频',
    difficulty: 'intermediate',
    tags: ['字典'],
    description:
      '给出一段用空格分隔的英文文本，统计每个单词出现的次数，并按单词首次出现的顺序输出。',
    task: '把单词作为字典的键，出现次数作为值；遍历时若已存在就加一。',
    sampleInput: 'frog code frog learn code frog',
    sampleOutput: 'frog: 3, code: 2, learn: 1',
    explanation: 'frog 出现了 3 次，code 2 次，learn 1 次。',
    initialCode:
      'text = "frog code frog learn code frog"\n# 试着用字典记录每个单词出现的次数\ncounts = {}\n\nprint(counts)\n',
    hints: ['用 text.split() 可以得到单词列表。', '判断单词是否已经在字典中。', 'counts[word] = counts.get(word, 0) + 1。'],
    solution:
      'text = "frog code frog learn code frog"\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(", ".join(f"{word}: {count}" for word, count in counts.items()))\n',
    solutionIdea: '字典适合做频次统计，get(word, 0) 可以在首次出现时给出默认值。',
  },
  {
    id: 'p006',
    number: '#006',
    title: '整理成绩单',
    difficulty: 'intermediate',
    tags: ['列表'],
    description: '给出一组学生成绩，筛选出 60 分及以上的成绩，并按从高到低输出。',
    task: '使用列表推导式筛选，再用 sorted(..., reverse=True) 排序。',
    sampleInput: '[72, 58, 91, 45, 86]',
    sampleOutput: '[91, 86, 72]',
    explanation: '去掉低于 60 的 58 和 45，剩下的成绩从高到低排序。',
    initialCode:
      'scores = [72, 58, 91, 45, 86]\n# 筛选及格成绩并排序\npassed = []\n\nprint(passed)\n',
    hints: ['可以用列表推导式筛选成绩。', '条件写 score >= 60。', '再用 sorted(passed, reverse=True) 排序。'],
    solution:
      'scores = [72, 58, 91, 45, 86]\npassed = sorted([score for score in scores if score >= 60], reverse=True)\nprint(passed)\n',
    solutionIdea: '筛选与排序可以分两步，也可以把筛选结果直接交给 sorted。',
  },
  {
    id: 'p007',
    number: '#007',
    title: '读取日记',
    difficulty: 'intermediate',
    tags: ['文件'],
    description: '打开一个文本文件，读取全部内容，并统计其中的字符数。',
    task: '使用 with open(...) as file 安全读取文件，用 len() 统计字符数。',
    sampleInput: 'diary.txt：今天也写了一点 Python。',
    sampleOutput: '共 11 个字符',
    explanation: '读取到的文本长度就是字符数，不含文件名。',
    initialCode:
      '# 在真实项目中，文件会由系统提供\ncontent = "今天也写了一点 Python。"\n# 统计字符数\n\nprint(content)\n',
    hints: ['len(content) 可以得到字符数。', '实际读取文件时使用 with open(path, encoding="utf-8") as f。', '输出格式为：共 N 个字符。'],
    solution:
      'content = "今天也写了一点 Python。"\nprint(f"共 {len(content)} 个字符")\n',
    solutionIdea: 'len() 可以用于字符串、列表等序列类型，这里统计的是字符数量。',
  },
  {
    id: 'p008',
    number: '#008',
    title: '迷你记账本',
    difficulty: 'challenge',
    tags: ['函数', '文件'],
    description: '实现一个小记账本：记录支出金额，计算总支出，并输出每一笔记录。',
    task: '使用列表保存多笔支出，编写 add_expense 与 total_expense 两个小函数。',
    sampleInput: '[12.5, 30, 8]',
    sampleOutput: '总支出：50.5 元',
    explanation: '12.5 + 30 + 8 = 50.5。',
    initialCode:
      'expenses = []\n\ndef add_expense(amount):\n    # 记录一笔支出\n    pass\n\ndef total_expense():\n    # 返回总支出\n    pass\n\n# 试着添加几笔支出并输出总额\n',
    hints: ['add_expense 里使用 expenses.append(amount)。', 'total_expense 用 sum(expenses) 求和。', '最后用 f-string 输出：总支出：{total} 元。'],
    solution:
      'expenses = []\n\ndef add_expense(amount):\n    expenses.append(amount)\n\ndef total_expense():\n    return sum(expenses)\n\nfor amount in [12.5, 30, 8]:\n    add_expense(amount)\n\nprint(f"总支出：{total_expense()} 元")\n',
    solutionIdea: '把业务动作拆成函数，列表负责存储，sum 负责汇总。',
  },
  {
    id: 'p009',
    number: '#009',
    title: '找出最长单词',
    difficulty: 'intermediate',
    tags: ['循环', '字符串'],
    description: '给出一句英文，找出其中长度最长的单词并输出。',
    task: '使用 split 拆分句子，遍历单词并记录最长的一个。',
    sampleInput: 'practice makes progress',
    sampleOutput: 'practice',
    explanation: 'practice 与 progress 都是 8 个字母，按首次出现取 practice。',
    initialCode:
      'sentence = "practice makes progress"\n# 找出最长的单词\nlongest = ""\n\nprint(longest)\n',
    hints: ['用 sentence.split() 得到单词列表。', '只有 len(word) > len(longest) 时才更新。', '注意保留首次出现的最长单词。'],
    solution:
      'sentence = "practice makes progress"\nlongest = ""\nfor word in sentence.split():\n    if len(word) > len(longest):\n        longest = word\nprint(longest)\n',
    solutionIdea: '维护一个当前最长单词，遍历时只在遇到更长单词时替换。',
  },
  {
    id: 'p010',
    number: '#010',
    title: '列表去重',
    difficulty: 'beginner',
    tags: ['列表'],
    description: '删除列表中的重复元素，并保持原有顺序。',
    task: '试试用循环加一个空列表，或者使用 dict.fromkeys。',
    sampleInput: '[1, 2, 2, 3, 1, 4]',
    sampleOutput: '[1, 2, 3, 4]',
    explanation: '重复的 1 和 2 只保留第一次出现的位置。',
    initialCode:
      'numbers = [1, 2, 2, 3, 1, 4]\n# 去重并保持原顺序\nresult = []\n\nprint(result)\n',
    hints: ['遍历 numbers，每个元素都要判断。', '如果元素不在 result 中，才把它添加进去。', '也可以用 list(dict.fromkeys(numbers))。'],
    solution: 'numbers = [1, 2, 2, 3, 1, 4]\nresult = list(dict.fromkeys(numbers))\nprint(result)\n',
    solutionIdea: '字典的键天然不重复，并会保留第一次插入的顺序。',
  },
  {
    id: 'p011',
    number: '#011',
    title: '生成密码',
    difficulty: 'intermediate',
    tags: ['字符串', '循环'],
    description: '从给定字符集中生成一个长度为 8 的随机密码。',
    task: '使用 random.choice 从候选字符中随机选择，并拼接成 8 位密码。',
    sampleInput: '无',
    sampleOutput: '例如：a7Kp2mQ9',
    explanation: '每次运行结果都可以不同，只要长度为 8 且来自字符集即可。',
    initialCode:
      'import random\n\ncharacters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"\npassword = ""\n\n# 生成 8 位密码\n\nprint(password)\n',
    hints: ['使用 for 循环重复 8 次。', 'random.choice(characters) 可以选出一个字符。', '把每次选出的字符拼接到 password。'],
    solution:
      'import random\n\ncharacters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"\npassword = "".join(random.choice(characters) for _ in range(8))\nprint(password)\n',
    solutionIdea: '循环 8 次调用 random.choice，再把字符连接起来。',
  },
  {
    id: 'p012',
    number: '#012',
    title: '班级成绩单',
    difficulty: 'challenge',
    tags: ['字典', '函数'],
    description: '给定学生与成绩的字典，输出平均分最高的学生姓名与分数。',
    task: '遍历字典，维护当前最高分与对应姓名。',
    sampleInput: '{"小林": 92, "阿圆": 88, "栗子": 95}',
    sampleOutput: '栗子：95',
    explanation: '栗子的分数 95 是全班最高。',
    initialCode:
      'scores = {"小林": 92, "阿圆": 88, "栗子": 95}\n# 找到最高分的学生\nbest_name = ""\nbest_score = 0\n\nprint(f"{best_name}：{best_score}")\n',
    hints: ['用 for name, score in scores.items() 遍历。', '如果 score > best_score，就同时更新姓名与分数。', '初始最高分可以设为 0。'],
    solution:
      'scores = {"小林": 92, "阿圆": 88, "栗子": 95}\nbest_name = ""\nbest_score = 0\nfor name, score in scores.items():\n    if score > best_score:\n        best_name = name\n        best_score = score\nprint(f"{best_name}：{best_score}")\n',
    solutionIdea: '一次遍历即可找到最大值，同时记录它对应的键。',
  },
]

export function getProblem(id: string | undefined) {
  return problems.find((problem) => problem.id === id)
}

export function getProblemIndex(id: string) {
  return problems.findIndex((problem) => problem.id === id)
}

export const problemTagOptions = ['全部', '变量', '字符串', '条件', '循环', '列表', '字典', '函数', '文件']

export const problemDifficultyOptions = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'challenge', label: '挑战' },
] as const
