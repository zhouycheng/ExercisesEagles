const CLOSE_DRAG_DISTANCE = 80
const MAX_DIRECT_DRAG_DISTANCE = 220

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

  data: {
    isDragging: false,
    panelStyle: ''
  },

  methods: {
    handleClose() {
      this.resetDrag()
      this.triggerEvent('close')
    },

    handleDragStart(e) {
      const touch = e.touches && e.touches[0]
      if (!touch) {
        return
      }

      this.dragStartY = touch.clientY
      this.dragOffsetY = 0
      this.setData({
        isDragging: true,
        panelStyle: 'transition: none; transform: translateY(0px);'
      })
    },

    handleDragMove(e) {
      const touch = e.touches && e.touches[0]
      if (!touch || typeof this.dragStartY !== 'number') {
        return
      }

      const rawOffset = Math.max(touch.clientY - this.dragStartY, 0)
      const dragOffset = rawOffset > MAX_DIRECT_DRAG_DISTANCE
        ? MAX_DIRECT_DRAG_DISTANCE + (rawOffset - MAX_DIRECT_DRAG_DISTANCE) * 0.35
        : rawOffset

      this.dragOffsetY = dragOffset
      this.setData({
        panelStyle: `transition: none; transform: translateY(${Math.round(dragOffset)}px);`
      })
    },

    handleDragEnd() {
      if (typeof this.dragStartY !== 'number') {
        return
      }

      const shouldClose = this.dragOffsetY >= CLOSE_DRAG_DISTANCE
      this.dragStartY = null

      if (shouldClose) {
        this.setData({
          isDragging: false,
          panelStyle: 'transition: transform 140ms ease; transform: translateY(100%);'
        })
        this.triggerEvent('close')
        return
      }

      this.setData({
        isDragging: false,
        panelStyle: 'transition: transform 160ms ease; transform: translateY(0px);'
      })
    },

    handleSelect(e) {
      this.resetDrag()
      this.triggerEvent('select', {
        index: Number(e.currentTarget.dataset.index)
      })
    },

    resetDrag() {
      this.dragStartY = null
      this.dragOffsetY = 0
      this.setData({
        isDragging: false,
        panelStyle: ''
      })
    },

    stop() {
      return false
    }
  }
})
