import mixins from './src/mixins'
import RestStore from './src/store/rest'

export default {

  /**
   * Installs the Vue plugin
   *
   * @param {object} Vue Instance of vue to work with
   * @param {object} options Options for this plugin. Keys include (object) components, (object) features, (object) store - required for VdRest
   * @return {nothing}
   */
  install: function (Vue, options) {
    options = Object.assign({
      features: {
        http: true
      }
    }, options || {})

    Vue.mixin(mixins(Vue, options))

    if (options.store) {
      try {
        options.store.registerModule('vdrs', RestStore)
        Vue.prototype._vdrs = true
      } catch (e) {
        throw e
      }
    }

    if (typeof options.components == 'object') {
      if (Array.isArray(options.components.misc) &&
        options.components.misc.indexOf('VdRest') != -1 &&
        !Vue.prototype._vdrs) {
        console.error('Component VdRest requires that a vuex store should be provided in VueDoo install options')
        options.components.misc.splice(options.components.misc.indexOf('VdRest'), 1)
      }
      this.components(Vue, options.components)
    }
  },
  components: function (Vue, components) {
    for (let dir in components) {
      if (Array.isArray(components[dir])) {
        components[dir].forEach(componentName => {
          try {
            Vue.component(componentName, () => new Promise((resolve, reject) => {
                import(`./src/components/${dir}/${componentName}.vue`)
                  .then(resolve)
                  .catch(_ => {
                    import(`./src/components/${dir}/${componentName}.js`)
                      .then(resolve)
                      .catch(reject)
                  })
              })
            )
          } catch (e) {
            console.error(e)
          }
        })
      }
    }
  }
}
