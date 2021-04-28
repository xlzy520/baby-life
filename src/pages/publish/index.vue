<template>
  <!-- 组件必须设置高度，否则内部容器填充不起来 -->
  <view class="w-full overflow-auto album-content">
    <r-album ref="rAlbum" v-model="list" @sort="onAlbumSort" @click="onAlbumClick"
             @add="onAlbumAdd" @delete="onAlbumDelete">
      <template v-slot:before>
        <view class="px-3 pt-2">
          <u-input v-model="content" type="textarea" :focus="false" :maxlength="927"
                   class="moment-think" height="50" :auto-height="false"
                   placeholder="这一刻的想法..." />
        </view>
      </template>
      <template v-slot:after>
        <view class="px-2 pb-2">
          <u-cell-group>
            <u-cell-item title="萧潇提示" value="可选择36张图片，一次最多9张" icon="star" :arrow="false" />
          </u-cell-group>
          <u-cell-group>
            <u-cell-item title="所在位置" :value="location" icon="map" />
          </u-cell-group>
          <u-button type="success" open-type="getUserProfile" @click="prePublish" ripple
                    :loading="loading">发表</u-button>
        </view>
      </template>
    </r-album>
  </view>
</template>

<script>
import RAlbum from '@/components/r-album'
import { ImgList } from '@/utils/enum'
import { dbRequest } from '@/api/common'

export default {
  components: {
    RAlbum,
  },
  data() {
    return {
      // id是DB主键，如果id重复会造成在拖拽排序时候，会影响相同ID的元素
      list: [],
      content: '',
      location: '深圳市',
      loading: false,
      userInfo: null,
      openid: '',
    }
  },
  onLoad() {
    this.openid = uni.getStorageSync('openid')
    this.userInfo = uni.getStorageSync('userInfo')
  },
  methods: {
    queryOpenid(openid) {
      const actions = [
        {
          method: 'where',
          params: {
            openid,
          },
        }, { method: 'get' }
      ]
      return dbRequest('user', actions)
    },
    addUser(openid, userInfo) {
      const actions = [
        {
          method: 'add',
          params: {
            data: {
              openid,
              userInfo,
            },
          },
        }
      ]
      dbRequest('user', actions).then(res => {
        console.log(res)
      })
    },
    prePublish() {
      if (this.userInfo) {
        this.publish()
        return
      }
      wx.getUserProfile({
        desc: '完善用户信息',
        success: res => {
          const userInfo = res.userInfo
          const openid = this.openid
          uni.setStorageSync('userInfo', userInfo)
          this.userInfo = userInfo
          this.queryOpenid(openid).then(res => {
            if (!res.data.length) {
              this.addUser(openid, userInfo)
            }
            this.publish()
          })
        },
      })
    },
    publish() {
      const imgList = []
      if (this.$refs.rAlbum.list) {
        this.$refs.rAlbum.list.forEach(media => {
          if (media.cloudPath) {
            const {
              cloudPath, fileType, height, id, size, sortID, width,
            } = media
            imgList.push({
              cloudPath, fileType, height, id, size, sortID, width,
            })
          }
        })
      }
      const actions = [
        {
          method: 'add',
          params: {
            data: {
              openid: this.openid,
              content: this.content,
              location: this.location,
              publishTime: Date.now(),
              imgList,
              name: this.userInfo.nickName,
              avatar: this.userInfo.avatarUrl,
            },
          },
        }
      ]
      dbRequest('blog', actions).then(res => {
        uni.reLaunch({ url: '/pages/index/index?refresh=1' })
      })
    },
    onAlbumSort(list) {
      // 返回排序后的数组集合
      // 更新后台排序号
      console.info('排序成功')
    },
    onAlbumClick(res) {
      // 图片预览
      uni.previewImage(res.index, res.list)
    },
    onAlbumAdd(res) {
      // 新增图片，会返回图片的排序号和图片路径
      // 需要保存到后台后，然后add到组件中
      console.info('新增成功')
      console.log(res)
      this.$refs.rAlbum.add({
        id: res.cloudPath,
        sortID: res.sortID,
        src: res.src,
        ...res,
      })
    },
    onAlbumDelete(data) {
      // 返回删除的图片实体
      // 到后台删除
      console.info('删除成功')
    },
  },
}
</script>

<style lang="scss">
.moment-think{
  ::v-deep .u-input__input{
    height: 300upx;
  }
}
</style>
