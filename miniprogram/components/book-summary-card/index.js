Component({
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  properties: {
    book: {
      type: Object,
      value: {}
    }
  },

  methods: {
    handleDrawStartTap() {
      this.triggerEvent('drawstarttap', {
        book: this.data.book
      })
    },

    handleTestStartTap() {
      this.triggerEvent('teststarttap', {
        book: this.data.book
      })
    }
  }
})
