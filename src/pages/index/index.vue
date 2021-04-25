<template>
  <view class="content container">
    <Lingzhi v-for="(item,index) in list" :key="item.id"
             :imgList="item.imgList"
             :avatar="item.avatar"
             :name="item.name"
             :publishTime="item.publishTime"
             :content="item.content"
             :isLike="item.isLike"
             :isGiveReward="item.isGiveReward"
             :likeNumber="item.likeNumber"
             :giveRewardNumber="item.giveRewardNumber"
             :chatNumber="item.chatNumber"
             @clickDynamic="clickDynamic(index)"
             @clickUser="clickUser(item.id)">
    </Lingzhi>
  </view>
</template>

<script>
import Lingzhi from '@/components/lingzhi/lingzhi'

export default {
  components: {
    Lingzhi,
  },
  data() {
    return {
      title: 'Hello',
      list: [
        {
          id: 1,
          avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg',
          name: '执笔看墨花开',
          publishTime: 1617086756,
          content: '中国外交官这样讽加拿大总理，算不算骂？该不该骂？',
          imgList: [
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg'
          ],
          isLike: true,
          isGiveReward: true,
          likeNumber: 2,
          giveRewardNumber: 2,
          chatNumber: 2,
          isFocusOn: true,
        },

        {
          id: 2,
          avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2291332875,175289127&fm=26&gp=0.jpg',
          name: '执笔看墨花开',
          publishTime: 1617036656,
          content: '  足不出户享国内核医学领域顶级专家云诊断，“中山-联影”分子影像远程互联融合创新中心揭牌 ',
          imgList: [
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg'
          ],
          isLike: false,
          isGiveReward: false,
          likeNumber: 0,
          giveRewardNumber: 0,
          chatNumber: 2,
          isFocusOn: false,
        },
        {
          id: 3,
          avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg',
          name: '执笔看墨花开',
          publishTime: 1617046556,
          content: '  外交部：一小撮国家和个人编造所谓新疆“强迫劳动”的故事，其心何其毒也！ ',
          imgList: [
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg'
          ],
          isLike: true,
          isGiveReward: false,
          likeNumber: 4,
          giveRewardNumber: 22,
          chatNumber: 52,
        },
        {
          id: 4,
          avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2590128318,632998727&fm=26&gp=0.jpg',
          name: '萧玲芝',
          publishTime: 1616086456,
          content: 'DCloud有800万开发者,uni统计手机端月活12亿。是开发者数量和案例最丰富的多端开发框架。 欢迎知名开发商提交案例或接入uni统计。 新冠抗疫专区案例 uni-app助力',
          imgList: [
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg'
          ],
          isLike: true,
          isGiveReward: false,
          likeNumber: 25,
          giveRewardNumber: 0,
          chatNumber: 7,
        },
        {
          id: 5,
          avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2590128318,632998727&fm=26&gp=0.jpg',
          name: '萧玲芝',
          publishTime: 1607086356,
          content: '划个水',
          imgList: [
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
            'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
            'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg'
          ],
          isLike: true,
          isGiveReward: true,
          likeNumber: 3,
          giveRewardNumber: 2,
          chatNumber: 2,
        }
      ],
    }
  },
  onLoad() {

  },
  methods: {
    clickDynamic(e) {
      console.log('childDynamic')
    },
    // 点击用户信息
    clickUser(e) {
      console.log(e)
      console.log('childUser')
    },
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
