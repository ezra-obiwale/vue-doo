<template>
  <component
    v-if="component"
    :is="component"
    v-bind="customBind"
    v-on="$listeners"
    v-model="model"
    @click="reload"
    :error="error"
    :states="states"
    :loading="loading"
    :message="message"
    :options="stateOptions" />
  <select
    v-else
    v-bind="$attrs"
    v-on="$listeners"
    :class="$attrs.class"
    @click="reload"
    @change="changed" >
    <option value="" v-if="message">
      {{ message }}
    </option>
    <template v-else
      v-for="option in stateOptions">
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
  name: 'VdStates',
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
      loading: true,
      states: {}
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
    message () {
      if (this.loading) {
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
    },
    stateOptions () {
      let options = []
      for (let id in this.states) {
        options.push({
          label: this.states[id].name,
          value: this.states[id][this.valueKey]
        })
      }
      return options
    }
  },
  created () {
    this.load()
  },
  methods: {
    changed (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    },
    load () {
      this.loading = true
      new Http()
        .get('//nigeria.herokuapp.com/api/v1/states/')
        .then(resp => {
          this.loading = false
          this.$set(this, 'states', resp.data)
        })
        .catch(resp => {
          this.error = true
          this.loading = false
          this.notify('Load states failed', 'error')
        })
    },
    reload () {
      if (this.error) {
        this.error = false
        this.load()
      }
      this.$emit('click', ...arguments)
    }
  }
}
</script>
