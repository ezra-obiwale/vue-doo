<template>
  <router-link @click.native="$emit('click', $event)" :to="url">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    url() {
      return this.$nav.path(this.to);
    }
  }
}
</script>
