import Mixins from './src/helpers/mixins';
import Store from './src/helpers/store';
import components from './src/components';

const VueDoo = {
  /**
   * Installs the Vue plugin
   *
   * @param {object} Vue Instance of vue to work with
   * @param {object} options Options for this plugin. Keys include http (object) and store (object)
   * @return {nothing}
   */
  install: function (Vue, options) {
    if (Vue._vutilv_) {
      return;
    }

    options = options || {};

    Vue._vutilv_ = true;

    var mixins = new Mixins(Vue, options);

    // Add mixins
    Vue.mixin(mixins.all());

    var camelToHyphen = function (str) {
      return str.split(/(?=[A-Z])/).join('-').toLowerCase();
    };
    var registerComponents = function (group) {
      for (var component in group) {
        var comp = group[component];
        Vue.component(camelToHyphen(component), comp);
      }

    };

    registerComponents(components);
  },
  store: function (options, Vue) {
    return new Store(options, Vue);
  }
};

export default VueDoo;
