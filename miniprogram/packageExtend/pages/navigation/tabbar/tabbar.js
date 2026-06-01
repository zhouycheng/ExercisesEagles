import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'tabbar',
      path: 'page/weui/example/tabbar/tabbar'
    }
  },
  data: {
    list: [
      {
        text: '微信',
        badge: '8'
      },
      {
        text: '通讯录'
      },
      {
        text: '发现',
        dot: true
      },
      {
        text: '我'
      }
    ]
  },
  tabChange(e) {
    console.log('tab change', e)
  }
})
