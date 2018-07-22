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
import { validationMixin } from 'vuelidate'
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
  mixins: [validationMixin],
  inheritAttrs: false,
  data() {
    return {
      validations: {}
    }
  },
  computed: {
    data: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    errors () {
      let errors = {}
      this.fields.forEach(field => {
        errors[field.name] = field.validation
          ? this.deepValue(this.$v, this.validationPath(field.name), {$error: false}).$error
          : false
      })
      return errors
    }
  },
  validations () {
    return this.validations
  },
  components: {
    VdFormField: () => import("./VdFormField.vue")
  },
  created () {
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

            if (!Validators[parts[0]]) {
              return
            }

            validation[name] = parts.length > 1
              ? Validators[parts[0]].apply(null, parts[1].split(','))
              : Validators[parts[0]]
          })
        }
        this.set(this.validations, this.validationPath(field.name), validation)
      }
      this.$options.computed[field.name] = function () {
        return this.deepValue(this.data, field.name)
      }
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
          },
          input: (value) => {
            this.touch(field.name)
            if (typeof this.deepValue(field, 'element.events.input') == 'function') {
              field.element.events.input(...arguments)
            }
            this.data[field.name] = value
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
      let _name = this.validationPath(name)
      if (!this.$v[_name]) {
        return
      }
      this.$v[_name].$touch()
    },
    validationPath (name) {
      return name.replace(/\./g, '.$each.')
    }
  }
}
</script>
