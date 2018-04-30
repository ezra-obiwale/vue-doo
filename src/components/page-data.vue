<template>
  <div>
    <button v-show="canLoadMore" :class="buttonClass" @click="loadMore">{{ buttonText }}</button>
    <loading v-show="loading" :icon="loadingIcon" :color="loadingColor"></loading>
  </div>
</template>

<script>
import Loading from "./loading";
export default {
  props: {
    buttonClass: {
      type: String,
      default: ""
    },
    buttonText: {
      type: String,
      default: "Load More"
    },
    currentPage: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hasNext: {
      type: [Function, Boolean],
      default: function () {
        return true;
      }
    },
    loadingColor: {
      type: String
    },
    loadingIcon: {
      type: Number,
      default: 1
    },
    pageKey: {
      type: String,
      default: 'page'
    },
    path: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    canLoadMore() {
      return (
        !this.loading &&
        this.hasNext()
      );
    },
    nextPage() {
      return this.currentPage + 1;
    }
  },
  components: {
    Loading
  },
  methods: {
    loadMore() {
      this.load(`${this.path}?${this.pageKey}=${this.nextPage}`);
    },
    load(url) {
      this.loading = true;
      this.$http.get(url)
        .then(resp => {
          this.$emit('requestOK', resp, this.nextPage);
          this.loading = false;
        })
        .catch(resp => {
          this.$emit('requestError', resp);
        });
    }
  },
  mounted() {
    if (!this.currentPage && !this.data.length) {
      this.load(this.path);
    }
  },
  watch: {
    currentPage(value) {
      if (!value) {
        this.load(this.path);
      }
    }
  }
};
</script>
