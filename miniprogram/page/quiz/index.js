const { getAppBarMetrics, getDefaultAppBarMetrics } = require('../../adapters/wx-layout.js')
const { QuizViewModel } = require('../../viewmodels/quiz-viewmodel.js')

const SWIPE_DISTANCE = 55
const SWIPE_VERTICAL_LIMIT = 70
const TRIPLE_TAP_REQUIRED_COUNT = 3
const TRIPLE_TAP_INTERVAL = 420
const TRIPLE_TAP_MOVE_LIMIT = 18
const TRIPLE_TAP_POSITION_LIMIT = 44
const TRIPLE_TAP_DURATION_LIMIT = 320
const HOME_PAGE_URL = '/page/home/index'

function createWxStorageAdapter() {
  return {
    get(key) {
      return wx.getStorageSync(key)
    },

    set(key, value) {
      wx.setStorageSync(key, value)
    }
  }
}

Page({
  data: Object.assign({}, QuizViewModel.getInitialData(), getDefaultAppBarMetrics()),

  onLoad(options) {
    this.viewModel = new QuizViewModel({
      storage: createWxStorageAdapter()
    })
    this.resetTouchState()
    this.setAppBarMetrics()
    this.applyViewModelResult(this.viewModel.load(options))
  },

  onUnload() {
    this.stopTestTimer()
  },

  onResize() {
    this.setAppBarMetrics()
  },

  onShareAppMessage() {
    return this.viewModel.getShareMessage()
  },

  setAppBarMetrics() {
    this.setData(getAppBarMetrics(wx), () => {
      this.updateQuestionScrollable()
    })
  },

  handleBackTap() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({
      url: HOME_PAGE_URL
    })
  },

  handleReturnHome() {
    wx.switchTab({
      url: HOME_PAGE_URL
    })
  },

  handleReturnBookDetail() {
    if (this.data.bookId) {
      wx.navigateBack({
        fail: () => {
          wx.navigateTo({
            url: `/page/book-detail/index?bookId=${encodeURIComponent(this.data.bookId)}`
          })
        }
      })
      return
    }

    this.handleReturnHome()
  },

  startTestTimer() {
    if (!this.data.isTestMode || this.data.isCompleted || !this.data.questions.length) {
      return
    }

    this.stopTestTimer()
    this.testEndsAt = Date.now() + this.data.durationSeconds * 1000
    this.countdownTimer = setInterval(() => {
      const timerSeconds = Math.max(Math.ceil((this.testEndsAt - Date.now()) / 1000), 0)
      this.applyViewModelResult(this.viewModel.updateTimer(timerSeconds))

      if (timerSeconds <= 0) {
        this.applyViewModelResult(this.viewModel.autoSubmitQuiz())
      }
    }, 1000)
  },

  stopTestTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
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
    this.resetTouchState()
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
    this.toggleFavoriteQuestion(true)
  },

  resetTouchState() {
    this.touchStartX = null
    this.touchStartY = null
    this.touchStartTime = null
  },

  resetTripleTap() {
    this.fullPageTapCount = 0
    this.lastFullPageTap = null
  },

  selectOption(e) {
    const selectedIndex = Number(e.currentTarget.dataset.index)
    this.applyViewModelResult(this.viewModel.selectOption(selectedIndex))
  },

  handleIconAction(e) {
    this.resetTripleTap()
    const action = e.detail && e.detail.action

    if (action === 'overview') {
      this.openPaperOverview()
      return
    }

    if (action === 'favorite') {
      this.toggleFavoriteQuestion(false)
    }
  },

  toggleFavoriteQuestion(showToast) {
    const result = this.viewModel.toggleFavoriteQuestion()
    this.applyViewModelResult(result)

    if (showToast && result && typeof result.value === 'boolean') {
      wx.showToast({
        title: result.value ? '已收藏本题' : '已取消收藏',
        icon: 'none',
        duration: 1200
      })
    }
  },

  goNext() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.goNext())
  },

  goPrev() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.goPrev())
  },

  submitQuiz() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.submitQuiz())
  },

  closeSubmitModal() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.closeSubmitModal())
  },

  openPaperOverview() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.openPaperOverview())
  },

  closeQuestionOverview() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.closeQuestionOverview())
  },

  jumpToQuestion(e) {
    this.resetTripleTap()
    const eventIndex = e.detail && e.detail.index
    const datasetIndex = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.index
    const nextIndex = eventIndex !== undefined ? eventIndex : datasetIndex

    this.applyViewModelResult(this.viewModel.jumpToQuestion(nextIndex))
  },

  forceSubmitQuiz() {
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.forceSubmitQuiz())
  },

  resetQuiz() {
    this.stopTestTimer()
    this.resetTouchState()
    this.resetTripleTap()
    this.applyViewModelResult(this.viewModel.reset())
  },

  applyViewModelResult(result) {
    if (!result) {
      return
    }

    const runEffects = () => {
      this.applyViewModelEffects(result)
    }

    if (result.data) {
      this.setData(result.data, runEffects)
      return
    }

    runEffects()
  },

  applyViewModelEffects(result) {
    if (result.stopTimer) {
      this.stopTestTimer()
    }

    if (result.command) {
      this.handleViewModelCommand(result.command)
    }

    if (result.measureQuestion) {
      this.updateQuestionScrollable()
    }

    if (result.startTimer) {
      this.startTestTimer()
    }
  },

  handleViewModelCommand(command) {
    if (command.type === 'returnBookDetail') {
      this.handleReturnBookDetail()
    }
  },

  noop() {
    return false
  },

  updateQuestionScrollable() {
    if (this.data.isCompleted || !this.data.currentQuestion) {
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
  }
})
