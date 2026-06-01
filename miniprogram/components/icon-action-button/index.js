Component({
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  properties: {
    icon: {
      type: String,
      value: ''
    },
    action: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    variant: {
      type: String,
      value: 'panel'
    },
    active: {
      type: Boolean,
      value: false
    },
    extClass: {
      type: String,
      value: ''
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('actiontap', {
        action: this.data.action
      })
    }
  }
})
