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
  install(Vue, options) {
    if (Vue._vutilv_) {
      return;
    }

    options = options || {};

    Vue._vutilv_ = true;

    let mixins = new Mixins(Vue, options);

    // Add mixins
    Vue.mixin(mixins.all());

    let camelToHyphen = str => {
      return str.split(/(?=[A-Z])/).join('-').toLowerCase();
    };
    let registerComponents = group => {
      for (let component in group) {
        let comp = group[component];
        Vue.component(camelToHyphen(component), comp);
      }

    };

    registerComponents(components);
  },
  store(options, Vue) {
    return new Store(options, Vue);
  }
};

export default VueDoo;
