import axios from 'axios';
import EventBus from './event-bus';

export default class Http {
  /**
   * Class constructor
   * @param {object} options Keys include ajaxEvents (bool), axios (object) and catchAll (function)
   */
  constructor(options = {}) {
    this.axios = axios.create(options.axios);
    this.emitAjaxEvents = options.ajaxEvents !== false;
    this.working = 0;
  }

  delete() {
    return this._send('delete', arguments);
  }

  get() {
    return this._send('get', arguments);
  }

  head() {
    return this._send('head', arguments);
  }

  options() {
    return this._send('options', arguments);
  }

  patch() {
    return this._send('patch', arguments);
  }

  post() {
    return this._send('post', arguments);
  }

  put() {
    return this._send('put', arguments);
  }

  request() {
    return this._send('request', arguments);
  }

  _send(type, args) {
    if (!this.working && this.emitAjaxEvents) {
      EventBus.$emit('ajax.started');
    }
    this.working++;
    const responseParams = (resp) {
      return {resp.data, resp.status, resp.headers, resp};
    },
      respond = (func, resp = {}) => {
        this.working--;
        if (!this.working && this.emitAjaxEvents) {
          EventBus.$emit('ajax.ended');
        }
        func(...responseParams(resp));
      };
    return new Promise(function (resolve, reject) {
      this[type]
        .apply(this, args)
        .then(resp => {
          respond(resolve, resp);
        })
        .catch((error) => {
          let resp = error.response;
          if (typeof this.options.catchAll == 'function') {
            this.options.catchAll(...responseParams(resp));
          }
          respond(reject, resp);
        });
    }.bind(this.axios));
  }
}
