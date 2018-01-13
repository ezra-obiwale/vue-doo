import Mixins from './src/helpers/mixins';
import Store from './src/helpers/store';

const VueUI = {
  install: function (Vue, options = {}) {
    if (Vue._vutilv_) {
      return;
    }

    Vue._vutilv_ = true;

    let mixins = new Mixins(Vue, options);

    // Add mixins
    Vue.mixin(mixins.all());

    let registerComponent = group => {
      for (let component in group.default) {
        let comp = group.default[component];
        Vue.component(this.camelToHyphen(comp.name), comp);
      }

    };
    let camelToHyphen = (str) => {
      return str.split(/(?=[A-Z])/).join('-').toLowerCase();
    };
  },
  store(options, Vue) {
    return new Store(options, Vue);
  }
};

export default VueUI;
