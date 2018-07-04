<template>
  <div>
    <component
      :is="el"
      v-bind="$attrs"
      v-on="$listeners"
      :value="value" />
    <input
      type="hidden"
      :name="$attrs.name"
      ref="input"
      :value="value" />
  </div>
</template>

<script>
export default {
  name: 'VdFormAlly',
  props: {
    el: {
      type: String,
      required: true
    },
    value: [String, Number]
  },
  inheritAttrs: false
}
</script>
