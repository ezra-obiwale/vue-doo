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
            v-model="data[field.dataKey || field.name]"
            v-on="events(field)" />
        </slot>
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
      data: {}
    }
  },
  computed: {
    errors () {
      let errors = {}
      this.fields.forEach(field => {
        errors[field.name] = field.validation ? this.$v.$error : false
      })
      return errors
    }
  },
  components: {
    VdFormField: () => import("./VdFormField.vue")
  },
  created () {
    this.$options.validations = {}
    this.fields.forEach(field => {
      if (field.validation) {
        let validation = field.validation
        if (typeof field.validation == 'string') {
          validation = {}
          let rules = field.validation.split('|')
          rules.forEach(rule => {
            let parts = rule.split(':'),
              name = parts[0]

            if (['requiredIf', 'requiredUnless'].indexOf(name) !== -1) {
              name = 'required'
            }
            else if (name.startsWith('sameAs')) {
              let validator = name.replace('sameAs','')
              validator = validator[0].toLowerCase() + validator.substr(1)
            }

            validation[name] = parts.length > 1
              ? Validators[parts[0]].apply(null, parts[1].split(','))
              : Validators[parts[0]]
          })
        }
        // if (field.name.indexOf('.') != -1) {
        //   let _validation = {},
        //     focus = _validation,
        //     paths = field.name.split('.'),
        //     root = paths.shift()
        //   paths.forEach(path => {
        //     focus.path = {
        //       $each: {}
        //     }
        //     focus = focus.path.$each
        //   })
        //   focus = validation
        //   this.$options.validations[root] = _validation
        // } else {
        //   this.$options.validations[field.name] = validation
        // }
        this.set(this.$options.validations, field.name.replace('.', '.$each.'), validation)
      }
      // this.$options.computed[field.name] = function () {
      //   let name = field.name
      //   if (['requiredIf', 'requiredUnless'].indexOf(name) !== -1) {
      //     name = 'required'
      //   }
      //   else if (name.startsWith('sameAs')) {
      //     name = 'sameAs'
      //   }
      //   return this.$v[name]
      // }
    })
  },
  methods: {
    cleanName(field) {
      if (field.name.indexOf('.') !== -1) {
        return field.name.replace('.', '[').replace(/\./g, '][') + ']'
      }
      return field.name
    },
    dFieldClass (field) {
      return field.element.class !== undefined ? field.element.class : this.fieldClass
    },
    events (field) {
      let fieldEvents = Object.assign({}, field.element.events || {}),
        events = {
          blur: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue(field, 'element.events.blur') == 'function') {
              field.element.events.blur(value)
            }
          },
          change: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue(field, 'element.events.change') == 'function') {
              field.element.events.change(...arguments)
            }
            this.data[field.name] = value
            this.$emit('change', this.data)
          },
          input: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue(field, 'element.events.input') == 'function') {
              field.element.events.input(...arguments)
            }
            this.data[field.name] = value
            this.$emit('input', this.data)
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
    shouldValidate(field) {
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
  }
}
</script>
