<template>
  <div>
    <slot
      :data="data"
      :currentData="currentData"
      :loading="loading"
      :working="working"></slot>
  </div>
</template>

<script>
import store from '../../store/rest'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'VdRest',
  props: {
    breadMethods: {
      type: Object,
      default: function () {
        return {
          browse: 'GET',
          read: 'GET',
          edit: 'PUT',
          add: 'POST',
          delete: 'DELETE',
          deleteMany: 'POST'
        }
      },
      validator: function (methods) {
        return typeof methods == 'object'
          && methods.browse && methods.read
          && methods.edit && methods.add
          && methods.delete
      }
    },
    collection: {
      type: String,
      default: ''
    },
    currentPage: {
      type: Number,
      default: 0
    },
    dummyData: {
      type: [Array, Boolean],
      default: false
    },
    forceOnline: {
      type: Boolean,
      default: false
    },
    readOnlyId: {
      type: [Number, String],
      default: 0
    },
    successMessages: {
      type: Object,
      default: function () {
        return {
          add: 'Save successful',
          edit: 'Save successful',
          delete: 'Delete successful',
          deleteMany: 'Delete successful'
        }
      }
    },
    totalRowsCount: {
      type: [Function, Number],
      default: 0
    },
    url: {
      type: String
    },
    watch: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      lastUrl: null,
      loading: false,
      isOnline: window.navigator.onLine,
      working: false
    }
  },
  computed: {
    ...mapGetters('vdrs', {
      currentData: 'currentData',
      pagination: 'pagination',
      storeFilter: 'filter',
      storeData: 'data',
      searchQuery: 'searchQuery'
    }),
    data: {
      get () {
        return this.storeData
      },
      set (data) {
        if (this.dummyData) {
          return this.dummyData = data
        }
        return this.setData(data)
      }
    },
    filter: {
      get () {
        return this.storeFilter
      },
      set (filter) {
        this.setFilter(filter)
      }
    },
    nextPage () {
      return this.pagination.page + 1
    },
    search: {
      get () {
        return this.searchQuery
      },
      set (query) {
        this.changeSearchQuery(query)
      }
    }
  },
  watch: {
    collection (collection) {
      this.scopeTo(collection)
      this.urlChanged()
    },
    currentData: {
      deep: true,
      handler(data) {
        this.$emit('currentDataUpdated', data)
      }
    },
    currentPage (page) {
      this.setCurrentDataPage(page)
    },
    readOnlyId (id) {
      this.urlChanged()
    },
    search (newSearch, oldSearch) {
      if (oldSearch && !newSearch) {
        this.loadMany({ useCache: false })
      }
    },
    totalRowsCount (count) {
      if (typeof count == 'number') {
        this.setRowsCount(count)
      }
    },
    url () {
      this.resetData()
      this.urlChanged({ useCache: false })
    }
  },
  created () {
    for (let watch in this.watch) {
      this.$watch(watch, function () {
        this.watch[watch](...arguments)
      })
    }
    this.scopeTo(this.collection || Date.now())
    if (!this.isOnline) {
      this.isOnline = this.forceOnline
    }

    this.urlChanged()

    if ('ononline' in window) {
      window.ononline = () => {
        this.isOnline = true
        this.$emit('online')
      }
    }
    if ('onoffline' in window) {
      window.onoffline = () => {
        this.isOnline = false
        this.$emit('offline')
      }
    }
  },
  methods: {
    ...mapMutations('vdrs', {
      addData: 'ADD_DATA',
      changeSearchQuery: 'CHANGE_SEARCH_QUERY',
      loadData: 'LOAD_DATA',
      removeData: 'REMOVE_DATA',
      removeManyByIds: 'REMOVE_MANY_BY_IDS',
      resetCurrentData: 'RESET_CURRENT_DATA',
      resetData: 'RESET_DATA',
      scopeTo: 'SCOPE_TO',
      setCurrentData: 'SET_CURRENT_DATA',
      setCurrentDataById: 'SET_CURRENT_DATA_BY_ID',
      setCurrentDataPage: 'SET_CURRENT_DATA_PAGE',
      setFilter: 'SET_FILTER',
      setRowsCount: 'SET_ROWS_NUMBER',
      updateData: 'UPDATE_CURRENT_DATA',
      updatePagination: 'UPDATE_PAGINATION',
      updateRowsPerPage: 'UPDATE_ROWS_PER_PAGE'
    }),
    delete (id, index) {
      if (this.working) {
        return
      }
      this.working = true
      let row = this.getData(id, index)
      this.emit({
        event: 'delete',
        params: [row],
        proceed: resp => {
          this.working = false
          this.emit({
            event: 'deleteOK',
            params: [resp, false],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.removeData(id, index)
            }
          })
        },
        error: resp => {
          this.working = false
          if (resp === false) {
            return
          }
          this.emit({
            event: 'deleteError',
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            }
          })
        },
        cancel: () => {
          this.working = false
          this.$emit('deleteCanceled')
        },
        handle: (proceed, error) => {
          if (!this.url) {
            this.working = false
            return proceed(row)
          }
          if (!this.isOnline) {
            this.working = false
            return this.$emit('offline', 'delete', id, index)
          }
          let method = this.breadMethods['delete'] || 'delete'
          this.$http[method.toLowerCase()](this.withSlash() + id)
            .then(proceed)
            .catch(error)
        }
      })
    },
    deleteMany(ids) {
      if (this.working) {
        return
      }
      this.working = true
      this.emit({
        event: 'deleteMany',
        params: [ids],
        proceed: resp => {
          this.working = false
          this.emit({
            event: 'deleteManyOK',
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.removeManyByIds(ids)
            }
          })
        },
        cancel: () => {
          this.working = false
          this.$emit('deleteManyCanceled')
        },
        error: resp => {
          this.working = false
          this.emit({
            event: 'deleteManyError',
            params: [resp]
          })
        },
        handle: (proceed, error) => {
          if (!this.url) {
            this.removeManyByIds(ids)
            this.working = false
            return this.$emit('deleteManyOK', () => {}, ids, true)
          }
          if (!this.isOnline) {
            this.working = false
            return this.$emit('offline', 'deleteMany', ids)
          }
          let method = this.breadMethods['deleteMany'] || 'post'
          this.$http[method.toLowerCase()](this.withSlash() + 'delete-many', {
            ids: ids
          })
          .then(proceed)
          .catch(error)
        }
      })
    },
    getData(id, index) {
      return index !== undefined
        ? this.storeData[index]
        : this.storeData.find(data => data.id === id)
    },
    loadMany(config = {}) {
      let pagination = config.pagination || this.pagination,
        useCache = config.useCache !== false
      if (!this.url) {
        if (this.dummyData && !this.data.length) {
          this.loadData({
            data: this.dummyData,
            pagination
          })
        }
        return this.$emit('loadManyOK', () => {}, this.data, true, pagination)
      }
      this.loading = true

      let fullUrl = `${this.url}`
      fullUrl += fullUrl.indexOf('?') !== -1 ? '&' : '?'
      fullUrl += `page=${pagination.page}`
      if (this.search) {
        fullUrl += `&query=${this.search}`
      }

      if (this.filter) {
        if (typeof this.filter == 'object') {
          for (let key in this.filter) {
            if (this.filter[key]) {
              fullUrl += `&${key}=${this.filter[key]}`
            }
          }
        } else if (typeof this.filter == 'string') {
          fullUrl += this.filter.startsWith('&') ? this.filter : `&${this.filter}`
        }
      }
      if (pagination.sortBy) {
        fullUrl += `&sort=${pagination.sortBy}:${pagination.descending ? 'desc' : 'asc'}`
      }
      if (pagination.rowsPerPage) {
        fullUrl += `&length=${pagination.rowsPerPage}`
      }

      this.updateRowsPerPage(pagination.rowsPerPage)

      if ((this.lastUrl && this.lastUrl == fullUrl || !this.lastUrl) &&
          (useCache && this.data.length && (pagination.page == 1 ||
          (pagination.page - 1) * pagination.rowsPerPage < this.data.length) &&
          pagination.rowsNumber >= this.data.length)) {
        this.loading = false
        return this.$emit('loadManyOK', () => {}, this.data, true, pagination)
      }

      this.emit({
        event: 'loadMany',
        params: [fullUrl, pagination, this.search, this.filter],
        handle: (proceed, error, resultUrl) => {
          let method = this.breadMethods['browse'] || 'get'
          if (!resultUrl) {
            resultUrl = fullUrl
          }
          if (this.lastUrl == fullUrl) {
            this.loading = false
            return
          }
          if (!this.isOnline) {
            return this.$emit('offline', 'loadMany', config)
          }
          this.lastUrl = fullUrl
          this.$http[method.toLowerCase()](resultUrl)
            .then(proceed)
            .catch(error)
        },
        proceed: resp => {
          this.loading = false
          this.emit({
            event: 'loadManyOK',
            params: [resp, false, pagination],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              if (pagination.page == 1) {
                this.resetData()
              }
              this.loadData({
                data: resp.data,
                pagination
              })
              if (typeof config.done == 'function') {
                config.done(resp)
              }
            },
            cancel: () => {
              this.updatePagination(pagination)
            }
          })
          if (typeof this.totalRowsCount == 'function') {
            let count = this.totalRowsCount(resp)
            if (count !== undefined) {
              this.setRowsCount(count)
            }
          }
        },
        cancel: () => {
          this.loading = false
          this.$emit('loadManyCanceled')
        },
        error: resp => {
          this.loading = false
          if (resp === false) {
            return
          }
          this.emit({
            event: 'loadManyError',
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            }
          })
        }
      })
    },
    loadOne(id) {
      if (this.data.length) {
        let data = this.data.find(item => item.id == id)
        if (data) {
          this.setCurrentData(data)
        }
      }
      if (this.currentData.id == id) {
        return this.$emit('loadOneOK', () => {
          this.setCurrentData(this.currentData)
        }, this.currentData, true)
      }
      if (!this.url) {
        return
      }
      let url = this.withSlash() + id
      this.loading = true
      this.emit({
        event: 'loadOne',
        params: [id, url],
        handle: (proceed, error, resultUrl) => {
          let method = this.breadMethods['read'] || 'get'
          if (!resultUrl) {
            resultUrl = url
          }
          if (this.lastUrl == resultUrl) {
            this.loading = false
            return
          }
          if (!this.isOnline) {
            return this.$emit('offline', 'loadOne', id)
          }
          this.lastUrl = resultUrl
          this.$http[method.toLowerCase()](resultUrl)
            .then(proceed)
            .catch(error)
        },
        proceed: resp => {
          this.loading = false
          this.emit({
            event: 'loadOneOK',
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.addData(resp.data)
              this.setCurrentData(resp.data)
            }
          })
        },
        cancel: () => {
          this.loading = false
          this.$emit('loadOneCanceled')
        },
        error: resp => {
          this.loading = false
          if (resp === false) {
            return
          }
          this.emit({
            event: 'loadOneError',
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            }
          })
        }
      })
    },
    performFilter(filter) {
      if (filter) {
        this.filter = filter
      }
      this.resetData()
      this.loadMany({ useCache: false })
    },
    performSearch() {
      this.resetData()
      this.loadMany({ useCache: false })
    },
    save(formData, htmlForm) {
      if (this.working) {
        return
      }
      this.working = true
      if (!this.url) {
        if (!formData.id) {
          this.emit({
            event: 'addData',
            params: [formData, true],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: formData => {
              this.working = false
              this.addData({ id: Date.now(), ...formData })
              this.emit({
                event: 'addDataOK',
                params: [formData, true],
                handle: proceed => {
                  proceed()
                },
                proceed: () => {
                  this.resetNewData()
                }
              })
            },
            cancel: () => {
              this.working = false
              this.$emit('addDataCanceled')
            },
            error: formData => {
              this.working = false
            }
          })
        }
        else {
          this.emit({
            event: 'editData',
            params: [formData, true],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: formData => {
              this.updateData(Object.assign({}, formData))
              this.emit({
                event: 'editDataOK',
                params: [formData, true]
              })
            },
            cancel: () => {
              this.working = false
              this.$emit('editDataCanceled')
            },
            error: formData => {
              this.working = false
            }
          })
        }
        return
      }

      let action = 'add',
        url = this.withSlash()
      if (formData.id) {
        action = 'edit'
        url += formData.id
      }

      this.emit({
        event: `${action}Data`,
        params: [formData, htmlForm],
        handle: (proceed, error, result) => {
          if (!this.isOnline) {
            return this.$emit('offline', 'save', formData, htmlForm)
          }
          let _action = this.breadMethods[action].toLowerCase()
          let data = _action == 'put' || !htmlForm
            ? (result || formData)
            : new FormData(htmlForm)
          this.$http[_action]
            (url, data)
            .then(proceed)
            .catch(error)
        },
        proceed: resp => {
          this.emit({
            event: `${action}DataOK`,
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              if (action === 'add') {
                this.addData(resp.data)
              }
              else {
                this.updateData(resp.data)
              }
              this.working = false
            }
          })
        },
        cancel: () => {
          this.working = false
          this.$emit(`${action}DataCanceled`)
        },
        error: resp => {
          if (resp === false) {
            this.working = false
            return
          }
          this.emit({
            event: `${action}DataError`,
            params: [resp],
            handle: (proceed, error, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.working = false
            }
          })
        }
      })
    },
    searchQueryChanged(query) {
      this.search = query
    },
    urlChanged (config = {}) {
      if (this.readOnlyId) {
        this.loadOne(this.readOnlyId)
      } else {
        this.loadMany(config)
      }
    },
    withSlash(url) {
      if (!url) {
        url = this.url
      }
      return url.endsWith('/') ? url : `${url}/`
    }
  }
}
</script>
