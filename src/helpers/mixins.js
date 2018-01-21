import Http from './http';
import Store from './store';
import EventBus from './event-bus';
import Hello from 'hellojs';

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
    this.store = new Store(options.store, Vue);
  }

  all() {
    let options = this.options;
    let AppStore = this.store;

    return {
      beforeCreate() {
        this.$http = new Http(options.http);
        this.$event = EventBus;
        this.$hello = Hello;
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
        deepValue(target, baseObject, def) {
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
        },
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
        hello: Hello.init(options.hello || {}),
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
        pullValue(value, obj) {
          let pos,
            targets = getTargets(obj, key);
          if (Array.isArray(targets.obj)) {
            pos = targets.obj.indexOf(value);
            if (pos === -1) return;
          }
          else if (targets.obj) {
            let _value = typeof value === 'object'
              ? JSON.stringify(value)
              : value;
            for (let a in targets.obj) {
              let _value2 = typeof targets.obj[a] === 'object'
                ? JSON.stringify(targets.obj[a])
                : targets.obj[a];

              if (_value == _value2) {
                pos = a;
                break;
              }
            }
          }
          if (targets.obj) this.pull(pos, targets.obj);
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
          if (!key) return;
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
        }
      }
    };
  }
}
s