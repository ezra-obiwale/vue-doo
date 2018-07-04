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
    let attrs = this.keysExcept(['text', 'tag', 'class', 'style'], this.$attrs),
      cls = {},
      style = {}
    if (typeof this.$attrs.class === 'string') {
      this.$attrs.class.replace(/\s\s/gi, ' ')
        .split(' ')
        .forEach(className => cls[className.trim()] = true)
    }
    if (typeof this.$attrs.style === 'string') {
      this.$attrs.style.split(';')
        .forEach(pair => {
          let parts = pair.split(':')
          style[parts[0].trim()] = parts[1].trim()
        })
    }
    return createElement(
      this.tag,
      {
        attrs: attrs,
        class: cls,
        style: style,
        on: this.$listeners
      },
      [this.text]
    )
  }
}
