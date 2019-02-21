<template>
  <component
    v-if="component"
    :is="component"
    v-bind="customBind"
    v-on="$listeners"
    v-model="model"
    @click="reload"
    :error="error"
    :lgas="lgas"
    :loading="loading"
    :message="message"
    :options="lgaOptions" />
  <select
    v-else
    v-bind="$attrs"
    v-on="$listeners"
    :class="$attrs.class"
    @click="reload"
    @change="changed">
    <option value="" v-if="message">
      {{ message }}
    </option>
    <template v-else
      v-for="option in lgaOptions">
      <option v-if="option.value == value"
        selected="selected"
        :value="option.value"
        :key="option.value">
        {{ option.label }}
      </option>
      <option v-else
        :value="option.value"
        :key="option.value">
        {{ option.label }}
      </option>
    </template>
  </select>
</template>

<script>
import Http from '../../http'
export default {
  name: 'VdLgas',
  inheritAttrs: false,
  props: {
    bind: {
      type: Function,
      default: () => ({})
    },
    component: {
      type: [Object, String]
    },
    loadErrorMessage: {
      type: String,
      default: 'Load failed!'
    },
    loadingMessage: {
      type: String,
      default: 'Loading ...'
    },
    noStateMessage: {
      type: String,
      default: 'Select state'
    },
    state: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      error: false,
      loading: false,
      lgas: {}
    }
  },
  computed: {
    customBind () {
      let attrs = this.$attrs,
        customAttrs = this.bind(this)
      return typeof customAttrs == 'object'
        ? Object.assign({}, attrs, customAttrs)
        : attrs
    },
    lgaOptions () {
      let options = []
      for (let id in this.lgas) {
        options.push({
          label: this.lgas[id].name,
          value: this.lgas[id][this.valueKey]
        })
      }
      return options
    },
    message () {
      if (!this.state) {
        return this.noStateMessage
      } else if (this.loading) {
        return this.loadingMessage
      } else if (this.error) {
        return this.loadErrorMessage
      }
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  },
  created () {
    if (!this.state) {
      return
    }
    this.load(this.state)
  },
  methods: {
    changed (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    },
    load (state) {
      this.loading = true
      new Http()
        .get(`//nigeria.herokuapp.com/api/v1/states/${state}/lgas`)
        .then(resp => {
          this.$set(this, 'lgas', resp.data)
          this.loading = false
        })
        .catch(resp => {
          this.notify('Load LGAs failed', 'error')
          this.error = true
          this.loading = false
        })
    },
    reload () {
      if (this.error) {
        this.error = false
        this.load(this.state)
      }
      this.$emit('click', ...arguments)
    }
  },
  watch: {
    state (value) {
      this.$set(this, 'lgas', {})
      if (value) {
        this.load(value)
      }
    }
  }
}
</script>
