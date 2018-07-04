<template>
  <router-link @click.native="$emit('click', $event)" :to="path">
    <slot :path="path"></slot>
  </router-link>
</template>

<script>
export default {
  name: 'VdLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    path() {
      return this.$nav.path(this.to);
    }
  }
}
</script>
