Component({
  options: {
    addGlobalClass: true,
    virtualHost: true
  },

  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '正在加载'
    },
    description: {
      type: String,
      value: ''
    }
  },

  methods: {
    noop() {
      return false
    }
  }
})
