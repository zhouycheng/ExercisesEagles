const SWIPE_DISTANCE = 55
const SWIPE_VERTICAL_LIMIT = 70
const DEFAULT_APP_BAR_HEIGHT = 88
const DEFAULT_MENU_BUTTON_TOP = 48
const DEFAULT_MENU_BUTTON_HEIGHT = 32
const DEFAULT_APP_BAR_TITLE_RIGHT = 108
const DEFAULT_CONTENT_TOP = DEFAULT_APP_BAR_HEIGHT + 12

const questions = [
  {
    id: 1,
    prompt: '8 + 5 = ?',
    options: [
      { text: '11', explanation: '8 加 3 才是 11，少加了 2。' },
      { text: '12', explanation: '8 加 4 是 12，距离正确答案还差 1。' },
      { text: '13', explanation: '正确。8 加 5 等于 13。' },
      { text: '14', explanation: '14 比正确答案多 1。' }
    ],
    answerIndex: 2
  },
  {
    id: 2,
    prompt: '15 - 7 = ?',
    options: [
      { text: '6', explanation: '15 减 9 才是 6，减多了。' },
      { text: '7', explanation: '15 减 8 是 7，还差 1。' },
      { text: '8', explanation: '正确。15 减 7 等于 8。' },
      { text: '9', explanation: '15 减 6 是 9，减少了。' }
    ],
    answerIndex: 2
  },
  {
    id: 3,
    prompt: '6 × 4 = ?',
    options: [
      { text: '20', explanation: '5 个 4 是 20，不是 6 个 4。' },
      { text: '22', explanation: '22 不是 4 的整倍数。' },
      { text: '24', explanation: '正确。6 个 4 相加等于 24。' },
      { text: '26', explanation: '26 比正确答案多 2。' }
    ],
    answerIndex: 2
  },
  {
    id: 4,
    prompt: '20 ÷ 5 = ?',
    options: [
      { text: '3', explanation: '5 乘 3 是 15，不够 20。' },
      { text: '4', explanation: '正确。5 乘 4 等于 20。' },
      { text: '5', explanation: '5 乘 5 是 25，超过 20。' },
      { text: '6', explanation: '5 乘 6 是 30，超过 20。' }
    ],
    answerIndex: 1
  },
  {
    id: 5,
    prompt: '9 + 12 = ?',
    options: [
      { text: '19', explanation: '9 加 10 是 19，少加了 2。' },
      { text: '20', explanation: '9 加 11 是 20，少加了 1。' },
      { text: '21', explanation: '正确。9 加 12 等于 21。' },
      { text: '22', explanation: '22 比正确答案多 1。' }
    ],
    answerIndex: 2
  },
  {
    id: 6,
    prompt: '18 - 9 = ?',
    options: [
      { text: '8', explanation: '18 减 10 是 8，减多了 1。' },
      { text: '9', explanation: '正确。18 减 9 等于 9。' },
      { text: '10', explanation: '18 减 8 是 10，减少了 1。' },
      { text: '11', explanation: '18 减 7 是 11，减少了 2。' }
    ],
    answerIndex: 1
  },
  {
    id: 7,
    prompt: '7 × 3 = ?',
    options: [
      { text: '18', explanation: '6 乘 3 是 18，少了 1 个 3。' },
      { text: '20', explanation: '20 不是 7 的 3 倍。' },
      { text: '21', explanation: '正确。7 乘 3 等于 21。' },
      { text: '24', explanation: '8 乘 3 是 24，多了 1 个 3。' }
    ],
    answerIndex: 2
  },
  {
    id: 8,
    prompt: '36 ÷ 6 = ?',
    options: [
      { text: '5', explanation: '6 乘 5 是 30，不够 36。' },
      { text: '6', explanation: '正确。6 乘 6 等于 36。' },
      { text: '7', explanation: '6 乘 7 是 42，超过 36。' },
      { text: '8', explanation: '6 乘 8 是 48，超过 36。' }
    ],
    answerIndex: 1
  },
  {
    id: 9,
    prompt: '14 + 6 - 5 = ?',
    options: [
      { text: '13', explanation: '13 比正确答案少 2。' },
      { text: '14', explanation: '14 比正确答案少 1。' },
      { text: '15', explanation: '正确。14 加 6 是 20，再减 5 等于 15。' },
      { text: '16', explanation: '16 比正确答案多 1。' }
    ],
    answerIndex: 2
  },
  {
    id: 10,
    prompt: '5 × 5 + 2 = ?',
    options: [
      { text: '25', explanation: '这是只算了 5 乘 5，没有再加 2。' },
      { text: '26', explanation: '26 比正确答案少 1。' },
      { text: '27', explanation: '正确。先算 25，再加 2 得 27。' },
      { text: '28', explanation: '28 比正确答案多 1。' }
    ],
    answerIndex: 2
  }
]

