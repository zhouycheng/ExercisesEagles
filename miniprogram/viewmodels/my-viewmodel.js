function getInitialMyViewData() {
  return {
    statusBarHeight: 0
  }
}

class MyViewModel {
  static getInitialData() {
    return getInitialMyViewData()
  }

  load(statusBarHeight) {
    return {
      data: {
        statusBarHeight
      }
    }
  }

  getShareMessage() {
    return {
      title: '题小鹰',
      path: '/page/my/index'
    }
  }
}

module.exports = {
  MyViewModel
}
