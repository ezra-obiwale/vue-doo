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
    hasNext: {
      type: Function,
      default: function() {
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
      nextPage: 2,
    };
  },
  computed: {
    canLoadMore() {
      return (
        !this.loading &&
        this.hasNext()
      );
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
          this.$emit('requestOK', resp, this.nextPage - 1);
          this.nextPage++;
          this.loading = false;
        })
        .catch(resp => {
          this.$emit('requestError', resp);
        });
    }
  },
  mounted() {
    this.load(this.path);
  }
};
</script>
