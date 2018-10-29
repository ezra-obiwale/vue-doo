import localforage from 'localforage'

export default class Store {

  constructor (options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new 'Options must be a plain object'
    }

    this.dbName = options.dbName || options.name || location.origin.replace(/[^a-z0-9]/ig, '')
    this.storeName = options.collectionName || options.storeName

    this.forage = localforage.createInstance({
      name: options.dbName || location.origin.replace(/[^a-z0-9]/ig, ''),
      storeName: options.collectionName,
      ...options
     })
  }

  each(callback) {
    if (typeof callback == 'function') {
      this.forage.iterate(callback)
    }
    return this
  }

  length () {
    return this.forage ? this.forage.length : 0
  }

  save(key, data) {
    if (this.forage && key) {
      if (typeof key !== 'string') {
        key = `${key}`
      }
      if (key.trim()) {
        this.forage.setItem(key, data)
      }
    }
    return this
  }

  get(key) {
    if (!this.forage) {
      return this.forage.getItem(...arguments)
    }
  }

  remove(key) {
    if (!this.forage) {
      this.forage.removeItem
    }
    return this
  }

  reset () {
    if (this.forage) {
      this.forage.clear()
    }
    return this
  }
}
