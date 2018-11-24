export default class WSocket {

  constructor (url) {
    this._callbacks = {}
    this.reconnectionTime = 1000
    this.queued = false
    try {
      this.queue = JSON.parse(localStorage.getItem('wsq'))
      if (!this.queue) {
        this.queue = []
      }
    } catch (e) {
      this.queue = []
    }

    if (url) {
      this.connect(url)
    }
  }

  /**
   * Connects to a websocket
   * @param {string} url The url for the websocket
   * @returns {WS}
   */
  connect (url) {
    this.url = url
    this.ws = new WebSocket(url)
    this.ws.onopen = () => {
      this._connected(...arguments)
      this.reconnectionTime = 1000
      this._resolve('connect', ...arguments)
    }
    this.ws.onerror = () => this._resolve('error', ...arguments)
    this.ws.onclose = () => {
      setTimeout(() => {
        this.connect(url)
      }, this.reconnectionTime)
      if (this.reconnectionTime < 16000) {
        this.reconnectionTime *= 2
      }
      this._resolve('disconnect', ...arguments)
    }
    this.ws.onmessage = response => {
      let message
      try {
        message = JSON.parse(response.data)
      } catch (e) {
        return this._resolve('message.error', {
          error: 'Invalid message type',
          message: response
        })
      }

      this._resolve('all', message)
      if (message.event) {
        let event = message.event
        delete message.event
        this._resolve(event, message)
      }
    }
    return this
  }

  /**
   * Emit an event
   * @param {string} event The event to emit
   * @param {any} data The data being sent
   * @returns {WS}
   */
  emit (event, data) {
    let message = JSON.stringify({
      event,
      data
    })
    if (this.ws.readyState == 1) {
      this.ws.send(message)
      this.queued = false
    } else {
      this.queue.push(message)
      this._saveQueue()
      this.queued = true
    }

    return this
  }

  /**
   * Watch an event
   * @param {string} event The event to emit
   * @param {function} callback The function to trigger
   * @returns {WS}
   */
  on (event, callback) {
    if (!this._callbacks[event]) {
      this._callbacks[event] = []
    }
    this._callbacks[event].push(callback)
    return this
  }

  /**
   * Stops watching an event. If the callback is not specified, all callbacks are removed.
   * If no event is specified, all events are not watched anymore
   * @param {string} event The event
   * @param {function} callback The callback to remove.
   * @returns {WS}
   */
  off (event, callback) {
    if (!event) {
      this._callbacks = {}
    } else if (!callback) {
      delete this._callbacks[event]
    } else {
      this._callbacks[event].forEach((cb, i) => {
        if (cb == callback) {
          this._callbacks[event].splice(i, 1)
        }
      })
    }
    return this
  }

  _connected () {
    this._resolveQueue()
  }

  _resolve (event, data) {
    if (this._callbacks[event]) {
      this._callbacks[event].forEach(callback => callback(data))
    }

    return this
  }

  _resolveQueue () {
    let message = this.queue.shift()
    while (this.readyState == 1 && message) {
      this.ws.send(message)
    }
    this._saveQueue()
  }

  _saveQueue () {
    localStorage.setItem('wsq', JSON.stringify(this.queue))
  }

}
