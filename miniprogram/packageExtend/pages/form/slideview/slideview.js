import CustomPage from '../../../base/CustomPage'

const base64 = require('../../images/base64')

CustomPage({
  onShareAppMessage() {
    return {
      title: 'sliderview',
      path: 'packageExtend/pages/form/sliderview/sliderview'
    }
  },
  onLoad() {
    this.setData({
      icon: base64.icon20,
      slideButtons: [{
        text: '普通',
      }, {
        text: '普通',
        extClass: 'test',
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
      }],
    })
  },
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  }
})