Page({
  data: {
    quizTitle: 'MVP测试 - 数学题',
    questions,
    total: questions.length,
    currentIndex: 0,
    currentNumber: 1,
    currentQuestion: questions[0],
    selectedIndex: null,
    answers: [],
    progressPercent: 10,
    hasAnswered: false,
    isLastQuestion: false,
    isCompleted: false,
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
    const bestScore = wx.getStorageSync('quizBestScore') || 0
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
    this.setData({
      currentIndex: 0,
      currentNumber: 1,
      currentQuestion: questions[0],
      selectedIndex: null,
      answers: [],
      progressPercent: this.getProgressPercent(0),
      hasAnswered: false,
      isLastQuestion: questions.length === 1,
      isCompleted: false,
      showSubmitModal: false,
      showQuestionOverview: false,
      unansweredCount: questions.length,
      overviewItems: this.getOverviewItems([], 0),
      correctCount: 0,
      score: 0,
      resultItems: []
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
    })
  },

  handleTouchStart(e) {
    const touch = e.touches && e.touches[0]
    if (!touch || this.data.isCompleted || this.data.showSubmitModal || this.data.showQuestionOverview) {
      return
    }

    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
  },

  handleTouchEnd(e) {
    const touch = e.changedTouches && e.changedTouches[0]
    if (
      !touch ||
      this.data.showSubmitModal ||
      this.data.showQuestionOverview ||
      typeof this.touchStartX !== 'number' ||
      typeof this.touchStartY !== 'number'
    ) {
      return
    }

    const deltaX = touch.clientX - this.touchStartX
    const deltaY = touch.clientY - this.touchStartY
    this.touchStartX = null
    this.touchStartY = null

    if (Math.abs(deltaX) < SWIPE_DISTANCE || Math.abs(deltaY) > SWIPE_VERTICAL_LIMIT || Math.abs(deltaY) > Math.abs(deltaX) * 0.8) {
      return
    }

    if (deltaX < 0) {
      this.goNext()
      return
    }

    this.goPrev()
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
      unansweredCount: this.getUnansweredIndexes(answers).length,
      overviewItems: this.getOverviewItems(answers, this.data.currentIndex)
    })
  },

  goNext() {
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
      isLastQuestion: nextIndex === questions.length - 1,
      overviewItems: this.getOverviewItems(this.data.answers, nextIndex)
    })
  },

  goPrev() {
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
      isLastQuestion: false,
      overviewItems: this.getOverviewItems(this.data.answers, prevIndex)
    })
  },

  submitQuiz() {
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
    this.setData({ showSubmitModal: false })
  },

  openPaperOverview() {
    this.setData({
      showSubmitModal: false,
      showQuestionOverview: true,
      overviewItems: this.getOverviewItems(this.data.answers, this.data.currentIndex)
    })
  },

  closeQuestionOverview() {
    this.setData({ showQuestionOverview: false })
  },

  jumpToQuestion(e) {
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
      isLastQuestion: nextIndex === questions.length - 1,
      showQuestionOverview: false,
      overviewItems: this.getOverviewItems(this.data.answers, nextIndex)
    })
  },

  forceSubmitQuiz() {
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
    const score = correctCount * 10
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
        explanation: question.options[question.answerIndex].explanation
      }
    })

    wx.setStorageSync('quizBestScore', bestScore)
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

  getOverviewItems(answers, currentIndex) {
    return questions.map((question, index) => ({
      id: question.id,
      number: index + 1,
      answered: !!answers[index],
      active: index === currentIndex
    }))
  }
})
