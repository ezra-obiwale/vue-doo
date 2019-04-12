import Hello from 'hellojs'
import Http from '../http'
import Swal from 'sweetalert'
import Toasted from 'vue-toasted'
import WSocket from '../wsocket'

let VueSocialSharing = require('vue-social-sharing')
let loadedScripts = {}

export default (Vue, options = {}) => {
  const deepValue = (baseObject, target, def) => {
    if (!target) return def
    let value = baseObject || {},
      parts = target.split('.')
    for (let i = 0; i < parts.length; i++) {
      if (!value) break
      let cur = value[parts[i]]
      value = cur
    }
    return value !== undefined && value !== null
      ? value : def
  }
  const getTargets = (obj, key, ignoreDots = false) => {
    if (!ignoreDots && typeof key === 'string' && key.indexOf('.') !== -1) {
      let parts = key.split('.')
      key = parts.pop()
      parts.forEach(part => {
        if (Array.isArray(obj)) {
          while (obj[part] === undefined) {
            obj.push({})
          }
        }
        else if (!obj[part]) {
          obj[part] = {}
        }
        obj = obj[part]
      })
    }
    return {
      key: key,
      obj: obj
    }
  }
  const path = options.navPath || (path => path)

  if (options.features.socialSharing) {
    Vue.use(VueSocialSharing)
  }
  if (options.features.toasts) {
    Vue.use(Toasted, typeof options.features.toasts == 'object' ? options.features.toasts : {})
  }
  if (options.features.http) {
    Vue.prototype.$http = new Http(typeof options.features.http == 'object' ? options.features.http : options.http)
  }

  let mixins = {
    beforeCreate () {
      if (options.features.hello) {
        this.$hello = Hello
      }
      if (options.features.sweetalert) {
        this.$swal = Swal
      }
      if (options.features.toasts) {
        this.$toasts = (message, options) => {
          return this.$toasted.show(message, options)
        }
      }

      let $vm = this
      this.$nav = {
        path() {
          return path.call($vm, ...arguments)
        },
        push() {
          let args = Array.from(arguments)
          args[0] = path.call($vm, args[0])
          return $vm.$router.push(...args)
        },
        replace() {
          let args = Array.from(arguments)
          args[0] = path.call($vm, args[0])
          return $vm.$router.replace(...args)
        }
      }
    },
    created () {
      if (options.features.wsocket) {
        let events = this.$options['sockets']
        if (events) {
          let ws = new WSocket(url)

          this.$options.sockets = new Proxy({}, {
            set: (target, key, value) => {
              if (typeof value == 'function') {
                ws.on(key, value.bind(this))
              }
              target[key] = value
              return true
            },
            deleteProperty: (target, key) => {
              ws.off(key)
              delete target.key
              return true
            }
          })

          for (let key in events) {
            this.$options.sockets[key] = events[key]
          }

          Vue.prototype.$ws = ws
        }
      }
      if (this.$http) {
        this.$http.setVue(this)
      }
    },
    beforeDestroy () {
      if (options.features.wsocket) {
        let events = this.$options['sockets'] || {}
        for (let key in events) {
          delete this.$options.sockets[key]
        }
      }
    },
    methods: {
      /**
       * Returns the function or the default function if the first is not a function
       * @param {function} func The function
       * @param {function} defFunc The default function
       * @returns {function}
       */
      callable (func, defFunc) {
        return typeof func == 'function' ? func : (defFunc || (() => {}))
      },
      /**
       * Capitalize a string
       * @param {string} str The string
       * @returns {string}
       */
      capitalize (str) {
        return typeof str == 'string' && str
          ? (' ' + str)
            .toLowerCase()
            .replace(/\s[a-z]/g, letter => letter.toUpperCase())
            .substr(1)
          : str
      },
      /**
       * Fetches the css classes on the current component as an object
       * @returns {object}
       */
      classObject () {
        let css = {}
        if (typeof this.$attrs.class === 'string') {
          this.$attrs.class.replace(/\s\s/gi, ' ')
            .split(' ')
            .forEach(className => cls[className.trim()] = true)
        } else if (typeof this.$attrs.class == 'object') {
          css = this.$attrs.class
        }
        return css
      },
      /**
       * Handles click event for an a element
       * @param {object} e The event object
       * @param {string} link The link to connect to
       * @returns {nothing}
       */
      clicked (e, link) {
        link = link || e.target.href
        if (link === '#') {
          e.preventDefault()
        }
        else if (typeof link == 'string' && link.indexOf('://') === -1) {
          this.$router.push(link)
        }
      },
      /**
       * Turns a number to a currency
       * @param {number|string} amount The number
       * @param {string} separator The separator. Defaults to comma (,)
       * @returns {string}
       */
      currency (amount, separator = ',') {
        // ensure positive sign and turn to string
        let amtStr = `${Math.abs(amount)}`,
          // get dot position
          dotPos = amtStr.indexOf('.'),
          // turn string without dot to array
          amtArr = dotPos > -1 ? amtStr.substr(0, dotPos).split('') : amtStr.split(''),
          // find the first separator position
          sepPos = amtArr.length % 3
        // set first separator position if 0
        if (!sepPos) {
          sepPos = 3
        }
        while (sepPos < amtArr.length) {
          // add separator
          amtArr.splice(sepPos, 0, separator)
          // set next position for currency
          sepPos += 4
        }
        // get currency string and ensure correct sign
        let cur = parseFloat(amount) < 0 ? '-' + amtArr.join('') : amtArr.join('')
        // append decimal value and return currency
        return dotPos > -1 ? cur + amtStr.substr(dotPos) : cur
      },
      /**
       * Delete a key from an object
       * @param {object} baseObject The object to delete from
       * @param {string} target The dot-notation path to the key to delete
       * @returns {object}
       */
      deepDelete (baseObject, target) {
        let value = baseObject || {},
          parts = target.split('.'),
          last = parts.pop(parts.length - 1),
          next = parts.shift()

        if (Array.isArray(baseObject) && next === '*') {
          parts.push(last)
          let joined = parts.join('.')
          baseObject.forEach((val, i) => {
            this.deepDelete(joined, baseObject[i])
          })
        }
        else {
          while (next !== undefined) {
            let cur = value[next]
            if (typeof cur === 'object') {
              parts.push(last)
              return this.deepDelete(parts.join('.'), value[next])
            }
            else
              value = value[next]
            next = parts.shift()
          }

          if (Array.isArray(value))
            value.splice(last, 1)
          else if (typeof value === 'object')
            delete value[last]
        }
        return baseObject
      },
      /**
       * Fetches the value of the target from the base object
       *
       * @param {object} baseObject Object to get the value from
       * @param {string} target Dot-notation path to value
       * @param {any} def The default value if real value is null or undefined
       * @return {any}
       */
      deepValue: deepValue,
      /**
       * Fetches the domain from the given url
       * @param {string} url
       * @param {boolean} removePort
       * @returns {string}
       */
      domainFromUrl (url, removePort) {
        let domainName = url,
          pIndex = url.indexOf('://')
        // remove protocol
        if (pIndex !== -1) {
          domainName = url.substr(pIndex + 3)
        }
        let sIndex = domainName.indexOf('/')
        // remove everything after domain name (from slash)
        if (sIndex !== -1) {
          domainName = domainName.substr(0, sIndex)
        }

        pIndex = domainName.indexOf(':')
        // remove port, if required
        if (removePort && pIndex !== -1) {
          domainName = domainName.substr(0, pIndex)
        }

        return domainName
      },
      /**
       * Emits the given event with the given params and passes a function to the listener to be called after processing.
       * @param {object} config Object with keys `event` (string, `params` (array),
       * `proceed` (function), `cancel` (function) and `handle` function
       * @returns {nothing}
       */
      emit ({ event, params, error, proceed, cancel, handle }) {
        if (!event) {
          return
        }
        params = params || []
        proceed = proceed || (() => {})
        cancel = cancel || (() => {})
        error = error || (() => {})
        handle = handle || (() => {})

        if (!this.$listeners[event]) {
          return handle(proceed, error, null, ...params)
        }

        let reset = () => {
          handle = () => {}
          proceed = () => {}
          error = () => {}
          cancel = () => {}
        }

        this.$emit(event, (resultOrOptions, err) => {
          if (resultOrOptions === undefined) {
            // not handled
            handle(proceed, error, resultOrOptions, ...params)
            reset()
          }
          else if (resultOrOptions) {
            // proceed
            proceed(
              typeof resultOrOptions == 'boolean' ? params[0] : resultOrOptions,
              ...params
            )
            reset()
          }
          else if (err) {
            // error
            error(err, ...params)
            reset()
          }
          else {
            // cancel
            cancel(...params)
            reset()
          }
        }, ...params)
      },
      /**
       * Checks if the data is of the type required
       * @param {string} type The type of data required
       * @param {any} data The data being checked
       * @param {any} def The default to return if check does fails
       * @returns {any}
       */
      isOr (type, data, def) {
        let is = false
        if (type === 'array') {
          is = Array.isArray(data)
        }
        else {
          is = typeof data === type
        }

        return is ? data : def
      },
      /**
       * Remove given keys from the given object
       * @param {object} obj The target object
       * @param {string|Array} keys The keys on the object to remove
       * @returns {object} The new object
       */
      keysExcept (obj, keys) {
        if (!Array.isArray(keys)) {
          keys = [keys]
        }

        let objClone = {}

        Object.assign(objClone, obj)

        keys.forEach(key => this.deepDelete(objClone, key))

        return objClone
      },
      /**
       * Loads a javascript dynamically
       * @param {string} url The url of the script
       * @returns {Promise}
       */
      loadScript (url) {
        return loadedScripts[url] ?
          Promise.resolve() :
          new Promise(resolve => {
            const script = document.createElement('script')
            script.src = url
            document.getElementsByTagName('head')[0].appendChild(script)
            if (script.readyState) {  // IE
              script.onreadystatechange = () => {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                  script.onreadystatechange = null
                  loadedScripts[url] = true
                  resolve()
                }
              }
            } else {  // Others
                script.onload = () => {
                  loadedScripts[url] = true
                  resolve()
                }
            }
          })
      },
      /**
       * Fetches a key from the environment variables (process.env)
       * @param {string} key The environment key
       * @param {any} def The default value if the key doesn't exist
       * @returns {any}
       */
      env (key, def) {
        let env = process.env[key.toUpperCase()]

        if (env !== undefined) {
          try {
            return eval(env)
          }
          catch (e) {
            return env
          }
        }
        return def
      },
      /**
       * Search an object|array
       * @param {object|Array} data The object to search
       * @param {function} func The function to call with each entry in the data.
       * Return true if the entry matchhes search criteria
       * @param {any} def The default value if the search returns nothing
       * @returns {any}
       */
      findIn (data, func, def) {
        let result = undefined
        if (typeof func === 'function') {
          if (Array.isArray(data)) {
            result = data.find(func)
          }
          else {
            for (let a in data) {
              if (func(data[a], a)) {
                result = data[a]
                break
              }
            }
          }
        }
        return result === undefined ? def : result
      },
      /**
       * Return only the given keys from the given object
       * @param {object} obj The target object
       * @param {string|Array} keys The needed keys on the object
       * @returns {object} The new object
       */
      onlyKeys (obj, keys) {
        if (!Array.isArray(keys)) {
          keys = [keys]
        }

        let objClone = {}
        keys.forEach(key => objClone[key] = obj[key])

        return objClone
      },
      /**
       * Fetch the ordinal value of the given number
       * @param {integer} num The number
       */
      ordinal(num) {
        if (!num && num !== 0) return '';

        let ord = 'th';
        if (num < 4 || num > 20) {
          switch (num % 10) {
            case 1:
              ord = 'st';
              break;
            case 2:
              ord = 'nd';
              break;
            case 3:
              ord = 'rd';
              break;
          }
        }
        return num + ord;
      },
      /**
       * Pluck a key from all children of the given obj
       * @param {object} obj The object to pluck the key from
       * @param {string} key The key to pluck from the obj
       * @returns {array}
       */
      pluck (obj, key) {
        let keys = [],
          values = Object.values(obj)
        if (values.length) {
          values.forEach(item => keys.push(item[key]))
        }
        return keys
      },
      /**
       * Reactively removes deep values from objects and array
       * @param {object|array} obj The object to pull from`
       * @param {string} key The dot-noted path to the key to remove
       * @returns {any} The removed value
       */
      pull (obj, key) {
        let targets = getTargets(obj, key)
        if (Array.isArray(targets.obj)) {
          return targets.obj.splice(targets.key, 1)[0]
        }
        else if (targets.obj) {
          return this.$delete(targets.obj, targets.key)
        }
      },
      /**
       * Reactively removes a value from an object or array
       * @param {object|array} obj The object to remove from
       * @param {any} valueOrFunc The value to remove or a function that receives each item and its key in obj.
       * The function should return true if the value should be removed
       * @returns {any} The removed value
       */
      pullValue (obj, valueOrFunc) {
        let pos
        if (valueOrFunc === undefined || !obj) return

        if (Array.isArray(obj)) {
          pos = typeof valueOrFunc == 'function'
            ? obj.findIndex(valueOrFunc)
            : obj.indexOf(valueOrFunc)
          if (pos === -1) return
        }
        else if (obj) {
          for (let a in obj) {
            if (typeof valueOrFunc == 'function') {
              let ps = valueOrFunc(obj[a], a)
              if (ps) {
                pos = a
                break
              }
            }
            else {
              let _value = typeof valueOrFunc === 'object'
                ? JSON.stringify(valueOrFunc)
                : valueOrFunc
              let _value2 = typeof obj[a] === 'object'
                ? JSON.stringify(obj[a])
                : obj[a]

              if (_value == _value2) {
                pos = a
                break
              }
            }
          }
        }

        if (obj) return this.pull(obj, pos)
      },
      /**
       * Reactively adds a value to an object or array
       * @param {object|array} obj The object to push to value to
       * @param {string} key The dot-noted path key path to hold the value
       * @param {any} value The value
       * @param {boolean} ignoreDots Indicates that the key should be treated as one and not a path
       * @returns {object|array} The object or array given
       */
      $push (obj, key, value, ignoreDots = false) {
        let targets = getTargets(obj, key, ignoreDots)
        if (Array.isArray(targets.obj)) {
          if (targets.key === undefined) obj.push(value)
          else obj.splice(targets.key, 0, value)
        }
        else if (targets.obj) {
          this.$set(targets.obj, targets.key, value)
        }
        return obj
      },
      /**
       * Fetches a range of numbers.
       * @param {integer} start The starting number in the range.
       * @param {integer} end The number to stop the range at. If undefined, end === start and start === 0
       * @param {integer} step The number to increment/decrement by. Defaults to 1
       * @returns {array}
       */
      range (start, end, step) {
        // only one parameter: end
        if (end === undefined) {
          end = start
          start = 0
        }
        let range = [],
          increment = start < end,
          current = start
        step = Math.abs(step || 1)
        if (increment) {
          end++
        }
        else {
          end--
        }
        while (current !== end) {
          range.push(current)
          if (increment) current += step
          else current -= step
        }
        return range
      },
      /**
       * Reactively sets a key on an array or object
       * @param {object|array} obj The object or array
       * @param {string} key The dot-noted path to the key to hold the value
       * @param {any} value The value to set on the object
       * @returns {nothing}
       */
      set (obj, key, value) {
        if (key === undefined) return
        let targets = getTargets(obj, key)
        if (Array.isArray(targets.obj)) {
          targets.obj.splice(targets.key, 1, value)
        }
        else if (targets.obj) {
          this.$push(targets.obj, targets.key, value)
        }
      },
      /**
       * Creates a slug from the given string
       * @param {string} str The string
       * @returns {string}
       */
      strSlug (str) {
        return `${str}`.replace(/[^a-z0-9\s]/ig, '')
          .replace(/\s/g, '-')
      },
      /**
       * Fetches the styles on the current component as an object
       * @returns {object}
       */
      styleObject () {
        let style = {}
        if (typeof this.$attrs.style === 'string') {
          this.$attrs.style.split(';')
            .forEach(pair => {
              let parts = pair.split(':')
              style[parts[0].trim()] = parts[1].trim()
            })
        } else if (typeof this.$attrs.style == 'object') {
          style = this.$attrs.style
        }
        return style
      },
      /**
       * Watch file input for changes
       * @param {HTMLElement} input The file input element
       * @param {function} callback The function to call when the value changes
       * @returns {nothing}
       */
      watchFileInput(input, callback) {
        input.onchange = function () {
          let reader = new FileReader(),
            index = -1;

          reader.onload = function (e) {
            // get loaded data and render thumbnail.
            if (typeof callback == 'function') {
              callback(e.target.result, index);
            }
          };

          // read the file as a data URL.
          Array.from(this.files).forEach((file, i) => {
            index = i
            reader.readAsDataURL(file);
          })
        }
      }
    }
  }

  if (options.features.hello) {
    mixin.methods.hello = Hello.init(deepValue(options, 'hello.credentials', {}), deepValue(options, 'hello.options', {}))
    mixin.methods.onHello = callback => {
      Hello.on("auth.login", auth => {
        if (typeof callback === 'function') {
          callback(auth)
        }
      })
    }
  }

  return mixins
}
