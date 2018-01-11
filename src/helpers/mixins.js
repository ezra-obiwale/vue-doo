import Http from './http';
import Store from './store';
import EventBus from './event-bus';

export default class {
  /**
   * Class constructor
   * @param {object} options Keyss include sotre (object), http (object)
   */
  constructor(options = {}) {
    this.options = options;
  }

  all() {
    let AppStore = new Store(this.options.store).vuex();
    return {
      data() {
        return {
          $http: new Http(this.options.http),
          $eventBus: EventBus
        }
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
        findBy(key, value, data) {
          let result = null;
          if (Array.isArray(data)) {
            result = data.find(function (item) {
              return item[key] == value;
            });
          }
          else {
            for (let a in data) {
              if (data[a][key] == value) {
                result = data[a];
                break;
              }
            }
          }
          return result || {};
        },
        fromStore(key, remove = false) {
          let value = AppStore.state[key];
          if (remove)
            AppStore.dispatch('remove', key);
          return value;
        },
        getTargets(obj, key, asIs = false) {
          if (!asIs && typeof key === 'string' && key.indexOf('.') !== -1) {
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
        },
        pull(obj, key) {
          let targets = this.getTargets(obj, key);
          if (Array.isArray(targets.obj)) {
            return targets.obj.splice(targets.key, 1)[0];
          }
          else if (targets.obj) {
            return this.$delete(targets.obj, targets.key);
          }
        },
        pullValue(obj, value) {
          let pos,
            targets = this.getTargets(obj, key);
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
          if (targets.obj) this.pull(targets.obj, pos);
        },
        push(obj, value, key, asIs = false) {
          let targets = this.getTargets(obj, key, asIs);
          if (Array.isArray(targets.obj)) {
            if (targets.key === undefined) obj.push(value);
            else obj.splice(targets.key, 0, value);
          }
          else if (targets.obj) {
            this.$set(targets.obj, targets.key, value);
          }
        },
        range(start, end, step) {
          let range = [],
            increment = start < end,
            current = start;
          step = step || 1;
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
        set(obj, key, value) {
          if (!key) return;
          let targets = this.getTargets(obj, key);
          if (Array.isArray(targets.obj)) {
            targets.obj.splice(targets.key, 1, value);
          }
          else if (targets.obj) {
            this.push(targets.obj, value, targets.key);
          }
        },
        toStore(key, value) {
          return AppStore.dispatch('set', { key: key, value: value });
        }
      }
    };
  }
}
