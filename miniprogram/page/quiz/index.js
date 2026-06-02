const SWIPE_DISTANCE = 55
const SWIPE_VERTICAL_LIMIT = 70
const TRIPLE_TAP_REQUIRED_COUNT = 3
const TRIPLE_TAP_INTERVAL = 420
const TRIPLE_TAP_MOVE_LIMIT = 18
const TRIPLE_TAP_POSITION_LIMIT = 44
const TRIPLE_TAP_DURATION_LIMIT = 320
const DEFAULT_APP_BAR_HEIGHT = 88
const DEFAULT_MENU_BUTTON_TOP = 48
const DEFAULT_MENU_BUTTON_HEIGHT = 32
const DEFAULT_APP_BAR_TITLE_RIGHT = 108
const DEFAULT_CONTENT_TOP = DEFAULT_APP_BAR_HEIGHT + 12
const OPTION_CODES = ['A', 'B', 'C', 'D']
const QUIZ_BEST_SCORE_KEY = 'quizBestScore:book-college-chinese:ch-001'
const questionBank = require('../../data/question-banks/college-chinese-ch001.js')

const quizTitle = `${questionBank.book.name} - ${questionBank.chapter.name}`
const questions = questionBank.groups.reduce((items, group) => {
  const groupQuestions = group.questions.map((question) => {
    const answerKey = question.answerKeys[0]
    return {
      id: question.questionId,
      groupName: group.name,
      prompt: question.stem,
      options: question.options.map((option, optionIndex) => ({
        key: option.key,
        code: option.keyLabel || option.key || getOptionCode(optionIndex),
        text: option.text
      })),
      answerIndex: question.options.findIndex((option) => option.key === answerKey),
      explanation: question.explanation || ''
    }
  })

  return items.concat(groupQuestions)
}, [])

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

