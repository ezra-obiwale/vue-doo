<template>
  <router-link :to="url">
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
      return this._processUrls(this.to);
    }
  }
}
</script>
