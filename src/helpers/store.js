import Vue from 'vue';
import Vuex from 'vuex';
import createdPersistedState from 'vuex-persistedstate';


export default class {
  /**
   * Class constructor
   * @param {object} options Keys include name (string)
   */
  constructor(options = {}, _Vue) {
    if (!_Vue) {
      _Vue = Vue;
    }

    _Vue.use(Vuex);

    this.options = options;
    this.vuex = new Vuex.Store({
      plugins: [createdPersistedState({
        key: options.name || 'vuex'
      })],
      state: {},
      mutations: {
        SET(state, payload) {
          if (payload.key) state[payload.key] = payload.value;
        },
        REMOVE(state, key) {
          delete state[key];
        }
      },
      actions: {
        set({ commit }, data) {
          return commit('SET', data);
        },
        remove({ commit }, key) {
          return commit('REMOVE', key)
        }
      }
    })
  }

  get(key) {
    let value = this.vuex.state[key];
    return value;
  }

  remove(key) {
    this.vuex.dispatch('remove', key);
    return this;
  }

  set(key, value) {
    this.vuex.dispatch('set', { key: key, value: value });
    return this;
  }
}
