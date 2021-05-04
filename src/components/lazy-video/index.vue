<template>
  <view class="layout-abs-center lazy-video" @click.stop="previewVideo">
    <u-image class="play-icon" src="/static/icon/play.png"
             width="60" height="60"></u-image>
    <image v-if="showThumb" :src="item.thumbCloudPath"
           mode="aspectFill" lazy-load
           :style="{width:imgWidth+'px','max-height':imgHeight+'px'}"></image>
    <video v-else :src="item.cloudPath"
           :style="{width:imgWidth+'px','max-height':imgHeight+'px'}"></video>
  </view>
</template>

<script>
export default {
  name: 'index',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    imgWidth: {
      type: Number,
      default: 0,
    },
    imgHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showThumb: true,
    }
  },
  methods: {
    previewVideo() {
      this.showThumb = false
    },
  },
}
</script>

<style lang="scss" scoped>
.play-icon{
  position: absolute;
}
.lazy-video{
  background: rgba(255,255,255,.6)
}
</style>
