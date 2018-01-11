import Vue from 'vue';
import Vuex from 'vuex';
import createdPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default class {
  /**
   * Class constructor
   * @param {object} options Keys include name (string)
   */
  constructor(options = {}) {
    this.options = options;
  }

  vuex() {
    return new Vuex.Store({
      plugins: [createdPersistedState({
        key: this.options.name || 'vuex'
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
    });
  }
}
