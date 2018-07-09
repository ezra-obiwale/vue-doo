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
        attrs: this.keysExcept(['text', 'tag', 'class', 'style'], this.$attrs),
        class: this.classObject,
        style: this.styleObject,
        on: this.$listeners
      },
      [this.text]
    )
  }
}
