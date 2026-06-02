const questionBankRepository = require('../repositories/question-bank-repository.js')

function getInitialHomeViewData() {
  return {
    statusBarHeight: 0,
    books: [],
    routeLoadingVisible: false,
    routeLoadingTitle: '正在打开课本',
    routeLoadingDescription: ''
  }
}

class HomeViewModel {
  constructor(options) {
    const normalizedOptions = options || {}
    this.repository = normalizedOptions.repository || questionBankRepository
  }

  static getInitialData() {
    return getInitialHomeViewData()
  }

  load(statusBarHeight) {
    return {
      data: Object.assign(getInitialHomeViewData(), {
        statusBarHeight,
        books: this.repository.getBookSummaries()
      })
    }
  }

  openBook(detail, isOpeningBookDetail) {
    const book = detail && detail.book
    const detailUrl = detail && detail.detailUrl

    if (!detailUrl || isOpeningBookDetail) {
      return null
    }

    if (!book || !this.repository.getBookDetail(book.id)) {
      return {
        command: {
          type: 'toast',
          title: '课本数据暂不可用'
        }
      }
    }

    return {
      command: {
        type: 'openRouteWithLoading',
        payload: {
          url: detailUrl,
          title: '正在打开课本',
          description: book.name || '读取课本信息'
        }
      }
    }
  }

  closeRouteLoading() {
    return {
      data: {
        routeLoadingVisible: false
      }
    }
  }

  getShareMessage() {
    return {
      title: '题小鹰题库',
      path: '/page/home/index'
    }
  }
}

module.exports = {
  HomeViewModel
}
