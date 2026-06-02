Component({
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  properties: {
    chapter: {
      type: Object,
      value: {}
    }
  },

  methods: {
    handleViewTap() {
      this.triggerEvent('viewtap', {
        chapter: this.data.chapter
      })
    },

    handleDrawTap() {
      this.triggerEvent('drawtap', {
        chapter: this.data.chapter
      })
    }
  }
})
