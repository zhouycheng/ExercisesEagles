const { getStatusBarHeight } = require('../../adapters/wx-layout.js')
const { BookDetailViewModel } = require('../../viewmodels/book-detail-viewmodel.js')

const ROUTE_LOADING_DISPLAY_MS = 220

Page({
  data: BookDetailViewModel.getInitialData(),

  onLoad(options) {
    this.viewModel = new BookDetailViewModel()
    this.applyViewModelResult(this.viewModel.load(options, getStatusBarHeight(wx)))
  },

  onShow() {
    this.isOpeningQuiz = false
    this.closeRouteLoading()
  },

  handleBackTap() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({
      url: '/page/home/index'
    })
  },

  handleBookDrawStartTap() {
    this.applyViewModelResult(this.viewModel.openConfigSheet('draw'))
  },

  handleBookTestStartTap() {
    this.applyViewModelResult(this.viewModel.openConfigSheet('test'))
  },

  handleChapterViewTap(e) {
    const chapter = e.detail && e.detail.chapter
    this.applyViewModelResult(this.viewModel.openChapter(chapter, 'view', this.isOpeningQuiz))
  },

  handleChapterDrawTap(e) {
    const chapter = e.detail && e.detail.chapter
    this.applyViewModelResult(this.viewModel.openChapter(chapter, 'normal', this.isOpeningQuiz, Date.now()))
  },

  closeConfigSheet() {
    this.applyViewModelResult(this.viewModel.closeConfigSheet())
  },

  selectQuestionCount(e) {
    this.applyViewModelResult(this.viewModel.selectQuestionCount(e.currentTarget.dataset.value))
  },

  selectDuration(e) {
    this.applyViewModelResult(this.viewModel.selectDuration(e.currentTarget.dataset.value))
  },

  confirmConfigSheet() {
    if (this.isOpeningQuiz) {
      return
    }

    this.applyViewModelResult(this.viewModel.confirmConfigSheet(Date.now()))
  },

  applyViewModelResult(result) {
    if (!result) {
      return
    }

    const runCommand = () => {
      this.handleViewModelCommand(result.command)
    }

    if (result.data) {
      this.setData(result.data, runCommand)
      return
    }

    runCommand()
  },

  handleViewModelCommand(command) {
    if (!command) {
      return
    }

    if (command.type === 'toast') {
      wx.showToast({
        title: command.title,
        icon: 'none'
      })
      return
    }

    if (command.type === 'openRouteWithLoading') {
      this.isOpeningQuiz = true
      this.openRouteWithLoading(command.payload)
    }
  },

  openRouteWithLoading(payload) {
    const startedAt = Date.now()

    this.setData({
      routeLoadingVisible: true,
      routeLoadingTitle: payload.title,
      routeLoadingDescription: payload.description
    }, () => {
      const delay = Math.max(ROUTE_LOADING_DISPLAY_MS - (Date.now() - startedAt), 0)
      setTimeout(() => {
        wx.navigateTo({
          url: payload.url,
          fail: () => {
            this.isOpeningQuiz = false
            this.closeRouteLoading()
            wx.showToast({
              title: '进入答题失败',
              icon: 'none'
            })
          }
        })
      }, delay)
    })
  },

  closeRouteLoading() {
    if (!this.data.routeLoadingVisible) {
      return
    }

    this.applyViewModelResult(this.viewModel.closeRouteLoading())
  },

  onShareAppMessage() {
    return this.viewModel.getShareMessage()
  }
})
