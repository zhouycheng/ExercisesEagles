const questionBankRepository = require('../repositories/question-bank-repository.js')
const {
  DEFAULT_TEST_DURATION_MINUTES,
  QUIZ_MODES,
  QuizSession,
  getInitialQuizViewData,
  normalizeQuizMode,
  parsePositiveInteger
} = require('../models/quiz-session.js')

function decodeOptionValue(value) {
  return value ? decodeURIComponent(value) : ''
}

function createNullStorage() {
  return {
    get() {
      return 0
    },

    set() {}
  }
}

class QuizViewModel {
  constructor(options) {
    const normalizedOptions = options || {}
    this.repository = normalizedOptions.repository || questionBankRepository
    this.storage = normalizedOptions.storage || createNullStorage()
    this.session = null
  }

  static getInitialData() {
    return getInitialQuizViewData()
  }

  load(options) {
    const normalizedOptions = options || {}
    const quizMode = normalizeQuizMode(decodeOptionValue(normalizedOptions.mode))
    const quiz = this.getQuizFromOptions(normalizedOptions, quizMode)
    const isViewMode = quizMode === QUIZ_MODES.VIEW
    const durationMinutes = parsePositiveInteger(normalizedOptions.duration, DEFAULT_TEST_DURATION_MINUTES)
    const storageKey = quiz && !isViewMode ? this.getStorageKey(quiz, quizMode, durationMinutes) : ''
    const bestScore = storageKey ? this.storage.get(storageKey) || 0 : 0

    this.session = new QuizSession({
      quiz,
      quizMode,
      durationMinutes,
      storageKey,
      bestScore,
      quizPath: this.getSharePathFromOptions(normalizedOptions, quiz)
    })
    const resetResult = this.session.reset()

    return {
      data: this.session.getViewData(),
      measureQuestion: true,
      startTimer: !!resetResult.startTimer,
      stopTimer: true
    }
  }

  reset() {
    if (!this.session) {
      return null
    }

    return this.session.reset()
  }

  getShareMessage() {
    if (!this.session) {
      return {
        title: '题小鹰答题',
        path: '/page/quiz/index'
      }
    }

    return this.session.getShareMessage()
  }

  updateTimer(timerSeconds) {
    if (!this.session) {
      return null
    }

    return this.session.updateTimer(timerSeconds)
  }

  autoSubmitQuiz() {
    if (!this.session) {
      return null
    }

    return this.withPersistence(this.session.autoSubmitQuiz())
  }

  selectOption(selectedIndex) {
    if (!this.session) {
      return null
    }

    return this.session.selectOption(selectedIndex)
  }

  toggleFavoriteQuestion() {
    if (!this.session) {
      return null
    }

    return this.session.toggleFavoriteQuestion()
  }

  goNext() {
    if (!this.session) {
      return null
    }

    return this.withPersistence(this.session.goNext())
  }

  goPrev() {
    if (!this.session) {
      return null
    }

    return this.session.goPrev()
  }

  submitQuiz() {
    if (!this.session) {
      return null
    }

    return this.withPersistence(this.session.submitQuiz())
  }

  closeSubmitModal() {
    if (!this.session) {
      return null
    }

    return this.session.closeSubmitModal()
  }

  openPaperOverview() {
    if (!this.session) {
      return null
    }

    return this.session.openPaperOverview()
  }

  closeQuestionOverview() {
    if (!this.session) {
      return null
    }

    return this.session.closeQuestionOverview()
  }

  jumpToQuestion(index) {
    if (!this.session) {
      return null
    }

    return this.session.jumpToQuestion(index)
  }

  forceSubmitQuiz() {
    if (!this.session) {
      return null
    }

    return this.withPersistence(this.session.forceSubmitQuiz())
  }

  getQuizFromOptions(options, quizMode) {
    const bookId = decodeOptionValue(options && options.bookId)
    const chapterId = decodeOptionValue(options && options.chapterId)
    const scope = decodeOptionValue(options && options.scope)

    if (scope === 'book') {
      return this.repository.getBookDrawQuiz(bookId, options && options.count, decodeOptionValue(options && options.seed)) ||
        this.repository.getFirstChapterQuiz()
    }

    const seed = decodeOptionValue(options && options.seed)
    const chapterQuizOptions = quizMode === QUIZ_MODES.VIEW ? null : {
      shuffle: true,
      seed: seed || Date.now()
    }

    return this.repository.getChapterQuiz(bookId, chapterId, chapterQuizOptions) ||
      this.repository.getFirstChapterQuiz()
  }

  getStorageKey(quiz, quizMode, durationMinutes) {
    if (!quiz || !quiz.storageKey) {
      return ''
    }

    if (quizMode === QUIZ_MODES.TEST) {
      return `${quiz.storageKey}:test:${durationMinutes}`
    }

    return quiz.storageKey
  }

  getSharePathFromOptions(options, quiz) {
    const routeKeys = ['mode', 'scope', 'bookId', 'chapterId', 'count', 'seed', 'duration']
    const query = routeKeys.reduce((items, key) => {
      if (options && options[key]) {
        items.push(`${key}=${encodeURIComponent(decodeOptionValue(options[key]))}`)
      }

      return items
    }, [])

    if (query.length) {
      return `/page/quiz/index?${query.join('&')}`
    }

    return quiz ? quiz.sharePath : '/page/quiz/index'
  }

  withPersistence(result) {
    if (result && result.saveBestScore) {
      this.storage.set(result.saveBestScore.key, result.saveBestScore.value)
    }

    return result
  }
}

module.exports = {
  QuizViewModel
}
