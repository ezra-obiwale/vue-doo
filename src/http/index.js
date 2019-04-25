import EHttp from '@ezraobiwale/http';

export default class Http extends EHttp {
  /**
   * Class constructor
   * @param {object} options 
   */
  constructor (options = {}) {
    super(options)

    this.emitAjaxEvents = true
    this.working = 0
    this.beforeResponse(() => {
      this.working--
      if (!this.working && this.emitAjaxEvents && this.$vue) {
        this.$vue.$emit('ajax.ended')
      }
    })
  }

  emitEvents (bool) {
    this.emitAjaxEvents = bool
    return this
  }

  setVue ($vue) {
    this.$vue = $vue
    return this
  }

  _send (type, args) {
    if (!this.working && this.emitAjaxEvents && this.$vue) {
      this.$vue.$emit('ajax.started')
    }
    this.working++
    
    return super._send(type, args)
  }
}
