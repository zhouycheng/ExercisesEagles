Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    total: {
      type: Number,
      value: 0
    },
    answeredCount: {
      type: Number,
      value: 0
    },
    items: {
      type: Array,
      value: []
    }
  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },

    handleSelect(e) {
      this.triggerEvent('select', {
        index: Number(e.currentTarget.dataset.index)
      })
    },

    stop() {
      return false
    }
  }
})
