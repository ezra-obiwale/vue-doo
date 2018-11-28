import Vue from 'vue';
import Vuex from 'vuex';
import createdPersistedState from 'vuex-persistedstate';


export default class {
  /**
   * Class constructor
   * @param {object} options
   * @param {Vue} Vue
   */
  constructor(options = {}, _Vue) {
    if (!_Vue) {
      _Vue = Vue;
    }

    _Vue.use(Vuex);

    let plugins = []
    if (options.persist) {
      plugins.push(createdPersistedState(options))
    }

    this.vuex = new Vuex.Store({
      plugins,
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
    let val = this.get(key);
    this.vuex.dispatch('remove', key);
    return val;
  }

  set(key, value) {
    this.vuex.dispatch('set', { key: key, value: value });
    return this;
  }
}
