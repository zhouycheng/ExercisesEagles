const manifest = require('../data/question-banks/manifest.js')

const BOOK_UI = {
  'book-college-chinese': {
    cover: '/image/book-cover/chinese.jpg',
    order: 10,
    description: '题库内容覆盖章节练习与文学常识，适合课前预习和课后复习。'
  },
  'book-college-english': {
    cover: '/image/book-cover/english.jpg',
    order: 20,
    description: '题库内容覆盖单元练习与基础巩固，适合阶段性自测。'
  },
  'book-mental-health': {
    cover: '/image/book-cover/mental-health.jpg',
    order: 30,
    description: '题库内容覆盖大学生活适应、自我认知和心理调适，适合日常复习。'
  }
}

const DEFAULT_COVER = '/image/book-cover/chinese.jpg'
const CHINESE_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const OPTION_CODES = ['A', 'B', 'C', 'D']
const CHAPTER_BANK_LOADERS = {
  'book-college-chinese:ch-001': () => require('../data/question-banks/college-chinese-ch001.js'),
  'book-college-chinese:ch-002': () => require('../data/question-banks/college-chinese-ch002.js'),
  'book-college-chinese:ch-003': () => require('../data/question-banks/college-chinese-ch003.js'),
  'book-college-chinese:ch-004': () => require('../data/question-banks/college-chinese-ch004.js'),
  'book-college-chinese:ch-005': () => require('../data/question-banks/college-chinese-ch005.js'),
  'book-college-chinese:ch-006': () => require('../data/question-banks/college-chinese-ch006.js'),
  'book-college-chinese:ch-007': () => require('../data/question-banks/college-chinese-ch007.js'),
  'book-college-chinese:ch-008': () => require('../data/question-banks/college-chinese-ch008.js'),
  'book-college-chinese:ch-009': () => require('../data/question-banks/college-chinese-ch009.js'),
  'book-college-chinese:ch-010': () => require('../data/question-banks/college-chinese-ch010.js'),
  'book-college-chinese:ch-011': () => require('../data/question-banks/college-chinese-ch011.js'),
  'book-mental-health:ch-001': () => require('../data/question-banks/mental-health-ch001.js'),
  'book-mental-health:ch-002': () => require('../data/question-banks/mental-health-ch002.js'),
  'book-mental-health:ch-003': () => require('../data/question-banks/mental-health-ch003.js'),
  'book-mental-health:ch-004': () => require('../data/question-banks/mental-health-ch004.js'),
  'book-mental-health:ch-005': () => require('../data/question-banks/mental-health-ch005.js'),
  'book-mental-health:ch-006': () => require('../data/question-banks/mental-health-ch006.js'),
  'book-mental-health:ch-007': () => require('../data/question-banks/mental-health-ch007.js'),
  'book-college-english:ch-001': () => require('../data/question-banks/college-english-ch001.js'),
  'book-college-english:ch-002': () => require('../data/question-banks/college-english-ch002.js'),
  'book-college-english:ch-003': () => require('../data/question-banks/college-english-ch003.js')
}

function getRawBooks() {
  return Array.isArray(manifest.books) ? manifest.books : []
}

function getBookSummaries() {
  return getRawBooks()
    .map((book, index) => normalizeBookSummary(book, index))
    .sort((left, right) => left.order - right.order)
}

function getBookDetail(bookId) {
  const rawBooks = getRawBooks()
  const bookIndex = rawBooks.findIndex((book) => book.id === bookId)

  if (bookIndex < 0) {
    return null
  }

  return normalizeBookDetail(rawBooks[bookIndex], bookIndex)
}

function getFirstBookDetail() {
  const firstBook = getBookSummaries()[0]
  return firstBook ? getBookDetail(firstBook.id) : null
}

function getChapterQuiz(bookId, chapterId) {
  const located = findChapter(bookId, chapterId)
  const loadBank = located ? CHAPTER_BANK_LOADERS[getChapterBankKey(bookId, chapterId)] : null
  const bank = loadBank ? loadBank() : null

  if (!located || !bank) {
    return null
  }

  return normalizeChapterQuiz(located.book, located.chapter, located.chapterIndex, bank)
}

