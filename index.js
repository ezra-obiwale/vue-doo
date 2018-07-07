import mixins from './src/mixins'

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
      this.components(Vue, options.components)
    }
  },
  components: function (Vue, components) {
    for (let dir in components) {
      if (Array.isArray(components[dir])) {
        components[dir].forEach(componentName => {
          try {
            Vue.component(componentName, () => import(`./src/components/${dir}/${componentName}`))
          } catch (e) {
            console.error(e)
          }
        })
      }
    }
  }
}
