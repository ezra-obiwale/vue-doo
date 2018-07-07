<template>
  <div>
    <slot
      :data="data"
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
          deleteSelected: 'POST'
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
          deleteSelected: 'Delete successful'
        }
      }
    },
    url: {
      type: String
    }
  },
  data () {
    return {
      formData: {},
      loading: false,
      working: false
    }
  },
  computed: {
    ...mapGetters('vd-rd', {
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
        if (this.defaultData) {
          return this.defaultData = data
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
  created () {
    if (this.$store) {
      this.$store.registerModule('vd-rd', store, { preserveState: true })
    }
    this.scopeTo(this.collection || Date.now())

    if (!this.data.length ||
      (this.readOnlyId && !this.data.find(d => d.id == this.readOnlyId))) {
      this.urlChanged()
    }
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
      setFilter: 'SET_FILTER',
      updateData: 'UPDATE_CURRENT_DATA'
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
    deleteManyByIds(ids) {
        this.$q.loading.show()
        this.emit({
          event: 'deleteSelected',
          params: [ids],
          proceed: resp => {
            this.emit({
              event: 'deleteSelectedOK',
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
            if (resp === false) {
              return
            }
            this.emit({
              event: 'deleteSelectedError',
              params: [resp],
              handle: (proceed, cancel, result) => {
                proceed(result || resp)
              },
              proceed: resp => {
                this.processErrors(resp)
              }
            })
          },
          handle: (proceed, cancel) => {
            if (!this.url) {
              this.removeManyByIds(ids)
              return this.$emit('deleteSelectedOK', () => {
              }, ids, true)
            }
            let method = this.breadMethods['deleteSelected'] || 'post'
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
    hideFormModal () {
      this.canShowFormModal = false
    },
    loadMany(config = {}) {
      let pagination = config.pagination || this.pagination
      if (!this.url) {
        if (this.defaultData) {
          if (!this.data.length) {
            this.loadData({
              data: this.defaultData,
              pagination,
              total: this.defaultData.length
            })
          }
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

      this.emit({
        event: 'loadMany',
        params: [fullUrl, pagination, this.search, this.filter],
        handle: (proceed, cancel, resultUrl, fullUrl) => {
          let method = this.breadMethods['browse'] || 'get'
          this.$http[method.toLowerCase()](resultUrl || fullUrl)
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
                pagination,
                total: this.deepValue('meta.total', resp, 0)
              })
              this.canShowFormModal = false
            }
          })
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
          this.$http[method.toLowerCase()](resultUrl || url)
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
    save() {
      this.working = true
      if (this.formModal.handler) {
        return this.formModal.handler(() => {
          this.working = false
        }, {
          form: this.$refs.formModalForm,
          currentData: this.formData
        })
      }
      else if (!this.url) {
        if (!this.formData.id) {
          this.emit({
            event: 'addData',
            params: [this.formData, true],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: formData => {
              this.working = false
              this.addData({ id: Date.now(), ...formData })
              this.canShowFormModal = false
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
            params: [this.formData, true],
            handle: (proceed, cancel, result) => {
              proceed(result || resp)
            },
            proceed: formData => {
              this.updateData(Object.assign({}, formData))
              this.canShowFormModal = false
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
      if (this.formData.id) {
        action = 'edit'
        url += this.formData.id
      }

      this.emit({
        event: `${action}Data`,
        params: [this.formData, this.$refs.formModalForm],
        handle: (proceed, cancel, result) => {
          let _action = this.breadMethods[action].toLowerCase()
          let data = _action == 'put'
            ? (result || this.formData)
            : new FormData(this.$refs.formModalForm)
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
              this.canShowFormModal = false
              this.$refs.formModalForm.reset()
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
    showFormModal() {
      this.canShowFormModal = true
    },
    tableRowActions() {
      let buttons = []
      if (this.table.rowActions !== false) {
        let rowActions = {},
          standard = ['view', 'edit', 'delete']
        if (typeof this.table.rowActions == 'function') {
          rowActions = this.table.rowActions(...arguments)
        } else if (typeof this.table.rowActions == 'object') {
          rowActions = this.table.rowActions
        }
        standard.forEach(action => {
          if (rowActions[action] === undefined) {
            rowActions[action] = true
          }
        })

        const ucfirst = str => str[0].toUpperCase() + str.substr(1)

        for (let action in rowActions) {
          if (action == 'custom') {
            continue
          }
          let rowAction = rowActions[action],
            button = Object.assign({}, rowAction)
          if (rowAction !== false) {
            if (typeof button !== 'object') {
              button = {}
            }

            button.text = button.text || ucfirst(action)
            let defaultIcon = ''
            switch (action) {
              case 'view':
                defaultIcon = 'folder_open'
                break;
              case 'edit':
                defaultIcon = 'edit'
                break;
              case 'delete':
                defaultIcon = 'delete'
                break;
            }
            if (!button.icon && button.icon !== false) {
              button.icon = defaultIcon
            }
            button.handler = button.handler || ((row) => {
              let handle = status => {
                if (status !== false) {
                  if (action == 'delete') {
                    this.delete(row.id, row.__index)
                  }
                  else {
                    this.setCurrentData(row)
                    if (this.$refs.formModal) {
                      this.$refs.formModal.show()
                    }
                  }
                }
              }
              if (typeof rowAction.handler == 'function') {
                rowAction.handler(handle, row)
              }
              else {
                handle()
              }
            })

            buttons.push(button)
          }
        }

        return [...buttons, ...(rowActions.custom || [])]
      }

      return buttons
    },
    urlChanged () {
      if (this.readOnlyId) {
        this.loadOne(this.readOnlyId)
      } else {
        this.loadMany()
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
    currentData: {
      deep: true,
      handler(data) {
        this.$set(this, 'formData', { ...data })
        this.$emit('currentDataUpdated', data)
      }
    },
    formData: {
      deep: true,
      handler(data) {
        this.$emit('formDataUpdated', data)
      }
    },
    id (id) {
      this.urlChanged()
    },
    search (newSearch, oldSearch) {
      if (oldSearch && !newSearch) {
        this.loadMany()
      }
    },
    subtitle (subtitle) {
      this.setHeaderSubtitle(subtitle)
    },
    title (title) {
      this.setHeaderTitle(title)
    },
    url () {
      this.urlChanged()
    }
  }
}
</script>
