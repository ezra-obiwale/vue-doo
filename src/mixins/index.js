import Http from './http'
import Hello from 'hellojs'
import Swal from 'sweetalert'
import Toasted from 'vue-toasted'
import WSocket from '../wsocket'

let VueSocialSharing = require('vue-social-sharing')
let getTargets = (obj, key, ignoreDots = false) => {
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

export default (Vue, options = {}) => {
  const deepValue = (target, baseObject, def) => {
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
  const path = options.navPath || (path => path)

  let mixins = {
    beforeCreate () {
      if (options.features.hello) {
        this.$hello = Hello
      }
      if (options.features.http) {
        this.$http = new Http(options.http)
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
        else if (link.indexOf('://') === -1) {
          this.$router.push(link)
        }
      },
      /**
       * Delete a key from an object
       * @param {string} target The dot-notation path to the key to delete
       * @param {object} baseObject The object to delete from
       * @returns {object}
       */
      deepDelete (target, baseObject) {
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
      deepValue: deepValue,
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
      imagePreview (input, callback) {
        input.onchange = function () {
          let reader = new FileReader()

          reader.onload = function (e) {
            // get loaded data and render thumbnail.
            if (typeof callback == 'function') {
              callback(e.target.result)
            }
          }

          // read the image file as a data URL.
          reader.readAsDataURL(this.files[0])
        }
      },
      pull (key, obj) {
        let targets = getTargets(obj, key)
        if (Array.isArray(targets.obj)) {
          return targets.obj.splice(targets.key, 1)[0]
        }
        else if (targets.obj) {
          return this.$delete(targets.obj, targets.key)
        }
      },
      pullValue (value, obj, func) {
        let pos
        if (value === undefined || !obj) return

        if (Array.isArray(obj)) {
          pos = func ? obj.findIndex(func) : obj.indexOf(value)
          if (pos === -1) return
        }
        else if (obj) {
          for (let a in obj) {
            if (func) {
              let ps = func(obj[a], a)
              if (ps) {
                pos = a
                break
              }
            }
            else {
              let _value = typeof value === 'object'
                ? JSON.stringify(value)
                : value
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

        if (obj) return this.pull(pos, obj)
      },
      push (value, obj, key, ignoreDots = false) {
        let targets = getTargets(obj, key, ignoreDots)
        if (Array.isArray(targets.obj)) {
          if (targets.key === undefined) obj.push(value)
          else obj.splice(targets.key, 0, value)
        }
        else if (targets.obj) {
          this.$set(targets.obj, targets.key, value)
        }
      },
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
      set (key, value, obj) {
        if (key === undefined) return
        let targets = getTargets(obj, key)
        if (Array.isArray(targets.obj)) {
          targets.obj.splice(targets.key, 1, value)
        }
        else if (targets.obj) {
          this.push(value, targets.obj, targets.key)
        }
      }
    }
  }

  if (config.features.hello) {
    mixins.hello = Hello.init(deepValue('hello.credentials', options, {}), deepValue('hello.options', options, {}))
    mixins.onHello = callback => {
      Hello.on("auth.login", auth => {
        if (typeof callback === 'function') {
          callback(auth)
        }
      })
    }
  }
  if (options.features.socialSharing) {
    Vue.use(VueSocialSharing)
  }
  if (options.features.sweetalert) {
    mixins.swal = Swal
  }
  if (config.features.toasts) {
    Vue.use(Toasted, typeof options.features.toasts == 'object' ? options.features.toasts : {})
    mixins.toasts = (message, options) => {
      return this.$toasted.show(message, options)
    }
  }

  return mixins

}
