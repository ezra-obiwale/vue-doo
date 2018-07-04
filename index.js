import mixins from './src/mixins'
import components from './src/components'

export default {

  /**
   * Installs the Vue plugin
   *
   * @param {object} Vue Instance of vue to work with
   * @param {object} options Options for this plugin. Keys include (object) components, (object) features
   * @return {nothing}
   */
  install: function (Vue, options) {
    options = Object.assign({
      features: {
        http: true
      }
    }, options || {})

    Vue.mixin(mixins(Vue, options))

    if (typeof options.components == 'object') {
      for (let dir in options.components) {
        if (Array.isArray(options.components[dir])) {
          options.components[dir].forEach(componentName => {
            try {
              Vue.component(componentName, () => import(`./src/components/${dir}/${componentName}`))
            } catch (e) {
              console.error(e)
            }
          })
        }
      }
    }

    var registerComponents = function (group) {
      for (var component in group) {
        var comp = group[component]
        Vue.component(camelToHyphen(component), comp)
      }

    }

    registerComponents(components)
  }
}
