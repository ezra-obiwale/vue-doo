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
    }
  },
  data () {
    return {
      lastUrl: null,
      loading: false,
      working: false
    }
  },
  computed: {
    data: {
      get () {
        return this.storeData
      },
      set (data) {
        if (Array.isArray(this.dummyData)) {
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
  beforeCreate () {
    if (this.$store) {
      this.$store.registerModule('vd-rd', store)
      this.$options.computed = {
        ...mapGetters('vd-rd', {
          currentData: 'currentData',
          pagination: 'pagination',
          storeFilter: 'filter',
          storeData: 'data',
          searchQuery: 'searchQuery'
        }),
      ...this.$options.computed
      }
    }
  },
  created () {
    this.scopeTo(this.collection || Date.now())

    this.urlChanged()
  },
  beforeDestroy () {
    if (this.$store) {
      this.$store.unregisterModule('vd-rd')
    }
  },
  methods: {
    ...mapMutations('vd-rd', {
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
      updateRowsPerPage: 'UPDATE_ROWS_PER_PAGE'
    }),
    delete (id, index) {
      let row = this.getData(id, index)
      this.emit({
        event: 'delete',
        params: [row],
        proceed: resp => {
          this.working = false
          this.emit({
            event: 'deleteOK',
            params: [resp, false],
            handle: (proceed, cancel, result) => {
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
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.processErrors(resp)
            }
          })
        },
        cancel: () => {
          this.working = false
          this.$emit('deleteCanceled')
        },
        handle: (proceed, cancel) => {
          if (!this.url) {
            return proceed(row)
          }
          let method = this.breadMethods['delete'] || 'delete'
          this.$http[method.toLowerCase()](this.withSlash() + id)
          .then(proceed)
          .catch(error)
        }
      })
    },
    deleteMany(ids) {
      this.emit({
        event: 'deleteMany',
        params: [ids],
        proceed: resp => {
          this.emit({
            event: 'deleteManyOK',
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.removeManyByIds(ids)
            }
          })
        },
        cancel: resp => {
          this.working = false
          this.emit({
            event: 'deleteManyError',
            params: [resp]
          })
        },
        handle: (proceed, cancel) => {
          if (!this.url) {
            this.removeManyByIds(ids)
            return this.$emit('deleteManyOK', () => {}, ids, true)
          }
          let method = this.breadMethods['deleteMany'] || 'post'
          this.$http[method.toLowerCase()](this.withSlash() + 'delete-many', {
            ids: ids
          })
          .then(proceed)
          .catch(cancel)
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
        ignoreCache = config.ignoreCache || false

      if (this.data.length && !ignoreCache) {
        return this.$emit('loadManyOK', () => {}, this.data, true)
      }

      if (!this.url) {
        if (this.dummyData && !this.data.length) {
          this.loadData({
            data: this.dummyData,
            pagination,
            total: this.dummyData.length
          })
        }
        return this.$emit('loadManyOK', () => {}, this.data, true)
      }
      this.loading = true

      let fullUrl = `${this.url}?page=${pagination.page}`
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

      this.emit({
        event: 'loadMany',
        params: [fullUrl, pagination, this.search, this.filter],
        handle: (proceed, cancel, resultUrl) => {
          let method = this.breadMethods['browse'] || 'get'
          if (!resultUrl) {
            resultUrl = fullUrl
          }
          if (this.lastUrl == fullUrl) {
            this.loading = false
            return
          }
          this.lastUrl = fullUrl
          this.$http[method.toLowerCase()](resultUrl)
            .then(proceed)
            .catch(cancel)
        },
        proceed: resp => {
          this.loading = false
          this.emit({
            event: 'loadManyOK',
            params: [resp],
            handle: (proceed, cancel, result) => {
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
            }
          })
          if (typeof this.totalRowsCount == 'function') {
            let count = this.totalRowsCount(resp)
            if (count !== undefined) {
              this.setRowsCount(count)
            }
          }
        },
        cancel: resp => {
          this.loading = false
          if (resp === false) {
            return
          }
          this.emit({
            event: 'loadManyError',
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.processErrors(resp)
            }
          })
        }
      })
    },
    loadOne(id) {
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
        handle: (proceed, cancel, resultUrl) => {
          let method = this.breadMethods['read'] || 'get'
          if (!resultUrl) {
            resultUrl = fullUrl
          }
          if (this.lastUrl == resultUrl) {
            this.loading = false
            return
          }
          this.lastUrl = resultUrl
          this.$http[method.toLowerCase()](resultUrl)
            .then(proceed)
            .catch(cancel)
        },
        proceed: resp => {
          this.loading = false
          this.emit({
            event: 'loadOneOK',
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.addData(resp.data)
              this.setCurrentData(resp.data)
            }
          })
        },
        cancel: resp => {
          this.loading = false
          if (resp === false) {
            return
          }
          this.emit({
            event: 'loadOneError',
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.processErrors(resp)
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
      this.loadMany()
    },
    performSearch() {
      this.resetData()
      this.loadMany()
    },
    save(formData, htmlForm) {
      this.working = true
      if (!this.url) {
        if (!formData.id) {
          this.emit({
            event: 'addData',
            params: [formData, true],
            handle: (proceed, cancel, result) => {
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
            cancel: formData => {
              this.working = false
              if (resp === false) {
                return
              }
            }
          })
        }
        else {
          this.emit({
            event: 'editData',
            params: [formData, true],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: formData => {
              this.updateData(Object.assign({}, formData))
              this.emit({
                event: 'editDataOK',
                params: [formData, true]
              })
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
        handle: (proceed, cancel, result) => {
          let _action = this.breadMethods[action].toLowerCase()
          let data = _action == 'put' || !htmlForm
            ? (result || formData)
            : new FormData(htmlForm)
          this.$http[_action]
            (url, data)
            .then(proceed)
            .catch(cancel)
        },
        proceed: resp => {
          this.emit({
            event: `${action}DataOK`,
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              if (action === 'add') {
                this.addData(resp.data)
                this.$set(this, 'formData', {})
              }
              else {
                this.updateData(resp.data)
              }
              this.working = false
            }
          })
        },
        cancel: resp => {
          if (resp === false) {
            this.working = false
            return
          }
          this.emit({
            event: `${action}DataError`,
            params: [resp],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: resp => {
              this.working = false
              this.$emit(`${action}DataError`, resp)
              this.processErrors(resp)
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
        this.loadMany({ ignoreCache: true })
      }
    },
    totalRowsCount (count) {
      this.setRowsCount(count)
    },
    url () {
      this.urlChanged({ ignoreCache: true })
    }
  }
}
</script>
