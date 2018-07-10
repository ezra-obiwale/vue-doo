<template>
  <div :class="rowClass">
    <template v-for="(field, index) in fields">
      <div
        :key="index"
        :class="field.columnClass || columnClass"
        v-if="show(field)">
        <slot name="field"
          :data.sync="data[field.name]"
          :error="errors[field.name]"
          :events="events(field)"
          :field="field" >
          <vd-form-field
            :id="field.name"
            :name="field.element.name"
            :default-value="field.element.defaultValue"
            :error="errors[field.name]"
            :class="dFieldClass(field)"
            v-bind="field.element.attributes || {}"
            v-model="data[field.name]"
            v-on="events(field)" />
        </slot>
        <input
          v-if="field.formFriendly"
          :name="cleanName(field)"
          type="hidden"
          :value="cleanValue(field)" />
      </div>
    </template>
  </div>
</template>
<script>

import * as Validators from 'vuelidate/lib/validators'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: "VdFormFields",
  props: {
    columnClass: {
      type: String,
      default: 'col-12'
    },
    fieldClass: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      required: true
    },
    rowClass: {
      type: String,
      default: 'row'
    },
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  inheritAttrs: false,
  data() {
    return {
      data: {},
      errors: {},
      validations: {}
    }
  },
  validations() {
    return this.validations
  },
  components: {
    VdFormField: () => import("./VdFormField.vue")
  },
  computed: {
    validator () {
      return this.$v
    }
  },
  methods: {
    cleanName(field) {
      if (field.name.indexOf('.') !== -1) {
        return field.name.replace('.', '[').replace(/\./g, '][') + ']'
      }
      return field.name
    },
    cleanValue (field) {
      let value = this.data[field.name]
      if (value === true) {
        value = 1
      } else if (value === false) {
        value = 0
      }
      return value
    },
    dFieldClass (field) {
      return field.element.class !== undefined ? field.element.class : this.fieldClass
    },
    events (field) {
      let fieldEvents = Object.assign({}, field.element.events || {}),
        events = {
          blur: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue('element.events.blur', field) == 'function') {
              field.element.events.blur(value)
            }
          },
          change: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue('element.events.change', field) == 'function') {
              field.element.events.change(...arguments)
            }
            let data = { ...this.data }
            data[field.name] = value
            this.$emit('change', data)
          },
          input: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue('element.events.input', field) == 'function') {
              field.element.events.input(...arguments)
            }
            let data = { ...this.data }
            data[field.name] = value
            this.$emit('input', data)
          }
        }

      delete fieldEvents.blur
      delete fieldEvents.input

      return Object.assign(events, fieldEvents)
    },
    hasError() {
      this.$v.$touch()
      return this.$v.$error
    },
    shouldValidate(field, index) {
      if (field.validation) {
        let validation = {}
        if (typeof field.validation == 'string') {
          let rules = field.validation.split('|')
          rules.forEach(rule => {
            let parts = rule.split(':'),
              name = parts[0]

            if (['requiredIf', 'requiredUnless'].indexOf(name) !== -1) {
              name = 'required'
            }
            else if (name.startsWith('sameAs')) {
              validator = name.replace('sameAs','')
              validator = validator[0].toLowerCase() + validator.substr(1)
            }

            validation[parts[0]] = parts.length > 1
              ? Validators[parts[0]](...parts[1].split(','))
              : Validators[parts[0]]
          })
        }
        else {
          validation = field.validation
        }
        this.set(this.validations, field.name, validation)
        this.set(this.errors, field.name, false)
      }
    },
    show (field) {
      if ('show' in field) {
        if (typeof field.show == 'function') {
          return field.show(this.value)
        }
        return field.show
      }
      return true
    },
    touch(name) {
      if (!this.$v[name]) {
        return
      }
      this.$v[name].$touch()
      this.errors[name] = this.$v[name].$error || false
    }
  },
  created() {
    this.fields.forEach(field => {
      this.shouldValidate(field)
      this.$options.computed[field.name] = function() {
        let name = field.name
        if (['requiredIf', 'requiredUnless'].indexOf(name) !== -1) {
          name = 'required'
        }
        else if (name.startsWith('sameAs')) {
          name = 'sameAs'
        }
        return this.$v[name]
      }
    })
  },
  watch: {
    validator: {
      deep: true,
      handler(validations) {
        for(let field in validations) {
          this.errors[field] = validations[field].$error
        }
      }
    },
    value: {
      deep: true,
      handler(value) {
        if (JSON.stringify(value) !== JSON.stringify(this.data)) {
          this.$set(this, 'data', value)
        }
      }
    }
  }
}
</script>
