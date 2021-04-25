<template>
  <view class="my-2" :style="{height: height, width: width, backgroundColor: bgColor}"></view>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  props: {
    bgColor: {
      type: String,
      default: '#E4E4E4',
    },
    width: {
      type: String,
      default: '750rpx',
    },
    height: {
      type: String,
      default: '2rpx',
    },

  },
  methods: {},
}
</script>
<style lang="scss">

</style>
