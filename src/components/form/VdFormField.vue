<template>
  <component
    :is="name"
    :id="id"
    :name="cleanName(id)"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners" />
</template>
<script>
export default {
  name: "VdFormField",
  props: {
    id: String,
    defaultValue: {
      type: [String, Number, Boolean, Array, Event],
      default: ''
    },
    name: {
      required: true,
      type: String
    },
    value: {
      type: [String, Number, Boolean, Array, Event],
      default: ''
    }
  },
  inheritAttrs: false,
  methods: {
    cleanName() {
      if (this.id.indexOf('.') !== -1) {
        return this.id.replace('.', '[').replace(/\./g, '][') + ']'
      }
      return this.id
    },
    isButton() {
      return this.type === 'button'
        || this.type === 'submit'
        || this.type === 'reset'
    }
  },
  mounted () {
    if (!this.value && this.defaultValue !== '') {
      this.$emit('change', this.defaultValue)
      this.$emit('input', this.defaultValue)
    }
  },
  watch: {
    value(value) {
      if (!value && value !== 0 && value !== this.defaultValue) {
        this.$emit('change', this.defaultValue)
        this.$emit('input', this.defaultValue)
      }
    }
  }
}
</script>
