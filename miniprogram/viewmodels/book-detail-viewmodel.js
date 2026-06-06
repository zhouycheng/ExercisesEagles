const questionBankRepository = require('../repositories/question-bank-repository.js')

const TEST_DURATION_VALUES = [5, 10, 15, 25, 35, 45]

function createQuestionCountValues(total) {
  const maxCount = Math.max(Number(total) || 0, 0)
  const desiredCount = Math.min(5, maxCount)
  const values = []

  if (!maxCount) {
    return values
  }

  const preferredValues = maxCount >= 50
    ? [5, 10, 20, 30, 50]
    : [5, 10, 20, 30, maxCount]

  preferredValues.forEach((value) => {
    addUniqueValue(values, Math.min(value, maxCount), maxCount)
  })

  for (let index = 1; values.length < desiredCount && index <= desiredCount; index += 1) {
    addUniqueValue(values, Math.round((maxCount * index) / desiredCount), maxCount)
  }

  for (let value = 1; values.length < desiredCount && value <= maxCount; value += 1) {
    addUniqueValue(values, value, maxCount)
  }

  return values.sort((left, right) => left - right)
}

function addUniqueValue(values, value, maxCount) {
  const normalizedValue = Math.max(Math.min(Math.round(value), maxCount), 1)

  if (values.indexOf(normalizedValue) === -1) {
    values.push(normalizedValue)
  }
}

function createSelectionOptions(values, selectedValue, suffix) {
  return values.map((value) => ({
    value,
    label: `${value}${suffix}`,
    active: value === selectedValue
  }))
}

function getDefaultQuestionCount(values) {
  if (values.indexOf(20) !== -1) {
    return 20
  }

  if (values.indexOf(10) !== -1) {
    return 10
  }

  return values.length ? values[0] : 0
}

function getInitialBookDetailViewData() {
  return {
    statusBarHeight: 0,
    book: null,
    routeLoadingVisible: false,
    routeLoadingTitle: '正在加载',
    routeLoadingDescription: '',
    configSheetVisible: false,
    configMode: 'draw',
    isConfigTestMode: false,
    configSheetTitle: '抽题开始',
    configSheetDescription: '',
    questionCountValues: [],
    questionCountOptions: [],
    selectedQuestionCount: 0,
    durationValues: TEST_DURATION_VALUES,
    durationOptions: createSelectionOptions(TEST_DURATION_VALUES, 10, '分钟'),
    selectedDuration: 10,
    configPrimaryText: '开始答题'
  }
}

class BookDetailViewModel {
  constructor(options) {
    const normalizedOptions = options || {}
    this.repository = normalizedOptions.repository || questionBankRepository
    this.state = getInitialBookDetailViewData()
  }

  static getInitialData() {
    return getInitialBookDetailViewData()
  }

  load(options, statusBarHeight) {
    const bookId = options && options.bookId ? decodeURIComponent(options.bookId) : ''
    const book = this.repository.getBookDetail(bookId) || this.repository.getFirstBookDetail()

    return this.updateState(Object.assign(getInitialBookDetailViewData(), {
      statusBarHeight,
      book
    }))
  }

  openChapter(chapter, mode, isOpeningQuiz, seed) {
    if (!chapter || !chapter.quizUrl || isOpeningQuiz) {
      return null
    }

    const quiz = this.repository.getChapterQuiz(chapter.bookId, chapter.id)

    if (!quiz || !quiz.questions.length) {
      return {
        command: {
          type: 'toast',
          title: '章节题库暂不可用'
        }
      }
    }

    const isViewMode = mode === 'view'
    const routeQuery = isViewMode
      ? 'mode=view'
      : `mode=normal&seed=${encodeURIComponent(seed || Date.now())}`

    return {
      command: {
        type: 'openRouteWithLoading',
        payload: {
          url: `${chapter.quizUrl}&${routeQuery}`,
          title: isViewMode ? '正在打开题目' : '正在装载题目',
          description: `${chapter.name} · ${quiz.questions.length} 题`
        }
      }
    }
  }

  openConfigSheet(mode) {
    const book = this.state.book

    if (!book || !book.questionCount) {
      return {
        command: {
          type: 'toast',
          title: '本书题库暂不可用'
        }
      }
    }

    const questionCountValues = createQuestionCountValues(book.questionCount)
    const selectedQuestionCount = getDefaultQuestionCount(questionCountValues)
    const selectedDuration = this.state.selectedDuration || 10
    const isTestMode = mode === 'test'

    return this.updateState({
      configSheetVisible: true,
      configMode: isTestMode ? 'test' : 'draw',
      isConfigTestMode: isTestMode,
      configSheetTitle: isTestMode ? '模拟测试' : '抽题开始',
      configSheetDescription: isTestMode ? `${book.name} · 选择题量和时长` : `${book.name} · 选择题量`,
      questionCountValues,
      selectedQuestionCount,
      questionCountOptions: createSelectionOptions(questionCountValues, selectedQuestionCount, '题'),
      selectedDuration,
      durationOptions: createSelectionOptions(TEST_DURATION_VALUES, selectedDuration, '分钟'),
      configPrimaryText: isTestMode ? '开始测试' : '开始答题'
    })
  }

  closeConfigSheet() {
    return this.updateState({
      configSheetVisible: false,
      isConfigTestMode: false
    })
  }

  selectQuestionCount(value) {
    const selectedQuestionCount = Number(value)

    if (!selectedQuestionCount) {
      return null
    }

    return this.updateState({
      selectedQuestionCount,
      questionCountOptions: createSelectionOptions(this.state.questionCountValues, selectedQuestionCount, '题')
    })
  }

  selectDuration(value) {
    const selectedDuration = Number(value)

    if (!selectedDuration) {
      return null
    }

    return this.updateState({
      selectedDuration,
      durationOptions: createSelectionOptions(this.state.durationValues, selectedDuration, '分钟')
    })
  }

  confirmConfigSheet(seed) {
    const book = this.state.book

    if (!book || !this.state.selectedQuestionCount) {
      return null
    }

    const isTestMode = this.state.configMode === 'test'
    const query = [
      `mode=${isTestMode ? 'test' : 'normal'}`,
      'scope=book',
      `bookId=${encodeURIComponent(book.id)}`,
      `count=${encodeURIComponent(this.state.selectedQuestionCount)}`,
      `seed=${encodeURIComponent(seed)}`
    ]

    if (isTestMode) {
      query.push(`duration=${encodeURIComponent(this.state.selectedDuration)}`)
    }

    return Object.assign(this.updateState({
      configSheetVisible: false
    }), {
      command: {
        type: 'openRouteWithLoading',
        payload: {
          url: `/page/quiz/index?${query.join('&')}`,
          title: isTestMode ? '正在生成测试' : '正在抽取题目',
          description: isTestMode
            ? `${book.name} · ${this.state.selectedQuestionCount} 题 · ${this.state.selectedDuration} 分钟`
            : `${book.name} · ${this.state.selectedQuestionCount} 题`
        }
      }
    })
  }

  closeRouteLoading() {
    return this.updateState({
      routeLoadingVisible: false
    })
  }

  getShareMessage() {
    const book = this.state.book

    return {
      title: book ? `${book.name}题库` : '题小鹰题库',
      path: book ? `/page/book-detail/index?bookId=${encodeURIComponent(book.id)}` : '/page/home/index'
    }
  }

  updateState(patch) {
    Object.assign(this.state, patch)
    return {
      data: patch
    }
  }
}

module.exports = {
  BookDetailViewModel,
  createQuestionCountValues,
  createSelectionOptions,
  getDefaultQuestionCount
}
