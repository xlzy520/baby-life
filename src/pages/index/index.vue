<template>
  <view class="pb-1">
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
    <u-loadmore :status="status" icon-type="flower" :load-text="loadText" />
  </view>
</template>

<script>
import Lingzhi from '@/components/lingzhi/lingzhi'
import { db, dbRequest } from '@/api/common'
import { getList } from '@/utils/mixins'

export default {
  components: {
    Lingzhi,
  },
  mixins: [getList],
  data() {
    return {
      // list: [],

      // pageNum: 1,
      // pageSize: 20,
      // noMore: false
    }
  },
  onLoad(e) {
    console.log(e)
    // this.getList()
  },
  methods: {
    getList(isRefresh) {
      uni.showLoading({ title: '获取数据中...' })
      const skipNum = (this.pageNum - 1) * this.pageSize
      const actions = [
        { method: 'orderBy', params: ['publishTime', 'desc'] },
        { method: 'get' }
      ]
      if (skipNum) {
        actions.splice(0, 0, { method: 'skip', params: [skipNum] })
      }
      dbRequest('blog', actions)
        .then(res => {
          console.log(res)
          this.handleResFromMixin(res, v => v, isRefresh)
        }).catch(() => {
          this.status = 'nomore'
          this.noMore = true
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
  onReachBottom() {

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
</style>
