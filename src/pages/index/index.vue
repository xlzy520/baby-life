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
    <u-modal v-model="removeShow" show-cancel-button content="确认删除这条记录吗?"
             @confirm="removeItem"></u-modal>
    <u-action-sheet :list="actionList" v-model="actionListShow" @click="handleActionClick" />
    <u-loadmore :status="status" icon-type="flower" :load-text="loadText" />
  </view>
</template>

<script>
import Lingzhi from '@/components/lingzhi/lingzhi'
import { dbRequest } from '@/api/common'
import { getList } from '@/utils/mixins'
import { wxCloudCallFunction } from '@/utils/request'

const app = getApp()

export default {
  components: {
    Lingzhi,
  },
  mixins: [getList],
  data() {
    return {
      actionListShow: false,
      actionList: [
        { text: '修改发布时间' },
        { text: '修改发布内容' },
        {
          text: '删除这条内容',
          color: '#ff001c',
        }

      ],
      mode: 'date',
      calendarShow: false,
      curTarget: {},
      inputShow: false,
      removeShow: false,
      newContent: '',
      preTotal: 0,
      loaded: false
    }
  },
  onLoad(e) {
    console.log(e)

  },
  methods: {
    handleActionClick(index) {
      const actionMap = [
        'calendarShow',
        'inputShow',
        'removeShow'
      ]
      this[actionMap[index]] = true
    },
    changePublishTime(data) {
      const timestamp = this.$dayjs(data.result).valueOf()
      this.submitUpdate({
        publishTime: timestamp,
      })
      const imgList = this.curTarget.imgList
      if (imgList.length) {
        this.changeRelatedImgCreateTime(imgList, timestamp)
      }
    },
    changeRelatedImgCreateTime(imgList, timestamp) {
      wxCloudCallFunction('multiUpdate', {
        collectionName: 'album',
        ids: imgList.map(value => value.id),
        newData: {
          createTime: timestamp,
        },
      }).then(res => {
        this.$showToast('修改发布时间成功')
      })
    },
    changeContent() {
      this.submitUpdate({
        content: this.newContent,
      })
    },
    removeItem() {
      const actions = [
        {
          method: 'doc',
          params: [this.curTarget._id],
        },
        {
          method: 'remove',
        }
      ]
      dbRequest('blog', actions).then(res => {
        this.getList(true)
        this.preTotal -= 1
      })
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
      if (skipNum && skipNum !== this.preTotal) {
        actions.splice(0, 0, { method: 'skip', params: [skipNum] })
      }
      const query = new this.$av.Query('blog')
      query.limit(this.pageSize);
      query.skip(skipNum);
      query.descending('publishTime')
      query.find().then(res => {
        this.handleResFromMixin(res, v => v, isRefresh)
      }).finally(() => {
          uni.hideLoading()
          uni.stopPullDownRefresh()
        })
    },
    getCount() {
      const actions = [
        { method: 'count' }
      ]
      dbRequest('blog', actions)
        .then(res => {
          this.loaded = true
          if (res.total !== this.preTotal && this.loaded) {
            this.getList(true)
          }
          if (res.total === this.list.length) {
            this.status = 'nomore'
            this.noMore = true
          }
          this.preTotal = res.total
        })
    },
    clickDynamic(index) {
      this.curTarget = this.list[index]
      this.actionListShow = true
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
    this.getCount()
  },
}
</script>

<style lang="scss">

</style>
