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
    append: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: "Load More"
    },
    buttonClass: {
      type: String,
      default: "button small"
    },
    loadingColor: {
      type: String
    },
    loadingIcon: {
      type: Number,
      default: 1
    },
    path: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      meta: {}
    };
  },
  computed: {
    canLoadMore() {
      return (
        !this.loading &&
        this.deepValue("pagination.next_page_url", this.meta, false)
      );
    }
  },
  components: {
    Loading
  },
  methods: {
    loadMore() {
      this.load(this.meta.pagination.next_page_url);
    },
    load(url) {
      this.loading = true;
      this.$http.get(url).then(resp => {
        this.loading = false;
        this.set("meta", resp.meta, this);
        if (this.append) {
          this.set('data', this.data.concat(resp.data), this);
        }
        else {
          this.set('data', resp.data, this);
        }
        this.$emit("dataLoaded", this.data);
      });
    }
  },
  mounted() {
    this.load(this.path);
  }
};
</script>
