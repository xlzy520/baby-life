<template>
  <view class="content">
    <view class="text-area">
      <text class="title mt-16 w-1_2 h-1_2">{{ title }}</text>
    </view>
    <button @click="uploadImg">上传图片</button>
    <button @click="uploadVideo">上传视频</button>
    <view class="">
      <img :src="img" mode="aspectFit" alt="">
    </view>
    <view class="">
      <video :src="video"></video>
    </view>
  </view>
</template>

<script>
import { dbRequest } from '@/api/common'

export default {
  data() {
    return {
      title: 'Hello',
      img: 'cloud://lxx-1gg4sx24e0ca54d5.6c78-lxx-1gg4sx24e0ca54d5-1305723620/my-image.jpg',
      video: 'cloud://lxx-1gg4sx24e0ca54d5.6c78-lxx-1gg4sx24e0ca54d5-1305723620/my-image.mov'
    }
  },
  onLoad() {

  },
  methods: {
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          // this.setData({
          //   avatarUrl: res.userInfo.avatarUrl,
          //   userInfo: res.userInfo,
          //   hasUserInfo: true,
          // })
        }
      })
    },
    // 上传图片
    uploadImg() {
      // 选择图片
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          wx.showLoading({
            title: '上传中',
          })

          const filePath = res.tempFilePaths[0]

          // 上传图片
          const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
              console.log(cloudPath, filePath)

              // app.globalData.fileID = res.fileID
              // app.globalData.cloudPath = cloudPath
              // app.globalData.imagePath = filePath

              // wx.navigateTo({
              //   url: '../storageConsole/storageConsole'
              // })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        },
        fail: e => {
          console.error(e)
        }
      })
    },
    uploadVideo(){
      uni.chooseVideo({
        maxDuration: 999999,
        sourceType: ['album', 'camera'],
        compressed: false,
        success: (res) => {
          wx.showLoading({
            title: '上传中',
          })

          // duration: 5.45
          // errMsg: "chooseVideo:ok"
          // height: 542
          // size: 463583
          // tempFilePath: "http://tmp/61dNjAPTSXHo5f2b570fc1c42af867646c60b96b23e7.mov"
          // thumbTempFilePath: "http://tmp/Z1ha3xWriQxp5c5219652cdb93bc4b1d170cf8fcb437.jpg"
          // width: 1376
          const filePath = res.tempFilePath

          // 上传图片
          const cloudPath = `my-video${filePath.match(/\.[^.]+?$/)[0]}`
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
              console.log(cloudPath, filePath)

              // app.globalData.fileID = res.fileID
              // app.globalData.cloudPath = cloudPath
              // app.globalData.imagePath = filePath

              // wx.navigateTo({
              //   url: '../storageConsole/storageConsole'
              // })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        },
        fail: e => {
          console.error(e)
        }
      })
    }
  },
  mounted() {
    this.getUserProfile()
    const actions = [
      { method: 'where', condition: { count: 1 } },
      { method: 'get' }
    ]
    const actions1 = [
      { method: 'where', condition: { count: 1 } },
      { method: 'update', condition: { data: { count: 2 } } }
    ]
    // dbRequest('video', actions).then(res => {
    //
    // })
    // dbRequest('video', actions1).then(res => {
    //   console.log(res)
    // })
  },
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
