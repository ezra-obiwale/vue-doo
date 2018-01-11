import Mixins from './helpers/mixins';

const VueUI = {
  install: function (Vue, options = {}) {
    if (Vue._vutilv_) {
      return;
    }

    Vue._vutilv_ = true;

    let mixins = new Mixins(options);

    // Add mixins
    Vue.mixin(mixins.all());

    // Register layouts
    for (let component in layouts.default) {
      let comp = layouts.default[component];
      Vue.component(this.camelToHyphen(comp.name), comp);
    }
    // Register snippets
    for (let component in snippets.default) {
      let comp = snippets.default[component];
      Vue.component(this.camelToHyphen(comp.name), comp);
    }
    // Register utils
    for (let component in utils.default) {
      let comp = utils.default[component];
      Vue.component(this.camelToHyphen(comp.name), comp);
    }

    Vue.component(this.camelToHyphen(dashboard.name), dashboard);

  },
  camelToHyphen: function(str) {
    return str.split(/(?=[A-Z])/).join('-').toLowerCase();
  }
};

export default VueUI;
