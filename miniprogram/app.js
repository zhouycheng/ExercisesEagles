App({
  onLaunch(opts, data) {
    console.log('App Launch', opts)

    if (data && data.path) {
      wx.navigateTo({
        url: data.path
      })
    }
  },

  onShow(opts) {
    console.log('App Show', opts)
  },

  onHide() {
    console.log('App Hide')
  },

  globalData: {
    hasLogin: false
  }
})
