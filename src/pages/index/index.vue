<template>
  <view class="content container">
    <Lingzhi v-for="(item,index) in list" :key="item.id"
             :imgList="item.imgList"
             :avatar="item.avatar"
             :name="item.name"
             :publishTime="item.publishTime"
             :content="item.content"
             :location="item.location"
             @clickDynamic="clickDynamic(index)"
             @clickUser="clickUser(item.id)">
    </Lingzhi>
  </view>
</template>

<script>
import Lingzhi from '@/components/lingzhi/lingzhi'
import { db, dbRequest } from '@/api/common'

export default {
  components: {
    Lingzhi,
  },
  data() {
    return {
      title: 'Hello',
      list: [],
    }
  },
  onLoad(e) {
    console.log(e)
    this.getList()
  },
  methods: {
    getList() {
      uni.showLoading({ title: '获取数据中...' })
      const actions = [
        { method: 'orderBy', params: ['publishTime', 'desc'] },
        { method: 'get' },
      ]
      dbRequest('blog', actions)
        .then(res => {
          console.log(res)
          this.list = res.data
        })
        .finally(() => {
          uni.hideLoading()
          uni.stopPullDownRefresh()
        })
    },
    clickDynamic(e) {
      console.log('childDynamic')
    },
    // 点击用户信息
    clickUser(e) {
      console.log(e)
      console.log('childUser')
    },
  },
  onPullDownRefresh() {
    this.getList()
  },
  onShow(e) {
    console.log(e)
    // this.getList()
  },
}
</script>

<style>
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
