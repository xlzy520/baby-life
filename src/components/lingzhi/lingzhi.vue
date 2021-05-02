<template>
  <view class="w-full" @click="clickDynamic">
    <view class="flex flex-auto overflow-hidden px-3 py-3">
      <view class="user__header-warp">
        <!-- 头像组 -->
        <view class="flex user__header" @click.stop="clickUser">
          <image class="layout-abs-center user__header-image" :src="detail.avatar"
                 mode="aspectFill"></image>
        </view>
      </view>
      <view class="flex flex-auto overflow-hidden user__content">
        <view class="layout-col-slide flex-auto overflow-hidden user__content-main">
          <text class="user__content-title truncate" @click.stop="clickUser()">{{ detail.name }}</text>
          <text class="user__content-note text-gray-400 truncate">{{
              timestampFormat(detail.publishTime) }}</text>
        </view>
        <view class="user__content-extra">
          <text class="text-gray-400 location">{{detail.location}}</text>
        </view>
      </view>
    </view>

    <view class="text break-words">{{detail.content}}</view>
    <view class="allImage">
      <view class="imgList">
        <view class="images" v-for="(item,index) in imgList" :key="index">
          <video class="oneimg" v-if="item.fileType === 'video'" :src="item.cloudPath"
                 :style="mediaStyle"></video>
          <image v-else @click.stop="previewImg(index)" class="oneimg" :src="item.cloudPath"
                 mode="aspectFill" lazy-load :style="mediaStyle"></image>
        </view>
      </view>
    </view>
    <divider />
  </view>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
    },
    detail: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      windowWidth: 0,	// 屏幕可用宽度
      windowHeight: 0,	// 屏幕可用高度
      imgWidth: 0,	// 图片宽度
      imgHeight: 0,	// 图片高度
    }
  },
  computed: {
    mediaStyle() {
      return {
        width: this.imgWidth + 'px',
        'max-height': this.imgHeight + 'px',
      }
    },
  },
  mounted() {
    const res = uni.getSystemInfoSync()
    this.windowHeight = res.windowHeight
    this.windowWidth = res.windowWidth

    this.judgeImg()
  },
  methods: {
    // 预览图片
    previewImg(current) {
      uni.previewImage({
        count: this.imgList[current].cloudPath,
        current,
        urls: this.imgList.map(v => v.cloudPath),
        longPressActions: {
          itemList: ['保存图片'],

        },
      })
    },
    // 自适应判断
    judgeImg() {
      if (this.imgList.length === 1) {
        this.imgWidth = this.windowWidth - 30
        this.imgHeight = this.windowHeight * (3 / 5).toFixed(0)
      } else {
        const width = this.windowWidth / 3.4
        this.imgWidth = width.toFixed(0)
        this.imgHeight = width.toFixed(0)
      }
    },
    timestampFormat(timestamp) {
      if (!timestamp) return ''
      const time = this.$dayjs(timestamp)
      const timestampDiff = Date.now() - timestamp // 参数时间戳与当前时间戳相差秒数

      const ret = time.fromNow()
      if (timestampDiff < 60 * 1000) { // 一分钟以内
        return '刚刚'
      } else if (timestampDiff < 3600 * 1000) { // 一小时前之内
        return ret
      } else if (time.isToday()) {
        return `今天 ${time.format('HH:mm')}`
      } else if (time.isYesterday()) {
        return `昨天 ${time.format('HH:mm')}`
      } else if (new Date().getFullYear().toString() === time.format('YYYY')) {
        return time.format('MM月DD日 HH时mm分ss')
      } else {
        return time.format('YYYY年MM月DD日 HH时mm分ss')
      }
    },

    /** 触发父级事件 */
    // 点击动态
    clickDynamic() {
      this.$emit('clickDynamic')
    },
    // 点击用户信息
    clickUser() {
      this.$emit('clickUser')
    },
    // 点击关注
    clickFocus() {
      this.$emit('clickFocus')
    },
    // 点赞
    clickThumbsup() {
      this.$emit('clickThumbsup')
    },
    // 点击打赏
    clickGiveReward() {
      this.$emit('clickGiveReward')
    },
    // 点击聊天
    clickChat() {
      this.$emit('clickChat')
    },
  },
}
</script>

<style>
.allImage {
  display: flex;
  margin-top: 10upx;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.imgList{
  margin: 0 3%;
}
.text{
  margin: 1% 3% 2%;
}
.images {
  margin-right: 10upx;
  display: inline-block;
}
.user__header, .user__header-image {
  width: 45px;
  height: 45px;
  border: 1px solid #eee;
  overflow: hidden;
  border-radius: 5px;
}
.user__header-image{
  flex-wrap: wrap-reverse;
}
.user__content{
  padding: 2px 0;
}
.user__content-main{
  padding-left: 10px;
}
.user__content-note{
  font-size: 11px;
}
.location{
  padding: 3px;
  font-size: 11px;
}

</style>
