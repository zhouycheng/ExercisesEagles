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
    handleBookTap() {
      this.triggerEvent('booktap', {
        book: this.data.book,
        detailUrl: this.data.book.detailUrl
      })
    }
  }
})
