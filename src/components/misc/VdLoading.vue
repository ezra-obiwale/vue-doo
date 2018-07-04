<template>
    <!-- Credit: https://codepen.io/aurer/pen/jEGbA -->
    <!-- 1 -->
    <svg v-if="show(1)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    :width="svgWidth" :height="svgHeight" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
      <path opacity="0.2" :fill="color" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
      <path :fill="color" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
      C22.32,8.481,24.301,9.057,26.013,10.047z">
        <animateTransform attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="0.5s"
          repeatCount="indefinite"/>
      </path>
    </svg>

    <!-- 2 -->
    <svg v-else-if="show(2)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        :width="svgWidth" :height="svgHeight" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <path :fill="color" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
        <animateTransform attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"/>
        </path>
    </svg>

    <!-- 3  -->
    <svg version="1.1" v-else-if="show(3)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        :width="svgWidth" :height="svgHeight" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <path :fill="color" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
        <animateTransform attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"/>
        </path>
    </svg>

    <!-- 4 -->
    <svg version="1.1" v-else-if="show(4)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      :width="svgWidth" :height="svgHeight" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform  attributeType="xml"
          attributeName="transform" type="scale"
          values="1,1; 1,3; 1,1"
          begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>

      <rect x="10" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform  attributeType="xml"
          attributeName="transform" type="scale"
          values="1,1; 1,3; 1,1"
          begin="0.2s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform  attributeType="xml"
          attributeName="transform" type="scale"
          values="1,1; 1,3; 1,1"
          begin="0.4s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

    <!-- 5 -->
    <svg version="1.1" v-else-if="show(5)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      :width="svgWidth" :height="svgHeight" viewBox="0 0 40 40" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.2s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.4s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

    <!-- 6 -->
    <svg version="1.1" v-else-if="show(6)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      :width="svgWidth" :height="svgHeight" viewBox="0 0 40 40" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="13" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="height" attributeType="XML"
          values="5;21;5"
          begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML"
          values="13; 5; 13"
          begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="13" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="height" attributeType="XML"
          values="5;21;5"
          begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML"
          values="13; 5; 13"
          begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="13" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="height" attributeType="XML"
          values="5;21;5"
          begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML"
          values="13; 5; 13"
          begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

    <!-- 7 -->
    <svg version="1.1" v-else-if="show(7)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      :width="svgWidth" :height="svgHeight" viewBox="0 0 40 40" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="opacity" attributeType="XML"
          values="1; .2; 1"
          begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="7" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="opacity" attributeType="XML"
          values="1; .2; 1"
          begin="0.2s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="14" y="0" :width="rectWidth" :height="rectHeight" :fill="color">
        <animate attributeName="opacity" attributeType="XML"
          values="1; .2; 1"
          begin="0.4s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

    <!-- 8 -->
    <svg version="1.1" v-else-if="show(8)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      :width="svgWidth" :height="svgHeight" viewBox="0 0 40 40" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="10" :width="rectWidth" :height="rectHeight" :fill="color" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="8" y="10" :width="rectWidth" :height="rectHeight" :fill="color"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="10" :width="rectWidth" :height="rectHeight" :fill="color"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

    <span v-else>loading ...</span>
</template>

<script>
export default {
  name: 'VdLoading',
  props: {
    color: {
      type: String,
      default: "#333"
    },
    height: String,
    icon: {
      type: Number,
      default: 1
    },
    width: String
  },
  computed: {
    svgHeight() {
      if (this.height) {
        return this.height;
      } else {
        switch (this.icon) {
          case 1:
          case 2:
          case 3:
            return "40px";
          default:
            return "24px";
        }
      }
    },
    svgWidth() {
      if (this.width) {
        return this.width;
      } else {
        switch (this.icon) {
          case 1:
          case 2:
          case 3:
            return "40px";
          case 4:
            return "24px";
          default:
            return "30px";
        }
      }
    },
    rectWidth() {
      return parseInt(parseInt(this.svgWidth) / 6);
    },
    rectHeight() {
      switch (this.icon) {
        case 4:
          return parseInt(parseInt(this.svgHeight) / 3) + 1;
        case 5:
          return parseInt(parseInt(this.svgHeight) / 3);
        case 6:
          return parseInt(parseInt(this.svgHeight) / 6);
        case 7:
          return parseInt(parseInt(this.svgHeight) / 3) * 2;
        case 8:
          return parseInt(parseInt(this.svgHeight) / 3);
      }
    }
  },
  methods: {
    show(num) {
      return this.icon === num;
    }
  }
}
</script>