function getBookQuiz(bookId) {
  const book = getRawBooks().find((item) => item.id === bookId)

  if (!book) {
    return null
  }

  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  const questions = chapters.reduce((items, chapter) => {
    const quiz = getChapterQuiz(book.id, chapter.id)
    return quiz ? items.concat(quiz.questions) : items
  }, [])

  return {
    bookId: book.id,
    bookName: book.name,
    chapterId: '',
    chapterName: '全书抽题',
    chapterLabel: '',
    title: `${book.name} - 全书抽题`,
    sharePath: getBookQuizUrl(book.id),
    storageKey: `quizBestScore:${book.id}:book`,
    questions
  }
}

function getBookDrawQuiz(bookId, count, seed) {
  const quiz = getBookQuiz(bookId)

  if (!quiz) {
    return null
  }

  const questionCount = normalizePositiveInteger(count, quiz.questions.length)
  const selectedQuestions = shuffleQuestions(quiz.questions, seed).slice(0, questionCount)

  return Object.assign({}, quiz, {
    title: `${quiz.bookName} - 抽题练习`,
    sharePath: getBookQuizUrl(bookId, {
      count: questionCount,
      seed
    }),
    storageKey: `quizBestScore:${bookId}:book:${questionCount}`,
    questions: selectedQuestions
  })
}

function getFirstChapterQuiz() {
  const books = getRawBooks()

  for (let bookIndex = 0; bookIndex < books.length; bookIndex += 1) {
    const chapters = Array.isArray(books[bookIndex].chapters) ? books[bookIndex].chapters : []

    for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex += 1) {
      const quiz = getChapterQuiz(books[bookIndex].id, chapters[chapterIndex].id)

      if (quiz && quiz.questions.length > 0) {
        return quiz
      }
    }
  }

  return null
}

function normalizeBookSummary(book, index) {
  const ui = BOOK_UI[book.id] || {}

  return {
    id: book.id,
    name: book.name,
    cover: ui.cover || DEFAULT_COVER,
    order: typeof ui.order === 'number' ? ui.order : 1000 + index,
    detailUrl: getBookDetailUrl(book.id)
  }
}

function normalizeBookDetail(book, index) {
  const ui = BOOK_UI[book.id] || {}
  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  const normalizedChapters = chapters.map((chapter, chapterIndex) => normalizeChapter(book, chapter, chapterIndex))
  const questionCount = normalizedChapters.reduce((total, chapter) => total + chapter.questionCount, 0)

  return {
    id: book.id,
    name: book.name,
    cover: ui.cover || DEFAULT_COVER,
    description: ui.description || '题库内容来自已发布运行态题库，教材版本信息后续可补充。',
    order: typeof ui.order === 'number' ? ui.order : 1000 + index,
    detailUrl: getBookDetailUrl(book.id),
    chapterCount: normalizedChapters.length,
    questionCount,
    chapterBadgeText: `${normalizedChapters.length} 章节`,
    questionBadgeText: `${questionCount} 题目`,
    chapters: normalizedChapters
  }
}

function normalizeChapter(book, chapter, index) {
  const groups = Array.isArray(chapter.groups) ? chapter.groups : []
  const groupNames = groups.map((group) => group.name).filter(Boolean)

  return {
    id: chapter.id,
    bookId: book.id,
    name: chapter.name,
    label: formatChapterLabel(index),
    questionCount: Number(chapter.questionCount) || 0,
    groups,
    groupSummary: groupNames.length ? groupNames.join('/') : '章节练习',
    description: `含 ${Number(chapter.questionCount) || 0} 道 ${groupNames.length ? groupNames.join('/') : '章节练习'}`,
    quizUrl: getChapterQuizUrl(book.id, chapter.id)
  }
}

function normalizeChapterQuiz(book, chapter, chapterIndex, bank) {
  const groups = Array.isArray(bank.groups) ? bank.groups : []
  const questions = groups.reduce((items, group) => {
    const groupQuestions = Array.isArray(group.questions) ? group.questions : []
    return items.concat(groupQuestions.map((question) => normalizeQuizQuestion(question, group)))
  }, [])

  const title = `${book.name} - ${chapter.name}`

  return {
    bookId: book.id,
    bookName: book.name,
    chapterId: chapter.id,
    chapterName: chapter.name,
    chapterLabel: formatChapterLabel(chapterIndex),
    title,
    sharePath: getChapterQuizUrl(book.id, chapter.id),
    storageKey: `quizBestScore:${book.id}:${chapter.id}`,
    questions
  }
}

