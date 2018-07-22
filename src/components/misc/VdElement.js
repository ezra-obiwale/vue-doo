export default {
  name: 'VdElement',
  props: {
    tag: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    }
  },
  render (createElement) {
    return createElement(
      this.tag,
      {
        attrs: this.keysExcept(this.$attrs, ['text', 'tag', 'class', 'style']),
        class: this.classObject,
        style: this.styleObject,
        on: this.$listeners
      },
      [this.text]
    )
  }
}
