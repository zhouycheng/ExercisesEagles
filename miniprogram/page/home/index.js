const { getStatusBarHeight } = require('../../adapters/wx-layout.js')
const { HomeViewModel } = require('../../viewmodels/home-viewmodel.js')

const ROUTE_LOADING_DISPLAY_MS = 220

Page({
  data: HomeViewModel.getInitialData(),

  onLoad() {
    this.viewModel = new HomeViewModel()
    this.applyViewModelResult(this.viewModel.load(getStatusBarHeight(wx)))
  },

  onShow() {
    this.isOpeningBookDetail = false
    this.closeRouteLoading()
    this.showTabBar()
  },

  handleBookTap(e) {
    const result = this.viewModel.openBook(e.detail, this.isOpeningBookDetail)
    this.applyViewModelResult(result)
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
      this.isOpeningBookDetail = true
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
        this.hideTabBarBeforeNavigate(payload.url)
      }, delay)
    })
  },

  hideTabBarBeforeNavigate(url) {
    const navigate = () => {
      wx.navigateTo({
        url,
        fail: () => {
          this.isOpeningBookDetail = false
          this.closeRouteLoading()
          this.showTabBar()
        }
      })
    }

    if (!wx.hideTabBar) {
      navigate()
      return
    }

    wx.hideTabBar({
      animation: false,
      complete: navigate
    })
  },

  closeRouteLoading() {
    if (!this.data.routeLoadingVisible) {
      return
    }

    this.applyViewModelResult(this.viewModel.closeRouteLoading())
  },

  showTabBar() {
    if (!wx.showTabBar) {
      return
    }

    wx.showTabBar({
      animation: false
    })
  },

  onShareAppMessage() {
    return this.viewModel.getShareMessage()
  }
})
