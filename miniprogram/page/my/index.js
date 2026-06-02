const { getStatusBarHeight } = require('../../adapters/wx-layout.js')
const { MyViewModel } = require('../../viewmodels/my-viewmodel.js')

Page({
  data: MyViewModel.getInitialData(),

  onLoad() {
    this.viewModel = new MyViewModel()
    this.applyViewModelResult(this.viewModel.load(getStatusBarHeight(wx)))
  },

  onShow() {
    if (!wx.showTabBar) {
      return
    }

    wx.showTabBar({
      animation: false
    })
  },

  applyViewModelResult(result) {
    if (result && result.data) {
      this.setData(result.data)
    }
  },

  onShareAppMessage() {
    return this.viewModel.getShareMessage()
  }
})
