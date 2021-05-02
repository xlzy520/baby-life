<template>
  <view class="pb-1">
    <Lingzhi v-for="(item,index) in list"
             :key="item.id"
             :detail="item"
             :imgList="item.imgList"
             @clickDynamic="clickDynamic(index)"
             @clickUser="clickUser(item.id)">
    </Lingzhi>
    <u-calendar v-model="calendarShow" :mode="mode" @change="changePublishTime"></u-calendar>
    <u-modal v-model="inputShow" title="请输入新的内容" @confirm="changeContent">
      <view class="p-4 slot-content">
        <u-input v-model="newContent" type="textarea" :border="true" :height="100"
                 placeholder="请输入..."
                 :auto-height="true" />
      </view>
    </u-modal>
    <u-action-sheet :list="actionList" v-model="show" @click="handleActionClick"></u-action-sheet>
    <u-loadmore :status="status" icon-type="flower" :load-text="loadText" />
  </view>
</template>

<script>
import Lingzhi from '@/components/lingzhi/lingzhi'
import { dbRequest } from '@/api/common'
import { getList } from '@/utils/mixins'

export default {
  components: {
    Lingzhi,
  },
  mixins: [getList],
  data() {
    return {
      show: false,
      actionList: [
        { text: '修改发布时间' },
        { text: '修改发布内容' }
      ],
      mode: 'date',
      calendarShow: false,
      curTarget: {},
      inputShow: false,
      newContent: '',
    }
  },
  onLoad(e) {
    console.log(e)
  },
  methods: {
    handleActionClick(index) {
      const actionMap = [
        this.updatePublishTime,
        this.updateContent
      ]
      actionMap[index]()
    },
    updatePublishTime() {
      this.calendarShow = true
    },
    changePublishTime(data) {
      const timestamp = this.$dayjs(data.result).valueOf()
      this.submitUpdate({
        publishTime: timestamp,
      })
    },
    changeContent() {
      this.submitUpdate({
        content: this.newContent,
      })
    },
    updateContent() {
      this.inputShow = true
    },
    submitUpdate(data) {
      const actions = [
        {
          method: 'doc',
          params: [this.curTarget._id],
        },
        {
          method: 'update',
          params: {
            data,
          },
        }
      ]
      dbRequest('blog', actions).then(res => {
        this.getList(true)
      })
    },
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
    clickDynamic(index) {
      this.curTarget = this.list[index]
      this.show = true
    },
    // 点击用户信息
    clickUser(e) {
      console.log(e)
    },
  },
  onReachBottom() {

  },
  onPullDownRefresh() {
    this.getList()
  },
  onShow() {
    // this.getList()
  },
}
</script>

<style lang="scss">

</style>