Page({
  data: {
    quizTitle,
    questions,
    total: questions.length,
    currentIndex: 0,
    currentNumber: 1,
    currentQuestion: questions[0],
    selectedIndex: null,
    answers: [],
    progressPercent: 10,
    hasAnswered: false,
    currentCorrectAnswerCode: '',
    currentExplanation: '',
    isQuestionScrollable: false,
    questionScrollTop: 0,
    isLastQuestion: false,
    isCompleted: false,
    favoriteQuestionIds: [],
    isCurrentQuestionFavorite: false,
    showSubmitModal: false,
    showQuestionOverview: false,
    unansweredCount: questions.length,
    overviewItems: [],
    correctCount: 0,
    score: 0,
    bestScore: 0,
    resultItems: [],
    appBarHeight: DEFAULT_APP_BAR_HEIGHT,
    menuButtonTop: DEFAULT_MENU_BUTTON_TOP,
    menuButtonHeight: DEFAULT_MENU_BUTTON_HEIGHT,
    appBarTitleRight: DEFAULT_APP_BAR_TITLE_RIGHT,
    contentTop: DEFAULT_CONTENT_TOP
  },

  onLoad() {
    this.setAppBarMetrics()
    const bestScore = wx.getStorageSync(QUIZ_BEST_SCORE_KEY) || 0
    this.setData({ bestScore })
    this.resetQuiz()
  },

  onResize() {
    this.setAppBarMetrics()
  },

  onShareAppMessage() {
    return {
      title: '题小鹰答题',
      path: '/page/quiz/index'
    }
  },

  resetQuiz() {
    this.touchStartX = null
    this.touchStartY = null
    this.touchStartTime = null
    this.resetTripleTap()
    this.setData({
      currentIndex: 0,
      currentNumber: 1,
      currentQuestion: questions[0],
      selectedIndex: null,
      answers: [],
      progressPercent: this.getProgressPercent(0),
      hasAnswered: false,
      currentCorrectAnswerCode: '',
      currentExplanation: '',
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isLastQuestion: questions.length === 1,
      isCompleted: false,
      favoriteQuestionIds: [],
      isCurrentQuestionFavorite: false,
      showSubmitModal: false,
      showQuestionOverview: false,
      unansweredCount: questions.length,
      overviewItems: this.getOverviewItems([], 0),
      correctCount: 0,
      score: 0,
      resultItems: []
    }, () => {
      this.updateQuestionScrollable()
    })
  },

  setAppBarMetrics() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const hasMenuButtonMetrics = menuButton &&
      typeof menuButton.top === 'number' &&
      typeof menuButton.left === 'number' &&
      typeof menuButton.height === 'number'

    if (!hasMenuButtonMetrics) {
      this.setData({
        appBarHeight: DEFAULT_APP_BAR_HEIGHT,
        menuButtonTop: DEFAULT_MENU_BUTTON_TOP,
        menuButtonHeight: DEFAULT_MENU_BUTTON_HEIGHT,
        appBarTitleRight: DEFAULT_APP_BAR_TITLE_RIGHT,
        contentTop: DEFAULT_CONTENT_TOP
      }, () => {
        this.updateQuestionScrollable()
      })
      return
    }

    const statusBarHeight = windowInfo.statusBarHeight || 0
    const menuGap = Math.max(menuButton.top - statusBarHeight, 0)
    const navBarHeight = menuButton.height + menuGap * 2
    const windowWidth = windowInfo.windowWidth || windowInfo.screenWidth || 0

    this.setData({
      appBarHeight: Math.ceil(statusBarHeight + navBarHeight),
      menuButtonTop: Math.ceil(menuButton.top),
      menuButtonHeight: Math.ceil(menuButton.height),
      appBarTitleRight: Math.ceil(windowWidth - menuButton.left + 12),
      contentTop: Math.ceil(statusBarHeight + navBarHeight + 12)
    }, () => {
      this.updateQuestionScrollable()
    })
  },

  handleTouchStart(e) {
    const touch = e.touches && e.touches[0]
    if (!touch || this.data.isCompleted || this.data.showSubmitModal || this.data.showQuestionOverview) {
      return
    }

    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
    this.touchStartTime = Date.now()
  },

  handleTouchEnd(e) {
    const touch = e.changedTouches && e.changedTouches[0]
    if (
      !touch ||
      this.data.isCompleted ||
      this.data.showSubmitModal ||
      this.data.showQuestionOverview ||
      typeof this.touchStartX !== 'number' ||
      typeof this.touchStartY !== 'number'
    ) {
      this.resetTripleTap()
      return
    }

    const deltaX = touch.clientX - this.touchStartX
    const deltaY = touch.clientY - this.touchStartY
    const touchDuration = typeof this.touchStartTime === 'number' ? Date.now() - this.touchStartTime : TRIPLE_TAP_DURATION_LIMIT + 1
    this.touchStartX = null
    this.touchStartY = null
    this.touchStartTime = null

    if (
      Math.abs(deltaX) <= TRIPLE_TAP_MOVE_LIMIT &&
      Math.abs(deltaY) <= TRIPLE_TAP_MOVE_LIMIT &&
      touchDuration <= TRIPLE_TAP_DURATION_LIMIT
    ) {
      this.handleFullPageTap(touch)
      return
    }

    this.resetTripleTap()

    if (Math.abs(deltaX) < SWIPE_DISTANCE || Math.abs(deltaY) > SWIPE_VERTICAL_LIMIT || Math.abs(deltaY) > Math.abs(deltaX) * 0.8) {
      return
    }

    if (deltaX < 0) {
      this.goNext()
      return
    }

    this.goPrev()
  },

  handleTouchCancel() {
    this.touchStartX = null
    this.touchStartY = null
    this.touchStartTime = null
    this.resetTripleTap()
  },

  handleFullPageTap(touch) {
    if (this.data.isCompleted || this.data.showSubmitModal || this.data.showQuestionOverview) {
      this.resetTripleTap()
      return
    }

    const now = Date.now()
    const lastTap = this.lastFullPageTap
    const isContinuousTap = lastTap &&
      now - lastTap.time <= TRIPLE_TAP_INTERVAL &&
      Math.abs(touch.clientX - lastTap.x) <= TRIPLE_TAP_POSITION_LIMIT &&
      Math.abs(touch.clientY - lastTap.y) <= TRIPLE_TAP_POSITION_LIMIT

    this.fullPageTapCount = isContinuousTap ? (this.fullPageTapCount || 0) + 1 : 1
    this.lastFullPageTap = {
      time: now,
      x: touch.clientX,
      y: touch.clientY
    }

    if (this.fullPageTapCount < TRIPLE_TAP_REQUIRED_COUNT) {
      return
    }

    this.resetTripleTap()
    const isCurrentQuestionFavorite = this.toggleFavoriteQuestion()
    if (typeof isCurrentQuestionFavorite === 'boolean') {
      wx.showToast({
        title: isCurrentQuestionFavorite ? '已收藏本题' : '已取消收藏',
        icon: 'none',
        duration: 1200
      })
    }
  },

  resetTripleTap() {
    this.fullPageTapCount = 0
    this.lastFullPageTap = null
  },

  selectOption(e) {
    if (this.data.isCompleted || this.data.hasAnswered) {
      return
    }

    const selectedIndex = Number(e.currentTarget.dataset.index)
    const question = this.data.currentQuestion
    const answers = this.data.answers.slice()
    answers[this.data.currentIndex] = {
      questionId: question.id,
      selectedIndex,
      isCorrect: selectedIndex === question.answerIndex
    }

    this.setData({
      selectedIndex,
      answers,
      hasAnswered: true,
      currentCorrectAnswerCode: this.getQuestionCorrectAnswerCode(question),
      currentExplanation: this.getQuestionExplanation(question),
      unansweredCount: this.getUnansweredIndexes(answers).length,
      overviewItems: this.getOverviewItems(answers, this.data.currentIndex)
    })
  },

  handleIconAction(e) {
    this.resetTripleTap()
    const action = e.detail && e.detail.action

    if (action === 'overview') {
      this.openPaperOverview()
      return
    }

    if (action === 'favorite') {
      this.toggleFavoriteQuestion()
    }
  },

  toggleFavoriteQuestion() {
    const question = this.data.currentQuestion
    if (!question) {
      return null
    }

    const favoriteQuestionIds = this.data.favoriteQuestionIds.slice()
    const favoriteIndex = favoriteQuestionIds.indexOf(question.id)
    const isCurrentQuestionFavorite = favoriteIndex === -1

    if (isCurrentQuestionFavorite) {
      favoriteQuestionIds.push(question.id)
    } else {
      favoriteQuestionIds.splice(favoriteIndex, 1)
    }

    this.setData({
      favoriteQuestionIds,
      isCurrentQuestionFavorite
    })

    return isCurrentQuestionFavorite
  },

  goNext() {
    this.resetTripleTap()

    if (this.data.isLastQuestion) {
      this.submitQuiz()
      return
    }

    const nextIndex = this.data.currentIndex + 1
    const savedAnswer = this.data.answers[nextIndex]

    this.setData({
      currentIndex: nextIndex,
      currentNumber: nextIndex + 1,
      currentQuestion: questions[nextIndex],
      selectedIndex: savedAnswer ? savedAnswer.selectedIndex : null,
      progressPercent: this.getProgressPercent(nextIndex),
      hasAnswered: !!savedAnswer,
      currentCorrectAnswerCode: savedAnswer ? this.getQuestionCorrectAnswerCode(questions[nextIndex]) : '',
      currentExplanation: savedAnswer ? this.getQuestionExplanation(questions[nextIndex]) : '',
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isCurrentQuestionFavorite: this.isFavoriteQuestion(questions[nextIndex].id),
      isLastQuestion: nextIndex === questions.length - 1,
      overviewItems: this.getOverviewItems(this.data.answers, nextIndex)
    }, () => {
      this.updateQuestionScrollable()
    })
  },

  goPrev() {
    this.resetTripleTap()

    if (this.data.currentIndex === 0) {
      return
    }

    const prevIndex = this.data.currentIndex - 1
    const savedAnswer = this.data.answers[prevIndex]

    this.setData({
      currentIndex: prevIndex,
      currentNumber: prevIndex + 1,
      currentQuestion: questions[prevIndex],
      selectedIndex: savedAnswer ? savedAnswer.selectedIndex : null,
      progressPercent: this.getProgressPercent(prevIndex),
      hasAnswered: !!savedAnswer,
      currentCorrectAnswerCode: savedAnswer ? this.getQuestionCorrectAnswerCode(questions[prevIndex]) : '',
      currentExplanation: savedAnswer ? this.getQuestionExplanation(questions[prevIndex]) : '',
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isCurrentQuestionFavorite: this.isFavoriteQuestion(questions[prevIndex].id),
      isLastQuestion: false,
      overviewItems: this.getOverviewItems(this.data.answers, prevIndex)
    }, () => {
      this.updateQuestionScrollable()
    })
  },

  submitQuiz() {
    this.resetTripleTap()
    const unansweredIndexes = this.getUnansweredIndexes(this.data.answers)

    if (unansweredIndexes.length > 0) {
      this.setData({
        showSubmitModal: true,
        unansweredCount: unansweredIndexes.length,
        overviewItems: this.getOverviewItems(this.data.answers, this.data.currentIndex)
      })
      return
    }

    this.finishQuiz()
  },

  closeSubmitModal() {
    this.resetTripleTap()
    this.setData({ showSubmitModal: false })
  },

  openPaperOverview() {
    this.resetTripleTap()
    this.setData({
      showSubmitModal: false,
      showQuestionOverview: true,
      overviewItems: this.getOverviewItems(this.data.answers, this.data.currentIndex)
    })
  },

  closeQuestionOverview() {
    this.resetTripleTap()
    this.setData({ showQuestionOverview: false })
  },

  jumpToQuestion(e) {
    this.resetTripleTap()
    const eventIndex = e.detail && e.detail.index
    const datasetIndex = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.index
    const nextIndex = Number(eventIndex !== undefined ? eventIndex : datasetIndex)

    if (Number.isNaN(nextIndex) || nextIndex < 0 || nextIndex >= questions.length) {
      return
    }

    const savedAnswer = this.data.answers[nextIndex]

    this.setData({
      currentIndex: nextIndex,
      currentNumber: nextIndex + 1,
      currentQuestion: questions[nextIndex],
      selectedIndex: savedAnswer ? savedAnswer.selectedIndex : null,
      progressPercent: this.getProgressPercent(nextIndex),
      hasAnswered: !!savedAnswer,
      currentCorrectAnswerCode: savedAnswer ? this.getQuestionCorrectAnswerCode(questions[nextIndex]) : '',
      currentExplanation: savedAnswer ? this.getQuestionExplanation(questions[nextIndex]) : '',
      isQuestionScrollable: false,
      questionScrollTop: 0,
      isCurrentQuestionFavorite: this.isFavoriteQuestion(questions[nextIndex].id),
      isLastQuestion: nextIndex === questions.length - 1,
      showQuestionOverview: false,
      overviewItems: this.getOverviewItems(this.data.answers, nextIndex)
    }, () => {
      this.updateQuestionScrollable()
    })
  },

  forceSubmitQuiz() {
    this.resetTripleTap()
    this.setData({
      showSubmitModal: false,
      showQuestionOverview: false
    })
    this.finishQuiz()
  },

  noop() {
    return false
  },

  finishQuiz() {
    const answers = this.data.answers
    const correctCount = answers.filter(item => item && item.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    const bestScore = Math.max(score, this.data.bestScore)
    const resultItems = questions.map((question, index) => {
      const answer = answers[index] || {}
      return {
        id: question.id,
        number: index + 1,
        prompt: question.prompt,
        selectedAnswer: answer.selectedIndex !== undefined ? question.options[answer.selectedIndex].text : '未作答',
        correctAnswer: question.options[question.answerIndex].text,
        isCorrect: !!answer.isCorrect,
        explanation: this.getQuestionExplanation(question)
      }
    })

    wx.setStorageSync(QUIZ_BEST_SCORE_KEY, bestScore)
    this.setData({
      isCompleted: true,
      showSubmitModal: false,
      showQuestionOverview: false,
      correctCount,
      score,
      bestScore,
      resultItems
    })
  },

  getProgressPercent(index) {
    return Math.round(((index + 1) / questions.length) * 100)
  },

  getUnansweredIndexes(answers) {
    const indexes = []

    for (let index = 0; index < questions.length; index += 1) {
      if (!answers[index]) {
        indexes.push(index)
      }
    }

    return indexes
  },

  isFavoriteQuestion(questionId) {
    return this.data.favoriteQuestionIds.indexOf(questionId) !== -1
  },

  getQuestionExplanation(question) {
    if (!question || !question.options || !question.options[question.answerIndex]) {
      return ''
    }

    return question.explanation || '暂无解析。'
  },

  getQuestionCorrectAnswerCode(question) {
    if (!question || !question.options || !question.options[question.answerIndex]) {
      return ''
    }

    const correctOption = question.options[question.answerIndex]
    return correctOption.code || correctOption.key || getOptionCode(question.answerIndex)
  },

  updateQuestionScrollable() {
    if (this.data.isCompleted) {
      return
    }

    const measure = () => {
      const query = wx.createSelectorQuery()
      query.select('.question-scroll').boundingClientRect()
      query.select('.question-content').boundingClientRect()
      query.exec((rects) => {
        const scrollRect = rects && rects[0]
        const contentRect = rects && rects[1]

        if (!scrollRect || !contentRect) {
          return
        }

        const isQuestionScrollable = contentRect.height > scrollRect.height + 1
        if (isQuestionScrollable !== this.data.isQuestionScrollable) {
          this.setData({ isQuestionScrollable })
        }
      })
    }

    if (wx.nextTick) {
      wx.nextTick(measure)
      return
    }

    setTimeout(measure, 0)
  },

  getOverviewItems(answers, currentIndex) {
    return questions.map((question, index) => ({
      id: question.id,
      number: index + 1,
      answered: !!answers[index],
      active: index === currentIndex
    }))
  }
})
