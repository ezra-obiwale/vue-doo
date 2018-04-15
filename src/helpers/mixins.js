import Http from './http';
import OldStore from './store';
import EventBus from './event-bus';
import Hello from 'hellojs';
import Swal from 'sweetalert';
import Toasted from 'vue-toasted';
import { Store, mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import createdPersistedState from 'vuex-persistedstate';

let VueSocialSharing = require('vue-social-sharing');
let getTargets = (obj, key, ignoreDots = false) => {
  if (!ignoreDots && typeof key === 'string' && key.indexOf('.') !== -1) {
    let parts = key.split('.');
    key = parts.pop();
    parts.forEach(part => {
      if (Array.isArray(obj)) {
        while (obj[part] === undefined) {
          obj.push({});
        }
      }
      else if (!obj[part]) {
        obj[part] = {};
      }
      obj = obj[part];
    });
  }
  return {
    key: key,
    obj: obj
  };
};

export default class {

  /**
   * Class constructor
   * @param {object} options Keyss include store (object), http (object)
   */
  constructor(Vue, options = {}) {
    this.options = options;
    this.store = new OldStore(options.store, Vue);
    Vue.use(Toasted, options.toasts);
    Vue.use(VueSocialSharing)
  }

  all() {
    let mixins = this;
    let options = this.options;
    let AppStore = this.store;
    let deepValue = (target, baseObject, def) => {
      if (!target) return def;
      let value = baseObject || {},
        parts = target.split('.');
      for (let i = 0; i < parts.length; i++) {
        if (!value) break;
        let cur = value[parts[i]];
        value = cur;
      }
      return value !== undefined && value !== null
        ? value : def;
    };
    let path = path => {
      return options.navPath ? options.navPath(path) : path;
    };


    return {
      beforeCreate() {
        this.$event = EventBus;
        this.$http = new Http(options.http);
        this.$hello = Hello;

        let $vm = this;
        this.$nav = {
          path: path,
          push() {
            let args = Array.from(arguments);
            args[0] = path(args[0]);
            return $vm.$router.push(...args);
          },
          replace() {
            let args = Array.from(arguments);
            args[0] = path(args[0]);
            return $vm.$router.replace(...args);
          }
        };

        if (!mixins.$store) {
          mixins.$store = true;

          var store = options.store || {},
            modules = {};
          for (var mod in store.modules) {
            modules[mod] = store.modules[mod];
            if (typeof store.modules[mod] == 'function') {
              modules[mod] = modules[mod]($vm);
            }
          }
          mixins.$store = new Store({
            plugins: [createdPersistedState(store)],
            modules: modules
          });
        }

        this.$store = mixins.$store;
      },
      methods: {
        deepDelete(target, baseObject) {
          let value = baseObject || {},
            parts = target.split('.'),
            last = parts.pop(parts.length - 1),
            next = parts.shift();

          if (Array.isArray(baseObject) && next === '*') {
            parts.push(last);
            let joined = parts.join('.');
            baseObject.forEach((val, i) => {
              this.deepDelete(joined, baseObject[i]);
            });
          }
          else {
            while (next !== undefined) {
              let cur = value[next];
              if (typeof cur === 'object') {
                parts.push(last);
                return this.deepDelete(parts.join('.'), value[next]);
              }
              else
                value = value[next];
              next = parts.shift();
            }

            if (Array.isArray(value))
              value.splice(last, 1);
            else if (typeof value === 'object')
              delete value[last];
          }
          return baseObject;
        },
        deepValue: deepValue,
        env(key, def) {
          let env = process.env[key.toUpperCase()];

          if (env !== undefined) {
            try {
              return eval(env);
            }
            catch (e) {
              return env;
            }
          }
          return def;
        },
        findIn(data, func, def) {
          let result = undefined;
          if (typeof func === 'function') {
            if (Array.isArray(data)) {
              result = data.find(func);
            }
            else {
              for (let a in data) {
                if (func(data[a], a)) {
                  result = data[a];
                  break;
                }
              }
            }
          }
          return result === undefined ? def : result;
        },
        hello: Hello.init(deepValue('hello.credentials', options, {}), deepValue('hello.options', options, {})),
        imagePreview(input, callback) {
          input.onchange = function () {
            let reader = new FileReader();

            reader.onload = function (e) {
              // get loaded data and render thumbnail.
              if (typeof callback == 'function') {
                callback(e.target.result);
              }
            };

            // read the image file as a data URL.
            reader.readAsDataURL(this.files[0]);
          };
        },
        onHello(callback) {
          Hello.on("auth.login", auth => {
            if (typeof callback === 'function') {
              callback(auth);
            }
          });
        },
        pull(key, obj) {
          let targets = getTargets(obj, key);
          if (Array.isArray(targets.obj)) {
            return targets.obj.splice(targets.key, 1)[0];
          }
          else if (targets.obj) {
            return this.$delete(targets.obj, targets.key);
          }
        },
        pullValue(value, obj, func) {
          let pos;
          if (value === undefined || !obj) return;

          if (Array.isArray(obj)) {
            pos = func ? obj.findIndex(func) : obj.indexOf(value);
            if (pos === -1) return;
          }
          else if (obj) {
            for (let a in obj) {
              if (func) {
                let ps = func(obj[a], a);
                if (ps) {
                  pos = a;
                  break;
                }
              }
              else {
                let _value = typeof value === 'object'
                  ? JSON.stringify(value)
                  : value;
                let _value2 = typeof obj[a] === 'object'
                  ? JSON.stringify(obj[a])
                  : obj[a];

                if (_value == _value2) {
                  pos = a;
                  break;
                }
              }
            }
          }

          if (obj) return this.pull(pos, obj);
        },
        push(value, obj, key, ignoreDots = false) {
          let targets = getTargets(obj, key, ignoreDots);
          if (Array.isArray(targets.obj)) {
            if (targets.key === undefined) obj.push(value);
            else obj.splice(targets.key, 0, value);
          }
          else if (targets.obj) {
            this.$set(targets.obj, targets.key, value);
          }
        },
        range(start, end, step) {
          // only one parameter: end
          if (end === undefined) {
            end = start;
            start = 0;
          }
          let range = [],
            increment = start < end,
            current = start;
          step = Math.abs(step || 1);
          if (increment) {
            end++;
          }
          else {
            end--;
          }
          while (current !== end) {
            range.push(current);
            if (increment) current += step;
            else current -= step;
          }
          return range;
        },
        set(key, value, obj) {
          if (key === undefined) return;
          let targets = getTargets(obj, key);
          if (Array.isArray(targets.obj)) {
            targets.obj.splice(targets.key, 1, value);
          }
          else if (targets.obj) {
            this.push(value, targets.obj, targets.key);
          }
        },
        store(key, value) {
          // get key
          if (key && value === undefined) {
            return AppStore.get(key);
          }
          // set key to value
          else if (value !== undefined) {
            return AppStore.set(key, value);
          }
          // get store object
          else {
            return AppStore;
          }
        },
        swal: Swal,
        toast(message, options) {
          return this.$toasted.show(message, options);
        }
      }
    };
  }
}
