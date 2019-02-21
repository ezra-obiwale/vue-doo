<template>
  <component
    v-if="component"
    :is="component"
    v-bind="customBind"
    v-on="$listeners"
    v-model="model"
    @reload="reload"
    :error="error"
    :countries="countries"
    :loading="loading"
    :message="message"
    :options="countryOptions" />
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
      v-for="option in countryOptions">
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
  name: 'VdCountries',
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
      default: 'alpha2Code'
    }
  },
  data () {
    return {
      error: false,
      loading: true,
      countries: []
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
    countryOptions () {
      let options = []
      this.countries.forEach(country => {
        options.push({
          label: country.name,
          value: country[this.valueKey]
        })
      })
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
        .get('//restcountries.eu/rest/v2/all')
        .then(resp => {
          this.loading = false
          this.$set(this, 'countries', resp)
        })
        .catch(resp => {
          this.error = true
          this.loading = false
          this.notify('Load countries failed', 'error')
        })
    },
    reload () {
      if (this.error) {
        this.error = false
        this.load()
      }
    }
  }
}
</script>