function normalizeQuizQuestion(question, group) {
  const answerKeys = Array.isArray(question.answerKeys) ? question.answerKeys.filter(Boolean) : []
  const options = Array.isArray(question.options) ? question.options : []
  const normalizedOptions = options.map((option, optionIndex) => ({
    key: option.key,
    code: option.keyLabel || option.key || getOptionCode(optionIndex),
    text: option.text || ''
  }))
  const correctIndexes = answerKeys.map((answerKey) => normalizedOptions.findIndex((option) => option.key === answerKey))
    .filter((index) => index >= 0)

  return {
    id: question.questionId,
    groupName: group.name,
    questionType: question.questionType || (answerKeys.length > 1 ? 'multiple' : 'single'),
    prompt: question.stem,
    options: normalizedOptions,
    answerKeys,
    answerIndexes: correctIndexes,
    answerIndex: correctIndexes.length ? correctIndexes[0] : -1,
    isMultiple: answerKeys.length > 1 || question.questionType === 'multiple',
    explanation: question.explanation || ''
  }
}

function findChapter(bookId, chapterId) {
  const books = getRawBooks()

  for (let bookIndex = 0; bookIndex < books.length; bookIndex += 1) {
    const book = books[bookIndex]

    if (book.id !== bookId) {
      continue
    }

    const chapters = Array.isArray(book.chapters) ? book.chapters : []
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId)

    if (chapterIndex >= 0) {
      return {
        book,
        chapter: chapters[chapterIndex],
        chapterIndex
      }
    }
  }

  return null
}

function formatChapterLabel(index) {
  return `第${toChineseNumber(index + 1)}章`
}

function getBookDetailUrl(bookId) {
  return `/page/book-detail/index?bookId=${encodeURIComponent(bookId)}`
}

function getChapterQuizUrl(bookId, chapterId) {
  return `/page/quiz/index?bookId=${encodeURIComponent(bookId)}&chapterId=${encodeURIComponent(chapterId)}`
}

function getBookQuizUrl(bookId, options) {
  const query = [`scope=book`, `bookId=${encodeURIComponent(bookId)}`]
  const normalizedOptions = options || {}

  if (normalizedOptions.count) {
    query.push(`count=${encodeURIComponent(normalizedOptions.count)}`)
  }

  if (normalizedOptions.seed) {
    query.push(`seed=${encodeURIComponent(normalizedOptions.seed)}`)
  }

  return `/page/quiz/index?${query.join('&')}`
}

function getChapterBankKey(bookId, chapterId) {
  return `${bookId}:${chapterId}`
}

function normalizePositiveInteger(value, fallback) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return Math.max(Number(fallback) || 0, 0)
  }

  return Math.min(Math.floor(parsed), Math.max(Number(fallback) || 0, 0))
}

function shuffleQuestions(questions, seed) {
  const items = Array.isArray(questions) ? questions.slice() : []
  const random = createSeededRandom(seed || Date.now())

  for (let index = items.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1))
    const current = items[index]
    items[index] = items[nextIndex]
    items[nextIndex] = current
  }

  return items
}

function createSeededRandom(seed) {
  let state = hashSeed(seed)

  return function random() {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function hashSeed(seed) {
  const text = String(seed || '')
  let hash = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0
  }

  return hash >>> 0
}

function getOptionCode(index) {
  if (OPTION_CODES[index]) {
    return OPTION_CODES[index]
  }

  let current = index
  let code = ''

  do {
    code = String.fromCharCode(65 + (current % 26)) + code
    current = Math.floor(current / 26) - 1
  } while (current >= 0)

  return code
}

function toChineseNumber(number) {
  if (number <= 10) {
    return number === 10 ? '十' : CHINESE_DIGITS[number]
  }

  if (number < 20) {
    return `十${CHINESE_DIGITS[number - 10]}`
  }

  const tens = Math.floor(number / 10)
  const ones = number % 10
  return `${CHINESE_DIGITS[tens]}十${ones ? CHINESE_DIGITS[ones] : ''}`
}

module.exports = {
  getBookSummaries,
  getBookDetail,
  getFirstBookDetail,
  getChapterQuiz,
  getBookQuiz,
  getBookDrawQuiz,
  getFirstChapterQuiz,
  formatChapterLabel
}
